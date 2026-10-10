from app.config.security import require_user_email
from app.repositories.medical_repositories import MedicalRepositories
from app.schemas.medical import MedicalVisitCreateRequest
from app.utils.email_utils import staff_id_format
from app.utils.service_helpers import handle_service_errors, ok, or_404


@handle_service_errors
def create_medical_record(request: MedicalVisitCreateRequest, supabase, current_user):
    staff_id = staff_id_format(require_user_email(current_user))
    medical_repository = MedicalRepositories(supabase)

    medical_visit_id = medical_repository.create(request, staff_id)

    if not medical_visit_id:
        raise Exception("Failed to create medical record")

    return ok(medical_visit_id=medical_visit_id)


@handle_service_errors
def get_all_medical_visits(filters, supabase):
    medical_repository = MedicalRepositories(supabase)
    response = medical_repository.get_medical_visits(filters)

    return ok(response)


@handle_service_errors
def get_medical_record_by_id(patient_id: str, medical_visit_id: int, supabase):
    medical_repository = MedicalRepositories(supabase)
    response = medical_repository.get_medical_record(patient_id, medical_visit_id)

    return ok(or_404(response, "Medical record not found"))


@handle_service_errors
def delete_medical_visit(medical_visit_id: int, supabase):
    medical_repository = MedicalRepositories(supabase)
    deleted = medical_repository.delete_visit(medical_visit_id)
    or_404(deleted, "Medical record not found")

    return ok(message="Medical record deleted successfully")
