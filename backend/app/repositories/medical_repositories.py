from typing import Any

from app.repositories.base import BaseRepository, fetch_visit_tab
from app.utils.supabase_query_builder import SupabaseQueryBuilder
from app.schemas.medical import EDITABLE_MEDICAL_VISIT_COLUMNS
from app.schemas.query import FilterMedical


class MedicalRepository(BaseRepository):

    def get_medical_visits(self, filters: FilterMedical):
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

    def get_patient_medical_tab(self, patient_id: str, filters: FilterMedical):
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

    def delete_visit(self, medical_visit_id: int):
        return self.delete_by_column("MEDICAL_VISIT", "id", medical_visit_id)

    def update_visit(self, medical_visit_id: int, visit_data: dict[str, Any]):
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

    def get_medical_record(self, patient_id: str, medical_visit_id: int):
        return self.fetch_one(
            "medical_record_view",
            filters={
                "patient_id": patient_id,
                "medical_visit_id": str(medical_visit_id),
            },
        )

    def create(self, data, staff_id: str):
        response = (
            self.supabase
            .table("MEDICAL_VISIT")
            .insert(data.to_db_dict(staff_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]