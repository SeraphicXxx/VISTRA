from pydantic import BaseModel
from typing import Optional


class CreateStaffRequest(BaseModel):
    staff_id: str
    first_name: str
    position: str
    last_name: str
    middle_name: Optional[str] = None
    specialty: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
