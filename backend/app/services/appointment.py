from fastapi import HTTPException, status

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


def get_all_appointments(filters, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.get_appointments(filters)

        return {
            "success": True,
            "data": response
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def get_appointment_by_id(appointment_id: int, patient_id: str, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.get_appointment_by_id(appointment_id, patient_id)

        if response:
            return {
                "success": True,
                "data": response
            }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


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

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


def delete_appointment(appointment_id: int, supabase):
    try:
        appointment_repo = AppointmentRepository(supabase)
        response = appointment_repo.delete_appointment(appointment_id)

        if response:
            return {
                "success": True,
                "message": "Appointment deleted successfully"
            }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
