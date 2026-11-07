from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.schemas.user import CurrentUser
from app.services.access import require_module
from app.services.document_ocr_service import (
    extract_document,
    get_ocr_result,
    review_ocr_result,
)

document_ocr_router = APIRouter(
    prefix="/ocr",
    tags=["Document OCR"],
    dependencies=[
        Depends(require_staff),
        Depends(require_module("medical")),
    ],
)


@document_ocr_router.post("/extract", status_code=201)
async def extract_document_route(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(default=None),
    supabase: Client = Depends(get_supabase_for_user),
    current_user: CurrentUser = Depends(get_current_user),
):
    content = await file.read(10 * 1024 * 1024 + 1)
    try:
        return extract_document(
            file_name=file.filename or "document",
            content=content,
            patient_id=patient_id,
            supabase=supabase,
            current_user=current_user,
        )
    finally:
        await file.close()


@document_ocr_router.get("/{document_id}")
def get_ocr_result_route(
    document_id: str,
    supabase: Client = Depends(get_supabase_for_user),
):
    return get_ocr_result(document_id=document_id, supabase=supabase)


@document_ocr_router.post("/{document_id}/review")
def review_ocr_result_route(
    document_id: str,
    approved: bool = Form(...),
    corrections_json: Optional[str] = Form(default=None),
    notes: Optional[str] = Form(default=None),
    supabase: Client = Depends(get_supabase_for_user),
    current_user: CurrentUser = Depends(get_current_user),
):
    import json

    corrections = json.loads(corrections_json) if corrections_json else None
    return review_ocr_result(
        document_id=document_id,
        approved=approved,
        corrections=corrections,
        notes=notes,
        supabase=supabase,
        current_user=current_user,
    )