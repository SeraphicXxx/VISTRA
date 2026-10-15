from app.repositories.base import BaseRepository


class StaffRepository(BaseRepository):

    def get_by_id(self, staff_id: str):
        return self.fetch_one(
            "STAFF",
            filters={"staff_id": staff_id},
        )

    def get_permissions(self, staff_id: str):
        """STAFF_PERMISSIONS row, or None for legacy rows / denied reads."""
        return self.fetch_one(
            "STAFF_PERMISSIONS",
            filters={"staff_id": staff_id},
        )

    def get_staff(self):
        return self.fetch_all("STAFF")

    def delete(self, staff_id: str):
        return self.delete_by_column("STAFF", "staff_id", staff_id)
