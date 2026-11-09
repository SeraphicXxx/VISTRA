from fastapi import status, HTTPException
from postgrest.exceptions import APIError
from supabase import Client

from app.repositories.base import insert_model
from app.repositories.patient_repositories import PatientRepository
from app.schemas.patient import (
    Patient,
    CreatePatientRequest,
    UpdatePatientProfileRequest,
    CreateMedicalhistory,
    FamilyHistory,
    PatientResults,
)
from app.schemas.query import FilterPatient
from app.schemas.user import role_for_classification
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404
from app.utils.supabase_query_builder import SupabaseQueryBuilder
from app.enums.personal_history import Frequency, Sexual_activity, Results as ResultsEnum


@handle_service_errors
def get_all_patients(supabase: Client, page: int = 1, page_size: int = 10):
    patient_repo = PatientRepository(supabase)
    query = (
        SupabaseQueryBuilder(supabase, "PATIENT", count="exact")
        .order("created_at", desc=True)
    )
    response = patient_repo.fetch_page(query, page, page_size)
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

    # 2. Create Auth user. JWT role is the canonical role for the
    # form classification (staff for Admins); unknown values 422.
    # Classification detail lives on as PATIENT_PROFILE.person_type.
    user = provision_auth_or_raise(
        patient_id,
        request.password,
        role_for_classification(request.classification),
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

    # 6. Insert medical history, family history, and results if any
    # medical data was provided in the form
    _create_personal_records_from_request(
        patient_repo, patient_id, request
    )

    # Everything succeeded
    return ok(message="Patient created successfully")


def _create_personal_records_from_request(
    patient_repo: PatientRepository,
    patient_id: str,
    request: CreatePatientRequest,
) -> None:
    """Insert medical history, family history, and results data
    submitted via the MedicalHistoryForm component on patient creation.
    """

    # --- Medical History ---
    medical_fields_present = any([
        request.hospitalization_year, request.diagnosis,
        request.allergy_medicine, request.allergy_food,
        request.smoking, request.vaping, request.alcohol,
        request.contraceptive, request.sexual_activity,
    ])
    if medical_fields_present:
        patient_repo.insert_personal_record(
            patient_id,
            CreateMedicalhistory(
                hostpitalization_operation=request.hospitalization_operation or "",
                hostpitalization_year=request.hospitalization_year or 0,
                diagnosis=request.diagnosis or "",
                allergy_medicine=request.allergy_medicine or "",
                allergy_food=request.allergy_food or "",
                Smoking=Frequency(request.smoking) if request.smoking else Frequency.NONE,
                Vaping=Frequency(request.vaping) if request.vaping else Frequency.NONE,
                Alcohol=Frequency(request.alcohol) if request.alcohol else Frequency.NONE,
                Contraceptive=request.contraceptive or "",
                Sexual_activity=Sexual_activity(request.sexual_activity) if request.sexual_activity else Sexual_activity.NO,
            ),
        )

    # --- Family History ---
    family_fields_present = bool(
        request.family_history or request.family_history_others
    )
    if family_fields_present:
        patient_repo.insert_family_history(
            patient_id,
            FamilyHistory(
                Family_history=Family_history(request.family_history) if request.family_history else Family_history.HYPERTENSION,
                Other=request.family_history_others or "",
            ),
        )

    # --- Results ---
    results_fields_present = any([
        request.chest_xray, request.cbc, request.urinalysis,
        request.recommendation,
    ])
    if results_fields_present:
        patient_repo.insert_results(
            patient_id,
            PatientResults(
                Chest_Xray=ResultsEnum(request.chest_xray) if request.chest_xray else ResultsEnum.NORMAL,
                CBC=ResultsEnum(request.cbc) if request.cbc else ResultsEnum.NORMAL,
                Urinalysis=ResultsEnum(request.urinalysis) if request.urinalysis else ResultsEnum.NORMAL,
                Other=request.results_other or None,
                recommendation=request.recommendation or None,
            ),
        )


@handle_service_errors
def delete_patient(patient_id: str, supabase: Client):
    """Delete a patient and all linked records.

    Cascade-delete dependency: uses the `delete_patient_records` RPC
    defined in migration `20261010120000_cascade_deletes` (and
    recreated in `20261015055421_remote_schema`). The RPC deletes
    APPOINTMENT, FAMILY_MEDICAL_HISTORY, PATIENT_PROFILE, and PATIENT
    rows in a single transaction. Auth user is deleted separately
    after the DB cascade succeeds.

    FK constraints: APPOINTMENT.patient_id, FAMILY_MEDICAL_HISTORY.patient_id,
    PATIENT_PROFILE.patient_id all reference PATIENT.patient_id.
    """
    patient_repo = PatientRepository(supabase)
    existing = or_404(patient_repo.get_by_id(patient_id), "Patient not found")
    assert existing is not None

    try:
        patient_repo.delete_patient_cascade(patient_id)
    except APIError as e:
        # A RESTRICT child added without RPC coverage must read as a
        # conflict, not an "Unhandled error" 500.
        if getattr(e, "code", None) == "23503":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Patient has linked records that block deletion",
            )

        raise

    delete_auth_or_500("Patient", existing["id"])

    return ok(message="Patient deleted successfully")


@handle_service_errors
def update_patient_profile(
    patient_id: str,
    request: UpdatePatientProfileRequest,
    supabase: Client,
):
    patient_repo = PatientRepository(supabase)
    or_404(patient_repo.get_by_id(patient_id), "Patient not found")

    updated = patient_repo.update_profile(
        patient_id,
        request.to_profile_update(),
    )

    return ok(or_404(updated, "Patient profile not found"))


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


@handle_service_errors
def get_patient_medical_dental_summary(supabase: Client, patient_id: str):
    patient_repo = PatientRepository(supabase)

    response = patient_repo.get_medical_dental_summary(patient_id)

    return ok(or_404(response.data, "Patient summary not found"))


@handle_service_errors
def get_patient_medical_history(patient_id: str, supabase: Client):
    patient_repo = PatientRepository(supabase)
    response = patient_repo.get_medical_history(patient_id)
    return ok(or_404(response, "Medical history not found"))


@handle_service_errors
def get_patient_family_history(patient_id: str, supabase: Client):
    patient_repo = PatientRepository(supabase)
    response = patient_repo.get_family_history(patient_id)
    return ok(or_404(response, "Family history not found"))

@handle_service_errors
def create_personal_records(supabase: Client, patient_id: str, forms):
    patient_repo = PatientRepository(supabase)
    medical_id = patient_repo.insert_personal_record(patient_id, forms.medical)
    family_history = patient_repo.insert_family_history(patient_id, forms.family)
    results = patient_repo.insert_results(patient_id, forms.results)

    return ok({
        "medical": medical_id,
        "family_history": family_history,
        "results": results,
    })
