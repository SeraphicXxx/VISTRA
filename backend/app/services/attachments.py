
from pathlib import Path
from uuid import UUID, uuid4
import logging

import magic
from fastapi import HTTPException
from supabase import Client

from app.config.security import require_user_email
from app.enums.attachments import AttachmentCategory
from app.repositories.attachments_repositories import AttachmentRepository
from app.schemas.user import CurrentUser
from app.utils.email_utils import staff_id_format
from app.utils.service_helpers import (
    handle_service_errors,
    ok,
    or_404,
)


logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 10 * 1024 * 1024

IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/bmp": ".bmp",
    "image/tiff": ".tif",
}

ALLOWED_TYPES = {
    AttachmentCategory.LABORATORY_RESULT: {
        **IMAGE_TYPES,
        "application/pdf": ".pdf",
    },
    AttachmentCategory.CLINICAL_PHOTO: IMAGE_TYPES,
}


@handle_service_errors
def upload_attachment(
    patient_id: str,
    category: AttachmentCategory,
    file_name: str,
    content: bytes,
    supabase: Client,
    current_user: CurrentUser,
    medical_visit_id: int
):
    repository = AttachmentRepository(supabase)

    if not content:
        raise HTTPException(400, "File cannot be empty")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File exceeds the 10 MB limit",
        )

    detected_type = magic.from_buffer(content, mime=True)
    extension = ALLOWED_TYPES[category].get(detected_type)

    if extension is None:
        raise HTTPException(
            status_code=415,
            detail="Unsupported file type for this category",
        )

    # Derive the uploader ID from the authenticated user.
    staff_id = staff_id_format(
        require_user_email(current_user)
    )

    attachment_id = uuid4()

    relative_path = (
        Path(patient_id)
        / category.value
        / f"{attachment_id}{extension}"
    ).as_posix()

    metadata = {
        "id": str(attachment_id),
        "patient_id": patient_id,
        "medical_visit_id": medical_visit_id,
        "uploaded_by": str(staff_id),
        "category": category.value,
        "file_name": Path(file_name or "attachment").name,
        "storage_path": relative_path,
        "mime_type": detected_type,
        "file_size": len(content),
    }

    # Persist the file first, then insert its metadata.
    repository.save_file(relative_path, content)

    try:
        attachment = repository.create(metadata)

        or_404(
            attachment,
            "Failed to create attachment metadata",
        )

    except Exception:
        try:
            repository.delete_file(relative_path)
        except Exception:
            logger.exception(
                "Failed to remove local file after metadata insertion failed"
            )
        raise

    return ok(
        data=attachment,
        message="Attachment uploaded successfully",
    )


@handle_service_errors
def get_patient_attachments(
    patient_id: str,
    supabase: Client,
    category: str | None = None,
):
    repository = AttachmentRepository(supabase)

    attachments = repository.get_by_patient(
        patient_id=patient_id,
        category=category.value if category else None,
    )

    return ok(data=attachments)


@handle_service_errors
def get_attachment_download(
    attachment_id: UUID,
    supabase: Client,
):
    repository = AttachmentRepository(supabase)

    attachment = or_404(
        repository.get_by_id(attachment_id),
        "Attachment not found",
    )

    path = repository.get_file_path(
        attachment["storage_path"]
    )

    if not path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Attachment file not found",
        )

    # Internal result consumed by the download route.
    return {
        "success": True,
        "data": {
            "attachment": attachment,
            "path": str(path),
        },
    }


@handle_service_errors
def delete_attachment(
    attachment_id: UUID,
    supabase: Client,
):
    repository = AttachmentRepository(supabase)

    attachment = or_404(
        repository.get_by_id(attachment_id),
        "Attachment not found",
    )

    # Remove metadata first so the attachment is no longer
    # discoverable through the application.
    deleted = repository.delete_metadata(attachment_id)

    or_404(
        deleted,
        "Failed to delete attachment metadata",
    )

    # Filesystem cleanup can fail independently of PostgreSQL.
    try:
        repository.delete_file(attachment["storage_path"])
    except Exception:
        logger.exception(
            "Attachment metadata deleted, but local file cleanup failed"
        )

    return ok(
        message="Attachment deleted successfully",
    )
