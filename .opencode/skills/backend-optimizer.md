# VISTRA Backend Optimization Skill

**id:** backend-optimizer  
**name:** Backend Optimizer  
**description:** Optimizes the VISTRA FastAPI + Supabase backend following existing conventions (router → service → repository pattern, RLS via get_supabase_for_user, supabase_admin allowlist, ok()/or_404()/handle_service_errors envelope). Covers reliability, performance, security, code quality, database, and observability phases.

## Scope

Repo: `C:\Users\Administrator\WebstormProjects\VISTRA`  
Backend path: `backend/`

## Conventions to Follow (from AGENTS.md)

- **Add endpoint:** `routes/<domain>.py` → `services/<domain>.py` → `repositories/<domain>_repositories.py`
- **DB:** Supabase only, no ORM. UPPERCASE tables. Use `get_supabase_for_user` for RLS; `supabase_admin` only via `get_supabase_admin()` for allowlisted ops.
- **Auth:** Supabase Auth. Local JWT via JWKS (`config/jwks.py`), fallback to `supabase.auth.get_user()`. Roles in `app_metadata.role`. Staff `@ucc.com`.
- **Versioning:** breaking=X.0.0, feature=0.X.0, fix=0.0.X. Routes dual-mounted in `main.py`: legacy + `/api/v1`.
- **Response envelope:** `ok(data=...)`, `or_404(value, detail)`, `@handle_service_errors` decorator.
- **Known bug:** `schemas/patient.py` references `confirm_birthday`/`confirm_age` but doesn't import from `utils/validator/common.py`.

## Optimization Phases

### Phase 1 — Reliability (fix, 0.0.X) ✅ DONE
- Postgres error code handling: PG 23503 → HTTP 409, PG 23505 → HTTP 422

### Phase 2 — Performance (feature, 0.X.0 → 5.1.0) ✅ DONE
- JWKS prewarm at startup
- Pagination for `get_all_patients`
- TTLCache for overview stats (60s TTL)

### Phase 3 — Security (fix) ✅ DONE
- Security headers middleware
- Rate limiting (5/min) on `/auth/login` via slowapi
- 429 rate limit exceeded handler

### Phase 4 — Code Quality (pending)
- Standardize import ordering
- Full type hints on repositories
- `select` param on `fetch_all`
- Pydantic response models + `response_model=`

### Phase 5 — Database (pending)
- Audit/add indexes
- Document cascade-delete dependency
- Soft-delete consideration

### Phase 6 — Observability & CI (pending)
- JSON structured logging
- CI lint + typecheck
- Log rotation / stdout capture

## Skill Commands

| Command | Description |
|---------|-------------|
| `analyze` | Scan backend for consistency issues against conventions |
| `fix-patient-schema` | Fix missing imports in schemas/patient.py |
| `standardize-responses` | Normalize all services to return `response.data` in `ok()` envelope |
| `add-error-codes` | Add Postgres error code handling to `handle_service_errors` |
| `add-caching` | Add TTLCache to read-heavy endpoints |
| `add-rate-limiting` | Add slowapi rate limiting to auth/login |
| `add-security-headers` | Add security headers middleware to main.py |
| `add-type-hints` | Add type hints to repository methods |
| `add-lint-ci` | Add lint + typecheck to GitHub Actions workflow |
| `bump-version` | Bump version per versioning plan |
