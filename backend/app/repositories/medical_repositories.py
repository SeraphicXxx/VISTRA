from app.repositories.base import BaseRepository, fetch_visit_tab
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

    def delete_visit(self, medical_visit_id: int):
        return self.delete_by_column("MEDICAL_VISIT", "id", medical_visit_id)

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
