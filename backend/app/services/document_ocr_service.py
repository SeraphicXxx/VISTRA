"""Document OCR service.

This service runs the standalone document_intelligence package. It performs
NO database writes and NO clinical-record updates. OCR results are kept in
an in-memory cache for the review step; the VISTRA backend remains the
owner of any future persistence.
"""

from __future__ import annotations

import logging
import os
import tempfile
from pathlib import Path
from typing import Any, Dict, Optional

from fastapi import HTTPException
from supabase import Client

from app.schemas.user import CurrentUser
from app.utils.service_helpers import handle_service_errors, ok

# Ensure PaddleOCR runs stably on CPU.
os.environ.setdefault("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK", "True")
os.environ.setdefault("PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT", "False")
os.environ.setdefault("OMP_NUM_THREADS", "1")

from document_intelligence import (  # noqa: E402
    OCRPipeline,
    apply_review,
)

logger = logging.getLogger(__name__)

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".pdf"}

# In-memory cache for the review workflow (process-local, non-persistent).
_OCR_RESULTS: Dict[str, Any] = {}


def _run_ocr(content: bytes, filename: str):
    if not content:
        raise HTTPException(status_code=400, detail="File cannot be empty")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds the 10 MB limit")

    suffix = Path(filename or "document").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=415, detail="Unsupported file type for OCR")

    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(content)
            tmp_path = tmp.name
        pipeline = OCRPipeline()
        return pipeline.process(tmp_path)
    finally:
        if tmp_path:
            try:
                Path(tmp_path).unlink(missing_ok=True)
            except Exception:
                logger.exception("Failed to remove temporary OCR file")


@handle_service_errors
def extract_document(
    file_name: str,
    content: bytes,
    patient_id: Optional[str],
    supabase: Client,
    current_user: CurrentUser,
):
    result = _run_ocr(content, file_name)
    if patient_id:
        result.extracted_data.setdefault("patient_id", patient_id)

    _OCR_RESULTS[result.document_id] = result
    logger.info("OCR extracted document %s for user %s", result.document_id, current_user.id)

    return ok(
        data=result.model_dump(),
        message="Document OCR completed successfully",
    )


@handle_service_errors
def get_ocr_result(document_id: str, supabase: Client):
    result = _OCR_RESULTS.get(document_id)
    if result is None:
        raise HTTPException(status_code=404, detail="OCR result not found")
    return ok(data=result.model_dump())


@handle_service_errors
def review_ocr_result(
    document_id: str,
    approved: bool,
    corrections: Optional[Dict[str, Any]],
    notes: Optional[str],
    supabase: Client,
    current_user: CurrentUser,
):
    result = _OCR_RESULTS.get(document_id)
    if result is None:
        raise HTTPException(status_code=404, detail="OCR result not found")

    record = apply_review(
        result,
        reviewer_id=current_user.id,
        approved=approved,
        corrections=corrections,
        notes=notes,
    )
    _OCR_RESULTS[document_id] = result

    return ok(
        data={
            "document_id": document_id,
            "review": record.model_dump(),
            "result": result.model_dump(),
        },
        message="OCR review recorded",
    )