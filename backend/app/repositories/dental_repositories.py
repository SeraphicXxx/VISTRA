from typing import Any

from app.repositories.base import BaseRepository, fetch_visit_tab
from app.schemas.dental import (
    EDITABLE_ODONTOGRAM_COLUMNS,
    EDITABLE_VISIT_COLUMNS,
)
from app.schemas.query import FilterDental


class DentalRepository(BaseRepository):
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

    def get_tooth_by_number(self, dental_record_id: int, tooth_number: int):
        return self.fetch_one(
            "ODONTOGRAM",
            filters={
                "dental_record_id": dental_record_id,
                "tooth_number": tooth_number,
            },
        )

    def insert_tooth(self, tooth_data: dict[str, Any]):
        response = (
            self.supabase
            .table("ODONTOGRAM")
            .insert(tooth_data)
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]

    def update_visit(self, dental_visit_id: int, visit_data: dict[str, Any]):
        updatable = {
            key: value
            for key, value in (visit_data or {}).items()
            if key in EDITABLE_VISIT_COLUMNS
        }

        if not updatable:
            raise ValueError(
                "No updatable fields provided. Allowed: "
                + ", ".join(sorted(EDITABLE_VISIT_COLUMNS))
            )

        return self.update_by_column(
            "DENTAL_VISIT",
            "id",
            dental_visit_id,
            updatable,
        )

    def update_odontogram(self, tooth_id: int, tooth_data: dict[str, Any]):
        updatable = {
            key: value
            for key, value in (tooth_data or {}).items()
            if key in EDITABLE_ODONTOGRAM_COLUMNS
        }

        if not updatable:
            raise ValueError(
                "No updatable fields provided. Allowed: "
                + ", ".join(sorted(EDITABLE_ODONTOGRAM_COLUMNS))
            )

        return self.update_by_column(
            "ODONTOGRAM",
            "id",
            tooth_id,
            updatable,
        )
