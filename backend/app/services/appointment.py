from supabase import Client

from app.config.security import require_user_email
from app.repositories.appointment_repositories import AppointmentRepository
from app.schemas.appointments import CreateAppointmentRequest, UpdateAppointmentRequest
from app.schemas.query import FilterAppointment
from app.schemas.user import CurrentUser
from app.utils.email_utils import staff_id_format
from app.utils.service_helpers import handle_service_errors, ok, or_404


@handle_service_errors
def create_appointment(request: CreateAppointmentRequest, supabase: Client):
    appointment_repo = AppointmentRepository(supabase)

    response = appointment_repo.create_appointment(request.model_dump(mode="json"))
    return ok(response)


@handle_service_errors
def get_all_appointments(filters: FilterAppointment, supabase: Client):
    appointment_repo = AppointmentRepository(supabase)
    response = appointment_repo.get_appointments(filters)

    return ok(response)


@handle_service_errors
def get_appointment_by_id(appointment_id: int, patient_id: str, supabase: Client):
    return ok(
        or_404(
            AppointmentRepository(supabase).get_appointment_by_id(appointment_id, patient_id),
            "Appointment not found",
        ),
    )


@handle_service_errors
def update_appointment(patient_id: str, appointment_id: int, request: UpdateAppointmentRequest, supabase: Client, current_user: CurrentUser):
    # Scope is enforced at the route (staff-only endpoint); the empty
    # update result below is the not-found signal, so no pre-read.
    # patient_id stays in the signature for the route contract.
    appointment_repo = AppointmentRepository(supabase)
    staff_id = staff_id_format(require_user_email(current_user))
    response = appointment_repo.update_appointment(appointment_id,
                                                   {**request.to_appointment_update(),
                                                    "staff_id": staff_id})

    return ok(or_404(response, "Appointment not found"))


@handle_service_errors
def delete_appointment(appointment_id: int, supabase: Client):
    appointment_repo = AppointmentRepository(supabase)
    response = appointment_repo.delete_appointment(appointment_id)
    or_404(response, "Appointment not found")

    return ok(message="Appointment deleted successfully")
