from typing import Any, Optional

from app.repositories.base import BaseRepository, fetch_visit_tab
from app.schemas.response_dto.responses import PaginatedResponse
from app.utils.supabase_query_builder import SupabaseQueryBuilder
from app.schemas.medical import EDITABLE_MEDICAL_VISIT_COLUMNS
from app.schemas.query import FilterMedical


class MedicalRepository(BaseRepository):

    def get_medical_visits(self, filters: FilterMedical) -> PaginatedResponse:
        return fetch_visit_tab(
            self.supabase,
            "medical_tab",
            columns=(
                "id, patient_id, patient_name, course, "
                "visit_date, staff_id, status, type"
            ),
            filters=filters,
            include_type=True,
        )

    def get_patient_medical_tab(self, patient_id: str, filters: FilterMedical) -> PaginatedResponse:
        builder = SupabaseQueryBuilder(
            self.supabase,
            "patient_medical_tab",
            count="exact",
        )
        builder.eq("patient_id", patient_id)
        builder.eq("status", filters.status)
        builder.eq("course", filters.course)
        builder.date_day("visit_date", filters.date)
        if filters.search:
            like = f"%{filters.search}%"
            builder.or_(
                f"patient_name.ilike.{like},complaint.ilike.{like},treatment.ilike.{like}"
            )
        builder.order("visit_date", desc=True)
        return self.fetch_page(builder, filters.page, filters.page_size)

    def delete_visit(self, medical_visit_id: int) -> bool:
        return self.delete_by_column("MEDICAL_VISIT", "id", medical_visit_id)

    def update_visit(self, medical_visit_id: int, visit_data: dict[str, Any]) -> Optional[dict[str, Any]]:
        updatable = {
            key: value
            for key, value in (visit_data or {}).items()
            if key in EDITABLE_MEDICAL_VISIT_COLUMNS
        }

        if not updatable:
            raise ValueError(
                "No updatable fields provided. Allowed: "
                + ", ".join(sorted(EDITABLE_MEDICAL_VISIT_COLUMNS))
            )

        return self.update_by_column(
            "MEDICAL_VISIT",
            "id",
            medical_visit_id,
            updatable,
        )

    def get_medical_record(self, patient_id: str, medical_visit_id: int) -> Optional[dict[str, Any]]:
        return self.fetch_one(
            "medical_record_view",
            filters={
                "patient_id": patient_id,
                "medical_visit_id": str(medical_visit_id),
            },
        )

    def create(self, data: Any, staff_id: str) -> Optional[int]:
        response = (
            self.supabase
            .table("MEDICAL_VISIT")
            .insert(data.to_db_dict(staff_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]
