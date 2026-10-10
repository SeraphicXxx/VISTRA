from app.repositories.base import insert_model
from app.repositories.staff_repositories import StaffRepository
from app.schemas.staff import StaffData, CreateStaffRequest
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404
from supabase import Client


@handle_service_errors
def create_staff(request: CreateStaffRequest, supabase: Client):
    staff_id = remove_ucc_domain(request.staff_id)

    user = provision_auth_or_raise(staff_id, request.password, "staff")

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
