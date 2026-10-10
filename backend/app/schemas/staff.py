from pydantic import BaseModel


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
