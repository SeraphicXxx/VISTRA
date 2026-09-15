from pydantic import BaseModel


class FilterPatient(BaseModel):
    search: str | None = None
    sex: str | None = None
    status: str | None = None
    course: str | None = None
    year_section: str | None = None
    user_type: str | None = None

    page: int = 1
    page_size: int = 10

# separated for flexibility

class FilterAppointment(BaseModel):
    status: str | None = None
    type: str | None = None
    course: str | None = None
    date: str | None = None

    page: int = 1
    page_size: int = 10


class FilterDental(BaseModel):
    status: str | None = None
    type: str | None = None
    course: str | None = None
    date: str | None = None

    page: int = 1
    page_size: int = 10


class FilterMedical(BaseModel):
    status: str | None = None
    type: str | None = None
    course: str | None = None
    date: str | None = None

    page: int = 1
    page_size: int = 10
