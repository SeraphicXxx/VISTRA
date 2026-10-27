
from typing import Any

from fastapi import HTTPException, status
from supabase import Client

from app.repositories.vital_signs_repository import VitalSignsRepository
from app.utils.service_helpers import handle_service_errors, ok, or_404
from app.schemas.vital_signs import CreateVitalSignsRequest


@handle_service_errors
def create_vital_signs(
        request: CreateVitalSignsRequest,
    supabase: Client,
):
    repository = VitalSignsRepository(supabase)

    created = repository.create(
        request.model_dump(
            mode="json",
            exclude_none=True,
        )
    )

    if not created:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create vital signs record",
        )

    return ok(created, message="Vital signs recorded successfully")

@handle_service_errors
def update_vital_signs(
    vital_signs_id: int,
    vital_signs_data: dict,
    supabase: Client,
):
    repository = VitalSignsRepository(supabase)

    existing = repository.get_by_id(vital_signs_id)
    or_404(existing, "Vital signs record not found")

    payload = {
        key: value
        for key, value in vital_signs_data.items()
        if key not in {"id", "patient_id", "recorded_at"}
    }

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="No updatable vital signs fields provided",
        )

    updated = repository.update(vital_signs_id, payload)

    return ok(
        or_404(updated, "Vital signs record not found"),
        message="Vital signs updated successfully",
    )

@handle_service_errors
def get_vital_signs_by_id(
    vital_signs_id: int,
    supabase: Client,
):
    """Retrieve a vital signs record by ID."""
    repository = VitalSignsRepository(supabase)

    record = repository.get_by_id(vital_signs_id)

    return ok(
        or_404(record, "Vital signs record not found")
    )


@handle_service_errors
def get_patient_vital_signs(
    patient_id: str,
    supabase: Client,
):
    """Retrieve all vital signs records belonging to a patient."""
    repository = VitalSignsRepository(supabase)

    records = repository.get_by_patient_id(patient_id)

    # An empty list is valid when the patient has no readings.
    return ok(records)


@handle_service_errors
def get_latest_patient_vital_signs(
    patient_id: str,
    supabase: Client,
):
    """Retrieve the latest vital signs record for a patient."""
    repository = VitalSignsRepository(supabase)

    record = repository.get_latest_by_patient_id(patient_id)

    return ok(
        or_404(record, "No vital signs records found for this patient")
    )

@handle_service_errors
def delete_vital_signs(
    vital_signs_id: int,
    supabase: Client,
):
    """Delete a vital signs record by ID."""
    repository = VitalSignsRepository(supabase)

    existing = repository.get_by_id(vital_signs_id)
    or_404(existing, "Vital signs record not found")

    deleted = repository.delete(vital_signs_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vital signs record not found",
        )

    return ok(message="Vital signs record deleted successfully")
