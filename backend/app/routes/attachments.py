
from pathlib import Path
from uuid import UUID

from app.repositories.attachments_repositories import AttachmentRepository
from app.services.attachments import (
    upload_medical_attachment as upload_medical_attachment_service,
    upload_appointment_attachment as upload_appointment_attachment_service,
    get_patient_attachments as get_patient_attachments_service,
    get_attachment_download as get_attachment_download_service,
    delete_attachment as delete_attachment_service,
)
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.enums.attachments import AttachmentCategory
from app.schemas.response_dto.responses import DataResponse, SuccessResponse
from app.schemas.user import CurrentUser
from app.services.access import get_patient_scope, enforce_patient_scope, require_module

protected_attachment_router = APIRouter(
    prefix="/attachments",
    tags=["Attachments"],
    dependencies=[
        Depends(require_staff),
        Depends(require_module("medical")),
    ],
)

patient_attachment_router = APIRouter(
    prefix="/attachments/patient",
    tags=["Patient Attachments"],
    dependencies=[Depends(get_current_user)],
)


@patient_attachment_router.get("/me", response_model=DataResponse)
def get_my_attachments(
    appointment_id: int | None = None,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )
    return get_patient_attachments_service(
        patient_id=scope,
        supabase=supabase,
        appointment_id=appointment_id,
    )

@patient_attachment_router.get("/download/{attachment_id}")
def download_my_attachment(
    attachment_id: UUID,
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )

    repository = AttachmentRepository(supabase)
    attachment = repository.get_by_id(attachment_id)

    if attachment is None or attachment.get("patient_id") != scope:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment not found",
        )

    path = repository.get_file_path(attachment["storage_path"])

    if not path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attachment file not found",
        )

    return FileResponse(
        path=path,
        media_type=attachment["mime_type"],
        filename=attachment["file_name"],
        content_disposition_type="attachment",
        headers={"X-Content-Type-Options": "nosniff"},
    )


@patient_attachment_router.post("/upload", status_code=201, response_model=DataResponse)
async def upload_patient_attachment(
    category: AttachmentCategory = Form(...),
    file: UploadFile = File(...),
    appointment_id: int | None = Form(default=None),
    scope: str | None = Depends(get_patient_scope),
    supabase: Client = Depends(get_supabase_for_user),
):
    if scope is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient account required",
        )

    content = await file.read(10 * 1024 * 1024 + 1)
    await file.close()

    return upload_appointment_attachment_service(
        patient_id=scope,
        category=category,
        file_name=file.filename or "attachment",
        content=content,
        appointment_id=appointment_id,
        supabase=supabase,
    )


@protected_attachment_router.post("/upload", status_code=201, response_model=DataResponse)
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

        return upload_medical_attachment_service(
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

@protected_attachment_router.get("/patient/{patient_id}", response_model=DataResponse)
def get_patient_attachments(
    patient_id: str,
    category: AttachmentCategory | None = None,
    appointment_id: int | None = None,
    supabase: Client = Depends(get_supabase_for_user),
):
    return get_patient_attachments_service(
        patient_id=patient_id,
        supabase=supabase,
        category=category,
        appointment_id=appointment_id,
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



@protected_attachment_router.delete("/{attachment_id}", response_model=SuccessResponse)
def delete_attachment(
    attachment_id: UUID,
    supabase: Client = Depends(get_supabase_for_user),
):
    return delete_attachment_service(
        attachment_id=attachment_id,
        supabase=supabase,
    )
