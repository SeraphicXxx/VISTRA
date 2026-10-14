from app.repositories.base import insert_model
from app.repositories.staff_repositories import StaffRepository
from app.schemas.staff import StaffData, CreateStaffRequest
from app.schemas.user import STAFF_ROLE
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    get_supabase_admin,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404
from supabase import Client


@handle_service_errors
def create_staff(request: CreateStaffRequest, supabase: Client):
    staff_id = remove_ucc_domain(request.staff_id)

    user = provision_auth_or_raise(staff_id, request.password, STAFF_ROLE)

    staff_data = StaffData(
        id=user.id,
        staff_id=staff_id,
        **request.model_dump(
            exclude={"staff_id", "password"}
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

    return ok(message="Staff inserted into database")


@handle_service_errors
def get_staff_by_id(staff_id: str, supabase: Client):
    staff_repo = StaffRepository(supabase)
    response = staff_repo.get_by_id(staff_id)

    return ok(or_404(response, "Staff not found"))


@handle_service_errors
def delete_staff(staff_id: str, supabase: Client):
    staff_repo = StaffRepository(supabase)
    existing = staff_repo.get_by_id(staff_id)
    or_404(existing, "Staff not found")

    deleted = staff_repo.delete(staff_id)
    or_404(deleted, "Staff not found")

    delete_auth_or_500("Staff", existing["id"])

    return ok(message="Staff deleted successfully")


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
