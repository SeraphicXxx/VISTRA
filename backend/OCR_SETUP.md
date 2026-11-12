# Document OCR (VISTRA integration)

The OCR module is provided by the standalone package
`vistra-document-intelligence` (GitHub: KENJICHUA/vistra-document-intelligence).

## Install

```bash
pip install -r requirements.txt
```

This installs the OCR package from GitHub. For local development you may
instead install it in editable mode:

```bash
pip install -e C:\Users\Administrator\PycharmProjects\vistra-document-intelligence
```

## Environment variables

PaddleOCR runs on CPU by default. The service sets these automatically,
but you can override them in `.env`:

- `PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK=True`
- `PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT=False`
- `OMP_NUM_THREADS=1`

## Endpoints

- `POST /api/v1/ocr/extract` — upload image/PDF, returns OCR result
- `GET /api/v1/ocr/{document_id}` — retrieve cached result
- `POST /api/v1/ocr/{document_id}/review` — apply review/approval

No clinical tables are written by the OCR endpoints.