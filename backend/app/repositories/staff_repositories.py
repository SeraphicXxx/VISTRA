from app.repositories.base import BaseRepository


class StaffRepository(BaseRepository):

    def get_by_id(self, staff_id: str):
        return self.fetch_one(
            "STAFF",
            filters={"staff_id": staff_id},
        )

    def get_all_with_permissions(self):
        """All STAFF rows with their STAFF_PERMISSIONS merged.

        Two roundtrips regardless of row count (no per-row lookup):
        staff tables stay small (tens of rows), so this stays
        unpaginated — the table UI pages client-side. permissions is
        None for legacy rows without a permissions record.
        """
        staff_rows = self.fetch_all("STAFF") or []
        perm_rows = self.fetch_all("STAFF_PERMISSIONS") or []

        perms_by_staff_id = {
            row["staff_id"]: row for row in perm_rows if row.get("staff_id")
        }

        return [
            {**row, "permissions": perms_by_staff_id.get(row.get("staff_id"))}
            for row in staff_rows
        ]

    def get_permissions(self, staff_id: str):
        """STAFF_PERMISSIONS row, or None for legacy rows / denied reads."""
        return self.fetch_one(
            "STAFF_PERMISSIONS",
            filters={"staff_id": staff_id},
        )

    def insert_permissions(self, staff_id: str, perms: dict):
        response = (
            self.supabase
            .table("STAFF_PERMISSIONS")
            .insert({"staff_id": staff_id, **perms})
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]

    def update_permissions(self, staff_id: str, perms: dict):
        return self.update_by_column(
            "STAFF_PERMISSIONS",
            "staff_id",
            staff_id,
            perms,
        )

    def update_role(self, staff_id: str, role: str):
        return self.update_by_column(
            "STAFF",
            "staff_id",
            staff_id,
            {"role": role},
        )

    def get_staff(self):
        return self.fetch_all("STAFF")

    def delete(self, staff_id: str):
        return self.delete_by_column("STAFF", "staff_id", staff_id)

    def delete_permissions(self, staff_id: str):
        return self.delete_by_column("STAFF_PERMISSIONS", "staff_id", staff_id)
