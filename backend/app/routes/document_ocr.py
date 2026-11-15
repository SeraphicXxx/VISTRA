import re
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from supabase import Client

from app.config.security import get_current_user, require_staff
from app.database.database_client import get_supabase_for_user
from app.schemas.user import CurrentUser
from app.services.access import require_module
try:
    from app.services.document_ocr_service import (
        extract_document,
        get_ocr_result,
        review_ocr_result,
    )
except Exception:  # pragma: no cover - optional dependency (document_intelligence)
    extract_document = None  # type: ignore
    get_ocr_result = None  # type: ignore
    review_ocr_result = None  # type: ignore

document_ocr_router = APIRouter(
    prefix="/ocr",
    tags=["Document OCR"],
    dependencies=[
        Depends(require_staff),
        Depends(require_module("medical")),
    ],
)

# Public OCR router for self-registration (no auth)
public_ocr_router = APIRouter(
    prefix="/ocr",
    tags=["Document OCR"],
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
@public_ocr_router.post("/application-form")
async def extract_application_form(file: UploadFile = File(...)):
    content = await file.read()
    await file.close()

    extracted: dict = {}

    filename = (file.filename or "").lower()
    if filename.endswith(".pdf"):
        try:
            from io import BytesIO
            from pypdf import PdfReader

            reader = PdfReader(BytesIO(content))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)

            m = re.search(r"STUDENT\s*NO\.?\s*:\s*([A-Za-z0-9-]+)", text, re.IGNORECASE)
            if m:
                extracted["patient_id"] = m.group(1).strip()

            m = re.search(r"NAME\s*:\s*(.+)", text, re.IGNORECASE)
            if m:
                extracted["name"] = m.group(1).strip()

            m = re.search(r"AGE\s*:\s*(\d+)", text, re.IGNORECASE)
            if m:
                extracted["age"] = m.group(1).strip()

            m = re.search(r"SEX\s*:\s*(\w+)", text, re.IGNORECASE)
            if m:
                extracted["sex"] = m.group(1).strip()

            m = re.search(r"ADDRESS\s*:\s*(.+)", text, re.IGNORECASE)
            if m:
                extracted["address"] = m.group(1).strip()

            m = re.search(r"BARANGAY\s*NO\.?\s*:\s*(.+)", text, re.IGNORECASE)
            if m:
                extracted["barangay"] = m.group(1).strip()

            m = re.search(r"DATE OF BIRTH\s*:\s*(.+)", text, re.IGNORECASE)
            if m:
                extracted["birthday"] = m.group(1).strip()

            m = re.search(r"CIVIL STATUS\s*:\s*(\w+)", text, re.IGNORECASE)
            if m:
                extracted["civil_status"] = m.group(1).strip()

            m = re.search(r"CELLPHONE NO\.?\s*:\s*([0-9]+)", text, re.IGNORECASE)
            if m:
                extracted["mobile_number"] = m.group(1).strip()

        except Exception:
            pass

    return extracted
