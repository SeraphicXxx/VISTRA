from typing import Literal

from pydantic import BaseModel


# Canonical backend roles. JWT `app_metadata.role` must be one of
# these; anything else is treated as unauthorized by require_role().
# Free-form patient `classification` (student/faculty/...) is stored
# separately as PATIENT_PROFILE.person_type, never as the auth role.
Role = Literal["staff", "patient"]

STAFF_ROLE: Role = "staff"
PATIENT_ROLE: Role = "patient"


class CurrentUser(BaseModel):
    id: str
    email: str | None = None
    role: Role | None = None
