from pydantic import BaseModel

class PatientQuery(BaseModel):
    search: str | None = None,
    gender: str | None = None,
    status: str | None = None,
    course: str | None = None,
    year_section: str | None = None,


