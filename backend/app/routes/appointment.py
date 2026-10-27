from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.schemas.appointments import (CreateAppointmentRequest,UpdateAppointmentRequest)
from app.schemas.query import FilterAppointment
from app.services.access import enforce_patient_scope, get_patient_scope, require_module
from app.services.appointment import (
    get_all_appointments,
    get_appointment_by_id)
from app.services.appointment import create_appointment as create_appointment_service
from app.services.appointment import update_appointment as update_appointment_service
from app.services.appointment import delete_appointment as delete_appointment_service

protected_appointment_router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
    dependencies=[Depends(require_module("appointment"))]
)

@protected_appointment_router.post("/")
def create_appointment(request: CreateAppointmentRequest, scope: str | None = Depends(get_patient_scope), supabase: Client = Depends(get_supabase_for_user)):
    enforce_patient_scope(scope, request.patient_id)
    return create_appointment_service(request, supabase)

@protected_appointment_router.get("/")
def get_appointments(filters: FilterAppointment = Depends(), scope: str | None = Depends(get_patient_scope), supabase: Client = Depends(get_supabase_for_user)):
    if scope is not None:
        filters.patient_id = scope
    return get_all_appointments(filters, supabase)


@protected_appointment_router.get("/me/")
def get_my_appointments(
    filters: FilterAppointment = Depends(),
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    """Current patient's appointments, patient_id derived from JWT.

    Staff get None scope → 403. Patient roles resolve their own
    patient_id via PATIENT.id == auth.uid().
    """
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    filters.patient_id = scope
    return get_all_appointments(filters, supabase)

@protected_appointment_router.get("/{patient_id}/{appointment_id}")
def get_appointment(patient_id: str, appointment_id: int, scope: str | None = Depends(get_patient_scope), supabase: Client = Depends(get_supabase_for_user)):
    enforce_patient_scope(scope, patient_id)
    return get_appointment_by_id(appointment_id , patient_id, supabase)

@protected_appointment_router.patch("/{patient_id}/{appointment_id}/", dependencies=[Depends(require_staff)])
def update_appointment(patient_id: str, appointment_id: int, request: UpdateAppointmentRequest,supabase: Client = Depends(get_supabase_for_user),current_user=Depends(get_current_user)):
    return update_appointment_service(patient_id, appointment_id, request, supabase, current_user)

@protected_appointment_router.delete("/{appointment_id}/", dependencies=[Depends(require_staff)])
def delete_appointment(appointment_id: int,supabase: Client = Depends(get_supabase_for_user)):
    return delete_appointment_service(appointment_id, supabase)
