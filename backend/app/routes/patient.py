from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.schemas.patient import CreatePatientRequest
from app.schemas.query import FilterPatient
from app.services.patient import get_all_patients, get_patient_by_id, get_all_patient_profiles, \
    get_patient_summary_record
from app.services.patient import create_patient as create_patient_service
from app.services.patient import delete_patient as delete_patient_service

protected_patient_router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
    dependencies=[Depends(get_current_user)]
)

@protected_patient_router.get("/")
def get_patients(supabase: Client = Depends(get_supabase_for_user)):
    return get_all_patients(supabase)

@protected_patient_router.post("/")
def create_patient(request: CreatePatientRequest, supabase: Client = Depends(get_supabase_for_user)):
    return create_patient_service(request, supabase)

@protected_patient_router.get("/profiles/")
def get_all_profiles(filters : FilterPatient = Depends(), supabase: Client = Depends(get_supabase_for_user)):
    return get_all_patient_profiles(supabase, filters)

@protected_patient_router.get("/{patient_id}/")
def get_patient(patient_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return get_patient_by_id(patient_id, supabase)

@protected_patient_router.get("/profiles/{patient_id}/")
def profile_summary(patient_id: str ,supabase: Client = Depends(get_supabase_for_user)):
    return get_patient_summary_record(supabase, patient_id)

@protected_patient_router.delete("/{patient_id}/")
def delete_patient(patient_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return delete_patient_service(patient_id, supabase)
