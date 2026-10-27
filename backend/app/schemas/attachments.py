from pydantic import BaseModel, ConfigDict
from app.enums.attachments import AttachmentCategory


class AttachmentResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    patient_id: str
    uploaded_by: str
    category: AttachmentCategory
    file_name: str
    storage_path: str
    mime_type: str
    file_size: int
    medical_visit_id: int
    created_at: str