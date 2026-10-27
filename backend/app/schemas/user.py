from typing import Literal

from fastapi import HTTPException, status
from pydantic import BaseModel


# Canonical backend roles, mirrored in JWT `app_metadata.role`.
# "staff" is the system admin; student/professor/faculty are system
# users. RLS policies and require_* gates key on these exact strings.
Role = Literal["staff", "student", "professor", "faculty"]

STAFF_ROLE: Role = "staff"
STUDENT_ROLE: Role = "student"
PROFESSOR_ROLE: Role = "professor"
FACULTY_ROLE: Role = "faculty"

# Non-staff system users, for "any patient-type" checks.
PATIENT_ROLES: frozenset[Role] = frozenset(
    {STUDENT_ROLE, PROFESSOR_ROLE, FACULTY_ROLE}
)

# Patient-form classification keys -> canonical role.
# "staff" is the Admin toggle: admins are staff. "faculty" covers
# professors until the form distinguishes them; classification
# detail itself persists as PATIENT_PROFILE.person_type.
CLASSIFICATION_ROLE_MAP: dict[str, Role] = {
    "student": STUDENT_ROLE,
    "faculty": FACULTY_ROLE,
    "staff": STAFF_ROLE,
    "university_staff": STAFF_ROLE,
}

# Accepted resolver inputs: form keys plus common variants
# ("Student" from API clients, "admin" label, explicit professor).
_CLASSIFICATION_ALIASES: dict[str, Role] = {
    **CLASSIFICATION_ROLE_MAP,
    "professor": PROFESSOR_ROLE,
    "admin": STAFF_ROLE,
}


def role_for_classification(classification: str) -> Role:
    """Map a patient-form classification to its canonical role.

    Case-insensitive; rejects unknown values instead of minting
    arbitrary JWT roles.
    """
    key = (classification or "").strip().lower()

    if key not in _CLASSIFICATION_ALIASES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=(
                "Unknown classification: "
                f"{classification!r}. Expected one of "
                f"{sorted(CLASSIFICATION_ROLE_MAP)}."
            ),
        )

    return _CLASSIFICATION_ALIASES[key]


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    role: Role | None = None
