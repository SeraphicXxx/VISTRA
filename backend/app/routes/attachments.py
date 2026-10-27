
from pathlib import Path
from typing import Literal
from uuid import UUID

from app.services.attachments import (
    upload_attachment as upload_attachment_service,
    get_patient_attachments as get_patient_attachments_service,
    get_attachment_download as get_attachment_download_service,
    delete_attachment as delete_attachment_service,
)
from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import FileResponse
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.enums.attachments import AttachmentCategory
from app.schemas.user import CurrentUser
from app.services.access import require_module

protected_attachment_router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"],
    dependencies=[
        Depends(require_staff),
        Depends(require_module("medical")),
    ],
)

@protected_attachment_router.post("/upload", status_code=201)
async def upload_attachment(
    patient_id: str = Form(...),
    medical_visit_id: int = Form(default=None),
    category: AttachmentCategory = Form(...),
    file: UploadFile = File(...),
    supabase: Client = Depends(get_supabase_for_user),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        content = await file.read(10 * 1024 * 1024 + 1)

        return upload_attachment_service(
            patient_id=patient_id,
            category=category,
            file_name=file.filename or "attachment",
            content=content,
            supabase=supabase,
            current_user=current_user,
            medical_visit_id=medical_visit_id,
        )
    finally:
        await file.close()

@protected_attachment_router.get("/patient/{patient_id}")
def get_patient_attachments(
    patient_id: str,
    category: AttachmentCategory | None = None,
    supabase: Client = Depends(get_supabase_for_user),
):
    return get_patient_attachments_service(
        patient_id=patient_id,
        supabase=supabase,
        category=category,
    )


@protected_attachment_router.get("/{attachment_id}/download")
def download_attachment(
    attachment_id: UUID,
    supabase: Client = Depends(get_supabase_for_user),
):
    result = get_attachment_download_service(
        attachment_id=attachment_id,
        supabase=supabase,
    )

    # The service nests its internal result under "data".
    download_data = result["data"]
    attachment = download_data["attachment"]
    path = Path(download_data["path"])

    return FileResponse(
        path=path,
        media_type=attachment["mime_type"],
        filename=attachment["file_name"],
        content_disposition_type="attachment",
        headers={"X-Content-Type-Options": "nosniff"},
    )



@protected_attachment_router.delete("/{attachment_id}")
def delete_attachment(
    attachment_id: UUID,
    supabase: Client = Depends(get_supabase_for_user),
):
    return delete_attachment_service(
        attachment_id=attachment_id,
        supabase=supabase,
    )
