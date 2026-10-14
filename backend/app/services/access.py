from fastapi import Depends, HTTPException, status
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.repositories.patient_repositories import PatientRepository
from app.schemas.user import CurrentUser, PATIENT_ROLES, STAFF_ROLE


def get_patient_scope(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_for_user),
) -> str | None:
    """Patient_id the caller may access, or None for staff (unscoped).

    Staff skip the DB lookup entirely. Patient-type roles resolve
    their human-readable patient_id via PATIENT.id == auth uid.
    Anything else (missing/legacy role, orphaned auth user) is 403.
    Reads through the caller's own RLS-scoped client: no admin key.
    """
    if current_user.role == STAFF_ROLE:
        return None

    if current_user.role not in PATIENT_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for this resource",
        )

    row = PatientRepository(supabase).get_by_auth_id(current_user.id)

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No patient record linked to this account",
        )

    return row["patient_id"]


def enforce_patient_scope(scope: str | None, patient_id: str) -> None:
    """Reject cross-patient access. Staff scope (None) always passes."""
    if scope is not None and patient_id != scope:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions for this resource",
        )
