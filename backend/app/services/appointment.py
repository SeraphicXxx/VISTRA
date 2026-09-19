from app.repositories.appointment_repositories import AppointmentRepository
from app.schemas.appointments import Appointments, CreateAppointmentRequest, UpdateAppointmentRequest


def create_appointment(request: CreateAppointmentRequest, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)

        response = appointment_repo.create_appointment(request.model_dump(mode="json"))
        return {
            "success": True,
            "data": response
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def get_all_appointments(supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.get_appointments()

        return {
            "success": True,
            "data": response
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def get_appointment_by_id(appointment_id: int, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.get_appointment_by_id(appointment_id)

        if response:
            return {
                "success": True,
                "data": response
            }
        else:
            return {
                "success": False,
                "message": "Appointment not found"
            }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def update_appointment(appointment_id: int, request: UpdateAppointmentRequest, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.update_appointment(appointment_id,
                                                       request.model_dump(mode="json", exclude_unset=True))

        if response:
            return {
                "success": True,
                "data": response
            }
        else:
            return {
                "success": False,
                "message": "Appointment not found"
            }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def delete_appointment(appointment_id: int, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.delete_appointment(appointment_id)

        if response:
            return {
                "success": True,
                "message": "Appointment deleted successfully"
            }
        else:
            return {
                "success": False,
                "message": "Appointment not found"
            }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
