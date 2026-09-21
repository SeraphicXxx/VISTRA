from typing import Generic, TypeVar
from datetime import datetime
from pydantic import BaseModel, computed_field

from app.enums.summary_type import SummaryType

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int

    @computed_field
    @property
    def total_pages(self) -> int:
        return (self.total + self.page_size - 1) // self.page_size


class Response(BaseModel, Generic[T]):
    success: bool
    data: T | None = None
    message: str | None = None

class SummaryRecord(BaseModel):
    type: SummaryType
    id: int
    patient_id: str
    patient_name: str
    date: datetime
    title: str
    staff_id: str
    provider: str