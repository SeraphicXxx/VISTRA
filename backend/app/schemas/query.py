from pydantic import BaseModel


class Filter(BaseModel):
    search: str | None = None
    sex: str | None = None
    status: str | None = None
    course: str | None = None
    year_section: str | None = None
    user_type: str | None = None

    page: int = 1
    page_size: int = 10