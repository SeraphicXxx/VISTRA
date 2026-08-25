from pydantic import BaseModel
from typing import Optional

# removed CreateStaff model to simplify
class StaffData(BaseModel):
    id: str
    staff_id: str
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    position: str
    specialty: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
