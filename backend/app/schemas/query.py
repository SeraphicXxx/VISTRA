from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)


class FilterPatient(PaginationParams):
    search: str | None = None
    sex: str | None = None
    status: str | None = None
    course: str | None = None
    year_section: str | None = None
    user_type: str | None = None

# separated for flexibility


class VisitFilter(PaginationParams):
    search: str | None = None
    status: str | None = None
    type: str | None = None
    course: str | None = None
    date: str | None = None


class FilterAppointment(VisitFilter):
    patient_id: str | None = None


class FilterDental(VisitFilter):
    pass


class FilterMedical(VisitFilter):
    pass
