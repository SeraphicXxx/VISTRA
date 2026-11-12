# Backend Optimization Prompt

Use this prompt to guide the optimization of the VISTRA FastAPI + Supabase backend. Execute phases in order; do not skip Phase 1 (the patient schema import bug is a known issue per AGENTS.md).

## Context

VISTRA is a clinic management system (public landing + staff portal + patient portal + mobile app). Backend is FastAPI + Supabase (no ORM), version 5.1.0, deployed via uvicorn on port 8000. CI runs Postman collection tests via GitHub Actions.

## Task

Optimize the backend across six phases:

### Phase 1 — Reliability (fix → 0.0.X) ✅ COMPLETED

1. **Fix `schemas/patient.py` import bug:** Add missing imports of `confirm_birthday` and `confirm_age` from `app.utils.validator.common`. (Known bug per AGENTS.md line 56.)
2. **Standardize Supabase responses:** Audit all service functions. Any that return raw `response` (full Supabase Postgrest object) instead of `response.data` must be changed to return `response.data`.
3. **Add Postgres error code handling:** In `utils/service_helpers.py` `handle_service_errors`, catch `postgrest.exceptions.APIError` and map PG codes: `23503` (foreign key) → HTTP 409 Conflict, `23505` (unique violation) → HTTP 422 Unprocessable Content. All other APIError → 500.

### Phase 2 — Performance (feature → 0.X.0 → 5.1.0) ✅ COMPLETED

1. **Prewarm JWKS client:** Add `@app.on_event("startup")` in `main.py` that calls `_get_client()` to avoid first-request latency.
2. **Add pagination defaults:** `get_all_patients` accepts optional `page`/`page_size` query params returning `PaginatedResponse`.
3. **Add TTLCache:** Cache read-heavy, low-churn endpoints (overview stats) with 60s TTL using `cachetools.TTLCache`.
4. **Tune Supabase client:** Set appropriate timeouts and retry behavior on `create_client` in `database_client.py` (pending).

### Phase 3 — Security (fix → 0.0.X) ✅ COMPLETED

1. **Security headers:** Add middleware in `main.py` for HSTS (prod), X-Content-Type-Options, X-Frame-Options, Referrer-Policy.
2. **Rate limit `/auth/login`:** Add `slowapi` rate limiter keyed by IP on the login endpoint (5/minute).
3. **429 handler:** Add exception handler returning `{"success": False, "detail": "Rate limit exceeded..."}`.

### Phase 4 — Code Quality (feature → 0.X.0) — PENDING

1. **Standardize import ordering:** All `services/*.py` and `routes/*.py` should follow stdlib → third-party → app imports.
2. **Add type hints:** Add full return types to all repository methods.
3. **Add `select` to `fetch_all`:** Parity with `fetch_one`.
4. **Pydantic response models:** Define response schemas and use `response_model=` on routes.

### Phase 5 — Database (feature → 0.X.0) — PENDING

1. **Audit indexes:** Review Supabase tables for missing indexes on foreign keys and filter columns.
2. **Document cascade-delete:** The `delete_patient_records` RPC depends on migration `20261010120000_cascade_deletes`.
3. **Soft-delete consideration:** Evaluate adding `deleted_at` to PATIENT, STAFF, APPOINTMENT.

### Phase 6 — Observability & CI (feature → 0.X.0) — PENDING

1. **JSON structured logging:** Configure `logging` with JSON formatter in `main.py` startup.
2. **CI lint + typecheck:** Add `ruff` and `mypy` steps to `.github/workflows/postman.yaml`.
3. **Log capture:** Ensure backend logs go to stdout for container capture.

## Success Criteria

- Backend starts without errors: `uvicorn app.main:app --reload`
- `GET /api/health` returns 200
- `/docs` loads with all v1 routes
- No unhandled 500s from PG error codes 23503/23505
- All service functions return `ok({"data": ...})` envelopes consistently
- CI pipeline passes lint + typecheck + Postman tests

## Versioning

Per `backend/versioning plan`:
- Phase 1 fixes → `5.0.1`, `5.0.2`...
- Phase 2-6 features → `5.1.0` (current), `5.2.0`...
- Any breaking change (DB schema, response model changes) → `6.0.0`

Update `app = FastAPI(version="...")` in `main.py` accordingly.
