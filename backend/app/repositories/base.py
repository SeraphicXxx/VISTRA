import logging

from app.schemas.response_dto.reponses import PaginatedResponse
from app.utils.supabase_query_builder import SupabaseQueryBuilder

logger = logging.getLogger(__name__)


class BaseRepository:
    def __init__(self, supabase):
        self.supabase = supabase

    def delete_by_column(self, table: str, column: str, value) -> bool:
        response = (
            self.supabase
            .table(table)
            .delete()
            .eq(column, value)
            .execute()
        )

        return bool(response.data)

    def fetch_one(self, table: str, select: str = "*", filters: dict | None = None):
        query = self.supabase.table(table).select(select)

        for column, value in (filters or {}).items():
            query = query.eq(column, value)

        response = query.limit(1).execute()

        if not response.data:
            return None

        return response.data[0]

    def fetch_all(self, table: str, select: str = "*"):
        response = (
            self.supabase
            .table(table)
            .select(select)
            .execute()
        )

        return response.data

    def fetch_page(self, builder: SupabaseQueryBuilder, page: int, page_size: int):
        response = (
            builder
            .paginate(page, page_size)
            .build()
            .execute()
        )

        return PaginatedResponse(
            items=response.data or [],
            total=response.count or 0,
            page=page,
            page_size=page_size,
        )


def insert_model(supabase, table: str, model) -> dict:
    try:
        response = (
            supabase
            .table(table)
            .insert(model.model_dump(mode="json"))
            .execute()
        )

        return {
            "success": True,
            "data": response.data,
        }
    except Exception as e:
        logger.exception("Insert into %s failed: %s", table, e)

        return {
            "success": False,
            "message": "Internal operation failed",
        }


def fetch_visit_tab(supabase, table: str, columns: str, filters, include_type=False):
    """Shared dental/medical tab listing.

    Both views expose the same columns; the only differences are the
    table name and that dental has no `type` column (include_type=False).
    """
    query = (
        SupabaseQueryBuilder(
            supabase,
            table,
            columns=columns,
            count="exact",
        )
        .order("visit_date", desc=True)
        .eq("status", filters.status)
        .eq("course", filters.course)
    )

    if include_type:
        query = query.eq("type", filters.type)

    if filters.date:
        query = query.date_day("visit_date", filters.date)

    if filters.search:
        like = f"%{filters.search}%"
        query = query.or_(
            f"patient_name.ilike.{like},patient_id.ilike.{like}"
        )

    return BaseRepository(supabase).fetch_page(
        query,
        filters.page,
        filters.page_size,
    )
