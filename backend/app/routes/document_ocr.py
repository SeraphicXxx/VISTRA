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
    text = ""

    # Use the OCR pipeline for both images and PDFs.
    try:
        import os
        import tempfile
        from pathlib import Path

        suffix = Path(file.filename or "document").suffix.lower()
        if suffix not in {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".pdf"}:
            suffix = ".png"

        tmp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(content)
                tmp_path = tmp.name
            from document_intelligence import OCRPipeline

            pipeline = OCRPipeline()
            result = pipeline.process(tmp_path)
            text = result.raw_text or ""

            # Map pipeline extracted_data to frontend DetailKeys.
            ed = result.extracted_data or {}
            def val(k):
                v = ed.get(k)
                if isinstance(v, dict):
                    return v.get("value")
                return v

            student_no = val("student_number")
            if student_no:
                extracted["patient_id"] = str(student_no).strip()

            name = val("name")
            if name:
                extracted["name"] = str(name).strip()

            age = val("age")
            if age:
                extracted["age"] = str(age).strip()

            sex = val("sex")
            if sex:
                extracted["sex"] = str(sex).strip()

            dob = val("date_of_birth")
            if dob:
                extracted["birthday"] = str(dob).strip()

            civil = val("civil_status")
            if civil:
                extracted["civil_status"] = str(civil).strip()

            # Address / barangay / mobile from raw text (pipeline doesn't extract them)
            m = re.search(r"ADDRESS\s*\n\s*(.+)", text, re.IGNORECASE)
            if m and "address" not in extracted:
                extracted["address"] = m.group(1).strip()
            m = re.search(r"BARANGAY\s*NO\.?\s*:\s*(.+)", text, re.IGNORECASE)
            if m and "barangay" not in extracted:
                extracted["barangay"] = m.group(1).strip()
            m = re.search(r"CELLPHONE NO\.?\s*:\s*([0-9]+)", text, re.IGNORECASE)
            if m and "mobile_number" not in extracted:
                extracted["mobile_number"] = m.group(1).strip()

        finally:
            if tmp_path:
                try:
                    Path(tmp_path).unlink(missing_ok=True)
                except Exception:
                    pass
    except Exception:
        text = ""

    # Fallback regex extraction from raw OCR text.
    if text and "patient_id" not in extracted:
        m = re.search(r"STUDENT\s*NO\.?\s*:\s*([A-Za-z0-9-]+)", text, re.IGNORECASE)
        if not m:
            m = re.search(r"\b(\d+-[A-Z])\b", text)
        if m:
            extracted["patient_id"] = m.group(1).strip()

    return extracted
