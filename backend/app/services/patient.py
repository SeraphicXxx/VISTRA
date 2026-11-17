from fastapi import status, HTTPException
import secrets
from pathlib import Path
from uuid import uuid4

from postgrest.exceptions import APIError
from supabase import Client

from app.repositories.base import insert_model
from app.repositories.patient_repositories import PatientRepository
from app.repositories.vital_signs_repository import VitalSignsRepository
from app.repositories.attachments_repositories import AttachmentRepository
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
from app.schemas.vital_signs import CreateVitalSignsRequest
from app.services.auth.user import (
    compensate_auth_user,
    delete_auth_or_500,
    delete_auth_user,
    provision_auth_or_raise,
)
from app.utils.email_utils import remove_ucc_domain
from app.utils.service_helpers import handle_service_errors, ok, or_404
from app.utils.supabase_query_builder import SupabaseQueryBuilder
from app.enums.personal_history import Results as ResultsEnum
from app.database.database_client import supabase_admin


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
def create_patient(
    request: CreatePatientRequest,
    supabase: Client,
    application_form_content: bytes | None = None,
    application_form_filename: str | None = None,
    result_attachments: list[tuple[bytes, str]] | None = None,
):
    patient_id = remove_ucc_domain(request.patient_id)
    patient_repo = PatientRepository(supabase)

    # 1. Check if patient already exists
    ensure_patient_not_exists(patient_repo, patient_id)

    # 2. Create Auth user. JWT role is the canonical role for the
    # form classification (staff for Admins); unknown values 422.
    # Classification detail lives on as PATIENT_PROFILE.person_type.
    password = request.password or secrets.token_urlsafe(16)
    user = provision_auth_or_raise(
        patient_id,
        password,
        role_for_classification(request.classification),
    )

    try:
        # 3. Insert PATIENT (includes email if provided)
        patient_data = Patient(
            id=user.id,
            patient_id=patient_id,
            email=request.email,
            created_by=request.created_by,
            registration_status=request.registration_status,
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

        # 6. Insert medical history, family history, results, and vitals
        _create_personal_records_from_request(
            patient_repo, patient_id, request, supabase_admin
        )

        # 7. Insert vital signs if provided
        _create_vital_signs_from_request(
            patient_id, request, supabase_admin
        )

        # 8. Save attachments (OCR application form + result attachments) to PATIENT_ATTACHMENTS
        _save_pre_registration_attachments(
            patient_id=patient_id,
            application_form_content=application_form_content,
            application_form_filename=application_form_filename,
            result_attachments=result_attachments,
            supabase=supabase,
        )

    except Exception as e:
        # Rollback: delete the patient and auth user if anything fails
        try:
            patient_repo.delete_patient_cascade(patient_id)
        except Exception:
            pass
        try:
            delete_auth_user(user.id)
        except Exception:
            pass
        raise

    # Everything succeeded
    return ok(message="Patient created successfully")


def _create_personal_records_from_request(
    patient_repo: PatientRepository,
    patient_id: str,
    request: CreatePatientRequest,
    supabase_admin: Client | None,
) -> None:
    """Insert medical history, family history, and results data
    submitted via the MedicalHistoryForm component on patient creation.
    Uses supabase_admin to bypass RLS on medical tables since this is
    an admin operation (staff creating patient records).
    """

    # Use supabase_admin to bypass RLS on medical tables
    if supabase_admin is None:
        return
    patient_repo_admin = PatientRepository(supabase_admin)

    # --- Medical History ---
    medical_fields_present = any([
        request.hospitalization_year, request.diagnosis,
        request.allergy_medicine, request.allergy_food,
        request.smoking, request.vaping, request.alcohol,
        request.contraceptive,
    ])
    if medical_fields_present:
        patient_repo_admin.insert_personal_record(
            patient_id,
            CreateMedicalhistory(
                hostpitalization_operation=request.hospitalization_operation or "",
                hostpitalization_year=request.hospitalization_year or "",
                diagnosis=request.diagnosis or "",
                allergy_medicine=request.allergy_medicine or "",
                allergy_food=request.allergy_food or "",
                Smoking=request.smoking or None,
                Vaping=request.vaping or None,
                alcohol_intake=request.alcohol_intake or None,
                family_planning_method=request.contraceptive_method or None,
            ),
        )

    # --- Family History ---
    family_fields_present = bool(
        request.family_history or request.family_history_others
    )
    if family_fields_present:
        patient_repo_admin.insert_family_history(
            patient_id,
            FamilyHistory(
                conditions=request.family_history or [],
                other_condition=request.family_history_others or "",
            ),
        )

    # --- Results ---
    results_fields_present = any([
        request.chest_xray, request.cbc, request.urinalysis,
        request.recommendation,
    ])
    if results_fields_present:
        patient_repo_admin.insert_results(
            patient_id,
            PatientResults(
                Chest_Xray=ResultsEnum(request.chest_xray) if request.chest_xray else ResultsEnum.NORMAL,
                CBC=ResultsEnum(request.cbc) if request.cbc else ResultsEnum.NORMAL,
                Urinalysis=ResultsEnum(request.urinalysis) if request.urinalysis else ResultsEnum.NORMAL,
                recommendation=request.recommendation or None,
            ),
        )


def _create_vital_signs_from_request(
    patient_id: str,
    request: CreatePatientRequest,
    supabase: Client | None,
) -> None:
    """Insert vital signs into VITALS_SIGNS if any vitals fields are provided."""
    if supabase is None:
        return
    # Frontend field names map to DB columns:
    #   blood_pressure  -> heart_rate
    #   respiratory_rate -> spo2
    vitals_fields_present = any([
        request.height is not None,
        request.weight is not None,
        request.temperature is not None,
        request.blood_pressure is not None,
        request.respiratory_rate is not None,
    ])
    if not vitals_fields_present:
        return

    def _to_int(val: str | None) -> int | None:
        if not val:
            return None
        try:
            return int(float(val))
        except (ValueError, TypeError):
            return None

    def _to_float(val: str | None) -> float | None:
        if not val:
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    repository = VitalSignsRepository(supabase)
    created = repository.create({
        "patient_id": patient_id,
        "height": request.height,
        "weight": request.weight,
        "temperature": request.temperature,
        "heart_rate": _to_int(request.blood_pressure),
        "spo2": _to_float(request.respiratory_rate),
    })
    if not created:
        raise RuntimeError("Failed to create vital signs record")


def _save_pre_registration_attachments(
    patient_id: str,
    application_form_content: bytes | None,
    application_form_filename: str | None,
    result_attachments: list[tuple[bytes, str]] | None,
    supabase: Client,
) -> None:
    """Save the OCR application form and result attachments to PATIENT_ATTACHMENTS."""
    repository = AttachmentRepository(supabase)

    # Save the OCR application form file
    if application_form_content and application_form_filename:
        attachment_id = str(uuid4())
        relative_path = (
            Path(patient_id)
            / "preregistration"
            / f"{attachment_id}{Path(application_form_filename).suffix}"
        ).as_posix()

        metadata = {
            "id": attachment_id,
            "patient_id": patient_id,
            "medical_visit_id": None,
            "uploaded_by": patient_id,
            "category": "clinical_photo",
            "file_name": Path(application_form_filename or "application_form").name,
            "storage_path": relative_path,
            "mime_type": "application/pdf",
            "file_size": len(application_form_content),
        }
        repository.save_file(relative_path, application_form_content)
        try:
            repository.create(metadata)
        except Exception:
            try:
                repository.delete_file(relative_path)
            except Exception:
                pass
            raise

    # Save result attachments
    if result_attachments:
        for content, filename in result_attachments:
            attachment_id = str(uuid4())
            ext = Path(filename).suffix if filename else ".bin"
            relative_path = (
                Path(patient_id)
                / "results"
                / f"{attachment_id}{ext}"
            ).as_posix()

            metadata = {
                "id": attachment_id,
                "patient_id": patient_id,
                "medical_visit_id": None,
                "uploaded_by": patient_id,
                "category": "laboratory_result",
                "file_name": Path(filename or "attachment").name,
                "storage_path": relative_path,
                "mime_type": "application/octet-stream",
                "file_size": len(content),
            }
            repository.save_file(relative_path, content)
            try:
                repository.create(metadata)
            except Exception:
                try:
                    repository.delete_file(relative_path)
                except Exception:
                    pass
                raise


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
