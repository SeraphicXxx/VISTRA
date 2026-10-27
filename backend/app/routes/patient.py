from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.schemas.patient import CreatePatientRequest, UpdatePatientProfileRequest
from app.schemas.query import FilterPatient, FilterMedical, FilterDental
from app.services.access import enforce_patient_scope, get_patient_scope, require_module
from app.services.patient import get_all_patients, get_patient_by_id, get_all_patient_profiles, \
    get_patient_summary_record, get_patient_medical_dental_summary
from app.services.medical import get_patient_medical_tab as get_patient_medical_tab_service
from app.services.dental import get_patient_dental_tab as get_patient_dental_tab_service
from app.services.patient import create_patient as create_patient_service
from app.services.patient import delete_patient as delete_patient_service
from app.services.patient import update_patient_profile as update_patient_profile_service

protected_patient_router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
    dependencies=[Depends(require_module("patient"))]
)

@protected_patient_router.get("/", dependencies=[Depends(require_staff)])
def get_patients(supabase: Client = Depends(get_supabase_for_user)):
    return get_all_patients(supabase)

@protected_patient_router.post("/", dependencies=[Depends(require_staff)])
def create_patient(request: CreatePatientRequest, supabase: Client = Depends(get_supabase_for_user)):
    return create_patient_service(request, supabase)

@protected_patient_router.get("/profiles/", dependencies=[Depends(require_staff)])
def get_all_profiles(filters : FilterPatient = Depends(), supabase: Client = Depends(get_supabase_for_user)):
    return get_all_patient_profiles(supabase, filters)

@protected_patient_router.get("/record/medical-tab/")
def get_patient_medical_tab(
    filters: FilterMedical = Depends(),
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    # The patient ID is derived solely from the JWT; no search param.
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    return get_patient_medical_tab_service(scope, filters, supabase)


@protected_patient_router.get("/record/dental-tab/")
def get_patient_dental_tab(
    filters: FilterDental = Depends(),
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    return get_patient_dental_tab_service(scope, filters, supabase)


@protected_patient_router.get("/{patient_id}/")
def get_patient(patient_id: str, scope: str | None = Depends(get_patient_scope), supabase: Client = Depends(get_supabase_for_user)):
    enforce_patient_scope(scope, patient_id)
    return get_patient_by_id(patient_id, supabase)

@protected_patient_router.get("/profiles/me/")
def get_my_profile(
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    """Current patient's profile summary, patient_id derived from JWT.

    Staff get None scope → 403. Patient roles resolve their own
    patient_id via PATIENT.id == auth.uid().
    """
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    return get_patient_summary_record(supabase, scope)

@protected_patient_router.get("/summary/medical-dental/")
def get_patient_medical_dental_summary_endpoint(
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    """Current patient's combined medical + dental visit history,
    patient_id derived from JWT."""
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    return get_patient_medical_dental_summary(supabase, scope)

@protected_patient_router.get("/profiles/{patient_id}/")
def profile_summary(patient_id: str, scope: str | None = Depends(get_patient_scope), supabase: Client = Depends(get_supabase_for_user)):
    enforce_patient_scope(scope, patient_id)
    return get_patient_summary_record(supabase, patient_id)

@protected_patient_router.delete("/{patient_id}/", dependencies=[Depends(require_staff)])
def delete_patient(patient_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return delete_patient_service(patient_id, supabase)

@protected_patient_router.patch("/{patient_id}/", dependencies=[Depends(require_staff)])
def update_patient_profile(
    patient_id: str,
    request: UpdatePatientProfileRequest,
    supabase: Client = Depends(get_supabase_for_user),
):
    return update_patient_profile_service(patient_id, request, supabase)