from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.schemas.appointments import (CreateAppointmentRequest,UpdateAppointmentRequest)
from app.schemas.query import FilterAppointment
from app.services.appointment import (
    get_all_appointments,
    get_appointment_by_id)
from app.services.appointment import create_appointment as create_appointment_service
from app.services.appointment import update_appointment as update_appointment_service
from app.services.appointment import delete_appointment as delete_appointment_service

protected_appointment_router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
    dependencies=[Depends(get_current_user)]
)

@protected_appointment_router.post("/")
def create_appointment(request: CreateAppointmentRequest,supabase: Client = Depends(get_supabase_for_user)):
    return create_appointment_service(request, supabase)

@protected_appointment_router.get("/")
def get_appointments(filters: FilterAppointment = Depends(), supabase: Client = Depends(get_supabase_for_user)):
    return get_all_appointments(filters, supabase)

@protected_appointment_router.get("/{patient_id}/{appointment_id}")
def get_appointment(patient_id: str, appointment_id: int, supabase: Client = Depends(get_supabase_for_user)):
    return get_appointment_by_id(appointment_id , patient_id, supabase)

@protected_appointment_router.patch("/{appointment_id}/")
def update_appointment(appointment_id: int, request: UpdateAppointmentRequest,supabase: Client = Depends(get_supabase_for_user)):
    return update_appointment_service(appointment_id, request, supabase)

@protected_appointment_router.delete("/{appointment_id}/")
def delete_appointment(appointment_id: int,supabase: Client = Depends(get_supabase_for_user)):
    return delete_appointment_service(appointment_id, supabase)
