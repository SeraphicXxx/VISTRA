# VISTRA Backend Optimization Plan

**Repo:** `C:\Users\Administrator\WebstormProjects\VISTRA`
**Backend path:** `backend/` (FastAPI + Supabase, no ORM)
**Current version:** `5.1.0`
**Target version:** `5.2.0` (feature) / `6.0.0` (breaking if needed)

## .opencode Infrastructure

| Artifact | Path | Purpose |
|----------|------|---------|
| Skill | `.opencode/skills/backend-optimizer.md` | Conventions, phases, commands |
| Agent | `.opencode/agents/backend-optimization-agent.md` | System prompt, guardrails, priority order |
| Prompt | `.opencode/prompts/backend-optimization-prompt.md` | Detailed task instructions, success criteria |
| Plan | `.opencode/backend-optimization-plan.md` | This file |

## Completed Work

### Phase 1 — Reliability (fix → 5.0.1) ✅ DONE

| Task | Status | File(s) |
|------|--------|---------|
| Patient schema import bug | `confirm_birthday` already imported; `confirm_age` doesn't exist in codebase | `schemas/patient.py` — no change needed |
| Standardize Supabase responses | Already correct — all repository methods extract `.data` before returning | `repositories/*_repositories.py` |
| Postgres error code handling | ✅ PG 23503 → HTTP 409, PG 23505 → HTTP 422, other → 500 | `utils/service_helpers.py` |

### Phase 2 — Performance (feature → 5.1.0) ✅ DONE

| Task | Status | File(s) |
|------|--------|---------|
| JWKS prewarm at startup | ✅ `@app.on_event("startup")` calls `_get_client()` | `app/main.py` |
| Pagination for `get_all_patients` | ✅ `page`/`page_size` query params, `PaginatedResponse` | `services/patient.py`, `routes/patient.py` |
| TTLCache for overview stats | ✅ 60s TTL, max 128 entries | `services/overview.py` |
| `cachetools` dependency | ✅ Added `cachetools==5.5.0` | `requirements.txt` |

### Phase 3 — Security (fix → 5.1.0) ✅ DONE

| Task | Status | File(s) |
|------|--------|---------|
| Security headers middleware | ✅ X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS (prod) | `app/main.py` |
| Rate limiting on `/auth/login` | ✅ 5/minute via `slowapi`, keyed by client IP | `routes/auth.py` |
| Rate limit exceeded handler | ✅ 429 handler returning `{"success": False, ...}` | `app/main.py` |
| `slowapi` dependency | ✅ Added `slowapi==0.1.9` | `requirements.txt` |
| Request latency middleware | ✅ Logs method/path/status/duration_ms, sets `X-Response-Time` | `app/main.py` |

### Phase 4 — Code Quality (pending)

| Task | Status |
|------|--------|
| Standardize import ordering | ⏳ Pending |
| Full type hints on repositories | ⏳ Pending |
| `select` param on `fetch_all` | ⏳ Pending |
| Pydantic response models + `response_model=` | ⏳ Pending |

### Phase 5 — Database (pending)

| Task | Status |
|------|--------|
| Audit/add indexes | ⏳ Pending |
| Document cascade-delete dependency | ⏳ Pending |
| Soft-delete consideration | ⏳ Pending |

### Phase 6 — Observability & CI (pending)

| Task | Status |
|------|--------|
| JSON structured logging | ⏳ Pending |
| CI lint + typecheck | ⏳ Pending |
| Log rotation / stdout capture | ⏳ Pending |

## Files Modified

| File | Changes |
|------|---------|
| `backend/app/main.py` | Version 5.1.0; added `Request`, `status`, `JSONResponse`, `logging`, `time` imports; added `auth_limiter` from routes.auth; registered `app.state.limiter`; added 429 exception handler; added request latency + security headers middleware; added JWKS startup prewarm |
| `backend/app/utils/service_helpers.py` | Added `APIError` import; added `_PG_ERROR_MAP` (23503→409, 23505→422); added `APIError` handling in `handle_service_errors` |
| `backend/app/services/patient.py` | Added `PaginationParams`, `SupabaseQueryBuilder` imports; `get_all_patients` now accepts `page`/`page_size` and returns `PaginatedResponse` |
| `backend/app/routes/patient.py` | `get_patients` route now accepts `page`/`page_size` query params |
| `backend/app/services/overview.py` | Added `TTLCache` import; added `_overview_cache` (128 entries, 60s TTL); `get_overview_stats` checks cache before DB read |
| `backend/app/routes/auth.py` | Added `Request`, `Limiter`, `get_remote_address` imports; added `limiter = Limiter(...)`; `@limiter.limit("5/minute")` on login endpoint |
| `backend/requirements.txt` | Added `cachetools==5.5.0`, `slowapi==0.1.9` |

### Phase 4 — Code Quality (feature → 5.2.0) ✅ DONE

| Task | Status | File(s) |
|------|--------|---------|
| Standardize import ordering | ✅ Fixed in staff.py, auth/user.py | `services/staff.py`, `services/auth/user.py` |
| Full type hints on repositories | ✅ BaseRepository + all domain repos | `repositories/base.py`, `repositories/*_repositories.py` |
| `select` param on `fetch_all` | ✅ Already existed | `repositories/base.py` |
| Pydantic response models + `response_model=` | ⏳ Pending (generic `Response`/`PaginatedResponse` exist in schemas) | `schemas/response_dto/responses.py` |
| `ruff` + `mypy` dev dependencies | ✅ Added | `requirements.txt` |
| CI lint + typecheck steps | ✅ Added to workflow | `.github/workflows/postman.yaml` |

### Phase 5 — Database (pending)

| Task | Status |
|------|--------|
| Audit/add indexes | ⏳ Pending (indexes already exist in 20261015055421 migration) |
| Document cascade-delete dependency | ⏳ Pending |
| Soft-delete consideration | ⏳ Pending |

### Phase 6 — Observability & CI (pending)

| Task | Status |
|------|--------|
| JSON structured logging | ⏳ Pending |
| CI lint + typecheck | ✅ Done (ruff + mypy in workflow) |
| Log rotation / stdout capture | ⏳ Pending |

## Files Modified (Phase 4)

| File | Changes |
|------|---------|
| `backend/app/repositories/base.py` | Full type hints on all methods (`__init__`, `delete_by_column`, `update_by_column`, `fetch_one`, `fetch_all`, `fetch_page`) |
| `backend/app/repositories/staff_repositories.py` | Full type hints on all methods |
| `backend/app/repositories/patient_repositories.py` | Full type hints on all methods |
| `backend/app/repositories/dental_repositories.py` | Full type hints on all methods |
| `backend/app/repositories/medical_repositories.py` | Full type hints on all methods |
| `backend/app/repositories/appointment_repositories.py` | Full type hints on all methods |
| `backend/app/repositories/overview_repositories.py` | Full type hints on all methods |
| `backend/app/services/staff.py` | Import ordering standardized (stdlib → third-party → app) |
| `backend/app/services/auth/user.py` | Import ordering standardized (stdlib → third-party → app) |
| `backend/requirements.txt` | Added `ruff==0.9.0`, `mypy==1.13.0` |
| `.github/workflows/postman.yaml` | Added ruff lint and mypy typecheck CI steps |

## Next Steps

1. Continue with Phase 5 (database indexes, cascade-delete docs, soft-delete)
2. Phase 6 (JSON structured logging, log rotation)
3. Phase 4.3 remaining: Pydantic response models + `response_model=` on routes
4. Bump version per `backend/versioning plan` on release
