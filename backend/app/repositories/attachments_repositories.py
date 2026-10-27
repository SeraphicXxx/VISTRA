
from pathlib import Path
from uuid import UUID

from supabase import Client


# Resolves to the backend project root / PATIENT_ATTACHMENTS.
ATTACHMENT_ROOT = (
    Path(__file__).resolve().parents[2] / "PATIENT_ATTACHMENTS"
).resolve()


class AttachmentRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def save_file(self, relative_path: str, content: bytes) -> Path:
        destination = self._resolve_path(relative_path)
        destination.parent.mkdir(parents=True, exist_ok=True)

        # Never overwrite an existing file.
        with destination.open("xb") as output:
            output.write(content)

        return destination

    def delete_file(self, relative_path: str) -> None:
        destination = self._resolve_path(relative_path)
        destination.unlink(missing_ok=True)

    def file_exists(self, relative_path: str) -> bool:
        return self._resolve_path(relative_path).is_file()

    def get_file_path(self, relative_path: str) -> Path:
        return self._resolve_path(relative_path)

    def _resolve_path(self, relative_path: str) -> Path:
        relative = Path(relative_path)

        if relative.is_absolute() or ".." in relative.parts:
            raise ValueError("Invalid attachment storage path")

        destination = (ATTACHMENT_ROOT / relative).resolve()

        if not destination.is_relative_to(ATTACHMENT_ROOT):
            raise ValueError("Attachment path is outside storage directory")

        return destination

    def create(self, data: dict):
        response = (
            self.supabase
            .table("PATIENT_ATTACHMENTS")
            .insert(data)
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]

    def get_by_id(self, attachment_id: UUID):
        response = (
            self.supabase
            .table("PATIENT_ATTACHMENTS")
            .select("*")
            .eq("id", str(attachment_id))
            .limit(1)
            .execute()
        )

        return response.data[0] if response.data else None

    def get_by_medical_visit(self, medical_visit_id: int):
        response = (
            self.supabase.table("patient_attachments")
            .select("*")
            .eq("medical_visit_id", medical_visit_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []

    def get_by_patient(self, patient_id: str, category: str | None = None):
        query = (
            self.supabase
            .table("PATIENT_ATTACHMENTS")
            .select("*")
            .eq("patient_id", patient_id)
            .order("created_at", desc=True)
        )

        if category:
            query = query.eq("category", category)

        response = query.execute()
        return response.data or []

    def delete_metadata(self, attachment_id: UUID):
        response = (
            self.supabase
            .table("PATIENT_ATTACHMENTS")
            .delete()
            .eq("id", str(attachment_id))
            .execute()
        )

        return response.data[0] if response.data else None
