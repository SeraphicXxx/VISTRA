from app.repositories.base import BaseRepository


class StaffRepository(BaseRepository):

    def get_by_id(self, staff_id: str):
        return self.fetch_one(
            "STAFF",
            filters={"staff_id": staff_id},
        )

    def create(self, staff_data):
        return (
            self.supabase
            .table("STAFF")
            .insert(staff_data.model_dump())
            .execute()
        )

    def get_staff(self):
        return self.fetch_all("STAFF")

    def delete(self, staff_id: str):
        return self.delete_by_column("STAFF", "staff_id", staff_id)
