from typing import Generic, TypeVar

from pydantic import BaseModel
from pydantic_core.core_schema import computed_field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int

    @property
    @computed_field
    def total_pages(self) -> int:
        return (self.total + self.page_size - 1) // self.page_size