from supabase import Client

from app.repositories.appointment_repositories import AppointmentRepository
from app.schemas.appointments import Appointments, CreateAppointmentRequest, UpdateAppointmentRequest
from app.schemas.query import FilterAppointment
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
def update_appointment(appointment_id: int, request: UpdateAppointmentRequest, supabase: Client):
    appointment_repo = AppointmentRepository(supabase)
    response = appointment_repo.update_appointment(appointment_id,
                                                   request.model_dump(mode="json", exclude_unset=True))

    return ok(or_404(response, "Appointment not found"))


@handle_service_errors
def delete_appointment(appointment_id: int, supabase: Client):
    appointment_repo = AppointmentRepository(supabase)
    response = appointment_repo.delete_appointment(appointment_id)
    or_404(response, "Appointment not found")

    return ok(message="Appointment deleted successfully")
