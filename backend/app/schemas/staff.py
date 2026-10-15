from pydantic import BaseModel


class StaffPermissionsInput(BaseModel):
    """Module flags for STAFF_PERMISSIONS. Missing keys default to
    False (default-deny); mirrored 1:1 to table columns."""

    dental_module: bool = False
    medical_module: bool = False
    appointment_module: bool = False
    patient_module: bool = False
    staff_module: bool = False


class UpdateStaffPermissionsRequest(BaseModel):
    """Partial update: at least one flag required (service 422s
    otherwise). Absent flags are left untouched."""

    dental_module: bool | None = None
    medical_module: bool | None = None
    appointment_module: bool | None = None
    patient_module: bool | None = None
    staff_module: bool | None = None

    def to_permissions_update(self) -> dict:
        return {
            key: value
            for key, value in self.model_dump().items()
            if value is not None
        }


class UpdateStaffRoleRequest(BaseModel):
    """Job-role update (user-management role select). Free text by
    design: job titles evolve in product, not in migrations."""

    role: str


class CreateStaffRequest(BaseModel):
    staff_id: str
    first_name: str
    password: str
    position: str
    last_name: str
    middle_name: str | None = None
    specialty: str | None = None
    phone: str | None = None
    email: str | None = None
    role: str | None = None
    permissions: StaffPermissionsInput | None = None

class StaffData(BaseModel):
    id: str
    staff_id: str
    first_name: str
    last_name: str
    middle_name: str | None = None
    position: str
    specialty: str | None = None
    phone: str | None = None
    email: str | None = None
    role: str | None = None
