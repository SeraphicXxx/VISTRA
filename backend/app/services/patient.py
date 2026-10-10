from fastapi import status, HTTPException
from supabase import Client

from app.repositories.base import insert_model
from app.repositories.patient_repositories import PatientRepository
from app.schemas.patient import Patient, CreatePatientRequest
from app.schemas.query import FilterPatient
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404


@handle_service_errors
def get_all_patients(supabase: Client):
    patient_repo = PatientRepository(supabase)
    response = patient_repo.get_all()

    return ok(response)


@handle_service_errors
def get_patient_by_id(patient_id: str, supabase: Client):
    patient_repo = PatientRepository(supabase)
    response = patient_repo.get_by_id(patient_id)

    return ok(or_404(response, "Patient not found"))


def ensure_patient_not_exists(patient_repo: PatientRepository, patient_id: str) -> None:
    if patient_repo.get_by_id(patient_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Patient ID already exists",
        )


@handle_service_errors
def create_patient(request: CreatePatientRequest, supabase: Client):
    patient_id = remove_ucc_domain(request.patient_id)
    patient_repo = PatientRepository(supabase)

    # 1. Check if patient already exists
    ensure_patient_not_exists(patient_repo, patient_id)

    # 2. Create Auth user
    user = provision_auth_or_raise(
        patient_id,
        request.password,
        request.classification,
    )

    # 3. Insert PATIENT
    patient_data = Patient(
        id=user.id,
        patient_id=patient_id,
        created_by=request.created_by,
    )

    insert_response = insert_model(supabase, "PATIENT", patient_data)

    if not insert_response["success"]:
        compensate_auth_user(
            user.id,
            insert_response["message"],
            "Failed to insert patient into database and failed "
            "to delete user from auth",
        )

    # 4. Convert request into profile
    patient_profile = request.to_patient_profile()

    # 5. Insert patient profile
    profile_response = insert_model(supabase, "PATIENT_PROFILE", patient_profile)

    if not profile_response["success"]:
        compensate_auth_user(
            user.id,
            profile_response["message"],
            "Failed to insert patient profile and failed "
            "to delete auth user",
        )

    # Everything succeeded
    return ok(message="Patient created successfully")


@handle_service_errors
def delete_patient(patient_id: str, supabase: Client):
    patient_repo = PatientRepository(supabase)
    existing = patient_repo.get_by_id(patient_id)
    or_404(existing, "Patient not found")

    patient_repo.delete_patient_cascade(patient_id)

    delete_auth_or_500("Patient", existing["id"])

    return ok(message="Patient deleted successfully")


@handle_service_errors
def get_all_patient_profiles(supabase: Client, filters: FilterPatient):
    patient_repo = PatientRepository(supabase)
    response = patient_repo.get_profiles(filters)

    return ok(response)


@handle_service_errors
def get_patient_summary_record(supabase: Client, patient_id: str):
    patient_repo = PatientRepository(supabase)

    response = patient_repo.get_summary_records(patient_id)

    return ok(response.data)
