from supabase import Client

from app.config.security import require_user_email
from app.repositories.dental_repositories import DentalRepository
from app.schemas.dental import DentalVisitCreateRequest
from app.schemas.query import FilterDental
from app.schemas.user import CurrentUser
from app.utils.email_utils import staff_id_format
from app.utils.service_helpers import handle_service_errors, ok, or_404


@handle_service_errors
def create_dental_record(request: DentalVisitCreateRequest, supabase: Client, current_user: CurrentUser):
    staff_id = staff_id_format(require_user_email(current_user))
    dental_repository = DentalRepository(supabase)

    dental_record_id = dental_repository.create(request, staff_id)

    if not dental_record_id:
        raise Exception("Failed to create dental record")

    dental_repository.create_odontogram(
        request.tooth_records,
        request.patient_id,
        dental_record_id
    )

    return ok(dental_record_id=dental_record_id)


@handle_service_errors
def get_all_dental_visits(filters: FilterDental, supabase: Client):
    dental_repository = DentalRepository(supabase)
    response = dental_repository.get_dental_visits(filters)

    return ok(response)


@handle_service_errors
def delete_dental_visit(dental_visit_id: int, supabase: Client):
    dental_repository = DentalRepository(supabase)
    or_404(
        dental_repository.get_visit_by_id(dental_visit_id),
        "Dental record not found",
    )
    dental_repository.delete_visit_cascade(dental_visit_id)

    return ok(message="Dental record deleted successfully")


@handle_service_errors
def get_dental_record_by_id(patient_id: str, dental_visit_id: int, supabase: Client):
    dental_repository = DentalRepository(supabase)
    response = dental_repository.get_dental_record(patient_id, dental_visit_id)

    return ok(or_404(response, "Dental record not found"))
