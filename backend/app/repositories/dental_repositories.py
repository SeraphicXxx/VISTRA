from app.repositories.base import BaseRepository, fetch_visit_tab
from app.schemas.query import FilterDental


class DentalRepositories(BaseRepository):
    def create(self, data, staff_id):
        response = (
            self.supabase
            .table("DENTAL_VISIT")
            .insert(data.to_db_dict(staff_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]

    def create_odontogram(
            self,
            data,
            patient_id,
            dental_record_id: int
    ):
        teeth = [
            item.to_db_dict(patient_id, dental_record_id)
            for item in data
        ]
        response = (
            self.supabase
            .table("ODONTOGRAM")
            .insert(teeth)
            .execute()
        )

        return response.data

    def get_dental_visits(self, filters: FilterDental):
        return fetch_visit_tab(
            self.supabase,
            "dental_tab",
            columns=(
                "id, patient_id, patient_name, course, "
                "visit_date, staff_id, status"
            ),
            filters=filters,
        )

    def get_dental_record(self, patient_id: str, dental_visit_id: int):
        return self.fetch_one(
            "dental_record_view",
            filters={
                "patient_id": patient_id,
                "dental_visit_id": str(dental_visit_id),
            },
        )

    def get_visit_by_id(self, dental_visit_id: int):
        return self.fetch_one(
            "DENTAL_VISIT",
            select="id",
            filters={"id": dental_visit_id},
        )

    def delete_visit_cascade(self, dental_visit_id: int):
        # Atomic: odontogram + visit deleted in one transaction.
        # Requires migration 20261010120000_cascade_deletes.
        self.supabase.rpc(
            "delete_dental_visit",
            {"p_visit_id": dental_visit_id},
        ).execute()

    def delete_visit(self, dental_visit_id: int):
        return self.delete_by_column("DENTAL_VISIT", "id", dental_visit_id)
