from fastapi import Depends, HTTPException, status
from supabase import Client

from app.config.security import get_current_user, require_user_email
from app.database.database_client import get_supabase_for_user
from app.repositories.patient_repositories import PatientRepository
from app.repositories.staff_repositories import StaffRepository
from app.schemas.user import CurrentUser, PATIENT_ROLES, STAFF_ROLE
from app.utils.email_utils import staff_id_format


# Domain router -> STAFF_PERMISSIONS column. Overview has no column:
# it is implicit base access for any authenticated staff.
MODULE_COLUMNS = {
    "medical": "medical_module",
    "dental": "dental_module",
    "appointment": "appointment_module",
    "patient": "patient_module",
    "staff": "staff_module",
}


def require_module(module: str):
    """Dependency factory enforcing STAFF_PERMISSIONS module flags.

    Patient-type roles pass through untouched: their per-endpoint
    scoped rules (ownership) apply downstream. Staff must hold the
    flag; missing permissions row (legacy) or False reads as denial.
    No super-admin bypass: all-flags rows express full access.
    Costs one STAFF_PERMISSIONS read per staff request.
    """
    column = MODULE_COLUMNS[module]

    def check_module(
        current_user: CurrentUser = Depends(get_current_user),
        supabase: Client = Depends(get_supabase_for_user),
    ) -> CurrentUser:
        if current_user.role in PATIENT_ROLES:
            return current_user

        if current_user.role != STAFF_ROLE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions for this resource",
            )

        staff_id = staff_id_format(require_user_email(current_user))
        perms = StaffRepository(supabase).get_permissions(staff_id)

        if not perms or not perms.get(column):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Staff access requires the {column} permission",
            )

        return current_user

    return check_module


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
            detail=f"Insufficient permissions for this resource {patient_id}",
        )
