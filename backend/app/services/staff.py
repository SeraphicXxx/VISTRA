from app.repositories.base import insert_model
from app.repositories.staff_repositories import StaffRepository
from app.schemas.staff import (
    StaffData,
    CreateStaffRequest,
    StaffPermissionsInput,
    UpdateStaffPermissionsRequest,
)
from app.schemas.user import STAFF_ROLE
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    get_supabase_admin,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404
from fastapi import status, HTTPException
from postgrest.exceptions import APIError
from supabase import Client


@handle_service_errors
def create_staff(request: CreateStaffRequest, supabase: Client):
    staff_id = remove_ucc_domain(request.staff_id)

    user = provision_auth_or_raise(staff_id, request.password, STAFF_ROLE)

    staff_data = StaffData(
        id=user.id,
        staff_id=staff_id,
        **request.model_dump(
            exclude={"staff_id", "password", "permissions"}
        )
    )

    db_response = insert_model(supabase, "STAFF", staff_data)

    if not db_response["success"]:
        compensate_auth_user(
            user.id,
            db_response["message"],
            "Failed to insert staff into database and failed to delete "
            "user from auth",
        )

    # Permissions row: always present going forward (default-deny),
    # so reads never see a null they must interpret.
    staff_repo = StaffRepository(supabase)
    created_perms = staff_repo.insert_permissions(
        staff_id,
        (request.permissions or StaffPermissionsInput()).model_dump(),
    )

    if created_perms is None:
        staff_repo.delete(staff_id)
        compensate_auth_user(
            user.id,
            "Failed to insert staff permissions",
            "Failed to insert staff permissions and failed to delete "
            "user from auth",
        )

    return ok(message="Staff inserted into database")


@handle_service_errors
def get_all_staff(supabase: Client):
    staff_repo = StaffRepository(supabase)

    return ok(staff_repo.get_all_with_permissions())


@handle_service_errors
def get_staff_by_id(staff_id: str, supabase: Client):
    staff_repo = StaffRepository(supabase)
    record = or_404(staff_repo.get_by_id(staff_id), "Staff not found")

    return ok({**record, "permissions": staff_repo.get_permissions(staff_id)})


@handle_service_errors
def delete_staff(staff_id: str, supabase: Client):
    staff_repo = StaffRepository(supabase)
    existing = staff_repo.get_by_id(staff_id)
    or_404(existing, "Staff not found")

    # Permissions row first: its FK is NO ACTION, so deleting STAFF
    # while it exists would 409 on our own permissions record.
    # Absent for legacy rows — None is fine.
    staff_repo.delete_permissions(staff_id)

    try:
        deleted = staff_repo.delete(staff_id)
    except APIError as e:
        # Remaining NO ACTION children (e.g. appointments) block the
        # delete to conserve history: conflict, not a 500.
        if getattr(e, "code", None) == "23503":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Staff has linked records that block deletion",
            )

        raise

    or_404(deleted, "Staff not found")

    delete_auth_or_500("Staff", existing["id"])

    return ok(message="Staff deleted successfully")


@handle_service_errors
def update_staff_permissions(
    staff_id: str,
    request: UpdateStaffPermissionsRequest,
    supabase: Client,
):
    staff_repo = StaffRepository(supabase)
    or_404(staff_repo.get_by_id(staff_id), "Staff not found")

    payload = request.to_permissions_update()

    if not payload:
        raise ValueError(
            "No permission fields provided. Allowed: dental_module, "
            "medical_module, appointment_module, patient_module, "
            "staff_module."
        )

    updated = staff_repo.update_permissions(staff_id, payload)

    if updated is None:
        # Legacy row predating permissions: heal by inserting.
        updated = staff_repo.insert_permissions(staff_id, payload)

    return ok(or_404(updated, "Staff permissions not found"))


@handle_service_errors
def clock_out_all_staff():
    """Clear STAFF.is_active for everyone currently on duty.

    Called by the Postgres 5pm cron (direct DB update) and by the
    manual emergency endpoint (POST /api/v1/internal/emergency/
    clock-out-all). Uses the service-role client on purpose:
    presence is operational state. Returns how many rows flipped.
    """
    admin = get_supabase_admin()

    response = (
        admin.table("STAFF")
        .update({"is_active": False})
        .eq("is_active", True)
        .execute()
    )

    clocked_out = len(response.data or [])

    return ok(message=f"Clocked out {clocked_out} staff", count=clocked_out)
