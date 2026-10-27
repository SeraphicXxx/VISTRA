
from typing import Any

from app.repositories.base import BaseRepository


class VitalSignsRepository(BaseRepository):
    TABLE = "VITAL_SIGNS"

    def create(self, vital_signs_data: dict[str, Any]) -> dict | None:
        """Create a vital signs record for a patient."""
        response = (
            self.supabase
            .table(self.TABLE)
            .insert(vital_signs_data)
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]

    def get_by_id(self, vital_signs_id: int) -> dict | None:
        """Retrieve a vital signs record by its primary key."""
        return self.fetch_one(
            self.TABLE,
            filters={"id": vital_signs_id},
        )

    def get_by_patient_id(self, patient_id: str) -> list[dict]:
        """Retrieve all vital signs records for a patient."""
        response = (
            self.supabase
            .table(self.TABLE)
            .select("*")
            .eq("patient_id", patient_id)
            .order("recorded_at", desc=True)
            .execute()
        )

        return response.data or []

    def get_latest_by_patient_id(self, patient_id: str) -> dict | None:
        """Retrieve the most recently recorded vital signs for a patient."""
        response = (
            self.supabase
            .table(self.TABLE)
            .select("*")
            .eq("patient_id", patient_id)
            .order("recorded_at", desc=True)
            .order("id", desc=True)
            .limit(1)
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]

    def update(
        self,
        vital_signs_id: int,
        vital_signs_data: dict[str, Any],
    ) -> dict | None:
        """Update a vital signs record by its primary key."""
        return self.update_by_column(
            self.TABLE,
            "id",
            vital_signs_id,
            vital_signs_data,
        )

    def delete(self, vital_signs_id: int) -> bool:
        """Delete a vital signs record by its primary key."""
        return self.delete_by_column(
            self.TABLE,
            "id",
            vital_signs_id,
        )
