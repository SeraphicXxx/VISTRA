from fastapi import APIRouter, Depends
from supabase import Client

from app.services.vital_signs import (
    create_vital_signs,
    get_patient_vital_signs,
    get_latest_patient_vital_signs,
)
from app.database.database_client import get_supabase_for_user
from app.schemas.vital_signs import CreateVitalSignsRequest, UpdateVitalSignsRequest
from app.services.access import get_patient_scope, enforce_patient_scope

vital_signs_router = APIRouter(prefix="/vital-signs", tags=["Vital Signs"])


@vital_signs_router.post("/")
def create_vital_signs_route(
    request: CreateVitalSignsRequest,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    # Patients can only create records under their own patient ID.
    # Staff may create records for any patient.
    request.patient_id = scope if scope is not None else request.patient_id

    return create_vital_signs(
        request,
        supabase=supabase,
    )


@vital_signs_router.get("/patient/{patient_id}")
def get_patient_vital_signs_route(
    patient_id: str,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    enforce_patient_scope(scope, patient_id)

    return get_patient_vital_signs(patient_id, supabase)


@vital_signs_router.get("/patient/{patient_id}/latest")
def get_latest_patient_vital_signs_route(
    patient_id: str,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    enforce_patient_scope(scope, patient_id)

    return get_latest_patient_vital_signs(patient_id, supabase)


@vital_signs_router.get("/{vital_signs_id}")
def get_vital_signs_by_id_route(
    vital_signs_id: int,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    repository = VitalSignsRepository(supabase)
    record = repository.get_by_id(vital_signs_id)

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vital signs record not found",
        )

    enforce_patient_scope(scope, record["patient_id"])

    return get_vital_signs_by_id(vital_signs_id, supabase)


@vital_signs_router.patch("/{vital_signs_id}")
def update_vital_signs_route(
    vital_signs_id: int,
    request: UpdateVitalSignsRequest,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    repository = VitalSignsRepository(supabase)
    existing = repository.get_by_id(vital_signs_id)

    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vital signs record not found",
        )

    enforce_patient_scope(scope, existing["patient_id"])

    return update_vital_signs(
        vital_signs_id=vital_signs_id,
        vital_signs_data=request.model_dump(
            mode="json",
            exclude_unset=True,
        ),
        supabase=supabase,
    )


@vital_signs_router.delete("/{vital_signs_id}")
def delete_vital_signs_route(
    vital_signs_id: int,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    repository = VitalSignsRepository(supabase)
    existing = repository.get_by_id(vital_signs_id)

    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vital signs record not found",
        )

    enforce_patient_scope(scope, existing["patient_id"])

    return delete_vital_signs(vital_signs_id, supabase)
