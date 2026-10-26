# VISTRA – Agent Guide

Clinic management system: public landing + staff portal + patient portal + mobile patient app.

Backend: FastAPI + Supabase (no ORM). Web frontend: React 19 + Vite + Tailwind + React Query.
Mobile: Expo SDK 57 + React Native + Expo Router + NativeWind (Tailwind).

## Repo layout
- `backend/app/main.py` – FastAPI entry, version `4.1.0`, registers 9 routers. No factory.
- `backend/app/routes/` – `health.py`, `auth.py`, `staff.py`, `patient.py`, `appointment.py`, `dental.py`, `medical.py`, `overview.py`, `internal.py`
- `backend/app/services/` – business logic (`staff.py`, `patient.py`, `appointment.py`, `dental.py`, `medical.py`, `overview.py`, `access.py`, `auth/staff.py`, `auth/user.py`, `auth/login.py`, `auth/session.py`)
- `backend/app/repositories/` – PostgREST queries (`*_repositories.py`)
- `backend/app/schemas/` – Pydantic validation; `response_dto/reponses.py` (note typo)
- `backend/app/models/` – EMPTY, do not use. Validation lives in schemas.
- `backend/app/config/settings.py`, `security.py` – env + auth
- `backend/app/database/database_client.py` – global `supabase`, per-request `get_supabase_for_user`, `supabase_admin`
- `backend/app/enums/`, `backend/app/utils/` – `email_utils.py`, `supabase_query_builder.py`, `validator/common.py`
- `backend/tests/` – manual debug scripts only, require live creds. No pytest.
- `frontend/` – React web portal (staff + patient). `src/api/axios_client.ts` (active), `src/config/ApiConfig.ts`, `src/config/RoutePaths.ts`.
- `vistra-mobile/` – Expo mobile patient app at repo root. `src/app/` (Expo Router), `src/components/`, `src/constants/`, `src/hooks/`, `src/mock/`, `src/styles/`, `src/utils/`. Currently mock-data only; no API client yet.
- `postman/postman/collections/VISTRA API Tests/` – automated API tests (Postman). `Auth/` + `Staff/` have requests with `pm.test()` assertions; `Appointments/`, `Dental/`, `Medical/`, `Patients/` are placeholder folders. Env: `postman/postman/environments/VISTRA local-1.environment.yaml` (`base_url`, `user_id`, `access_token`, `refresh_token`). Spec mirror: `postman/postman/specs/VISTRA_API_TESTS/VISTRA_API_TESTS.yaml`.
- `docs/README.md` – Vite template + run instructions only.

## Run
Backend (`backend/`):
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000, docs at /docs
```
Web frontend (`frontend/`):
```bash
npm install
npm run dev   # vite, default http://localhost:5173
npm run build # vite build
npm run lint  # eslint . (only .js/.jsx covered)
```
Mobile (`vistra-mobile/`):
```bash
npm install        # or bun install
npx expo start     # dev server
npx tsc --noEmit   # typecheck
npx expo lint      # lint
npx expo-doctor    # diagnose dependency/config issues
```

## Env (never commit values)
Backend `backend/.env`: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_PRIVILEGE_KEY`, `LOCAL_FRONTEND_URL`, `PROD_FRONTEND_URL`, `IS_PROD=false`. Self-hosted testing: `SELFHOSTED_SUPABASE_URL`, `SELFHOSTED_SUPABASE_KEY`, toggle with `USE_SELFHOSTED_SUPABASE=true` (default `false` = cloud). Active backend resolves via `Config.supabase_url()/supabase_key()` (`config/settings.py`), validated per mode.
Frontend `frontend/.env`: `VITE_LOCAL_API_URL` (`http://127.0.0.1:8000`), `VITE_PROD_API_URL`, `VITE_IS_PROD=false`. Code also reads `VITE_SKIP_AUTH` (currently missing).
Mobile `vistra-mobile/`: no `.env` yet. Use `EXPO_PUBLIC_API_URL` (Expo injects `EXPO_PUBLIC_*` vars into `process.env`). Must match running backend port (`http://127.0.0.1:8000` for local). Add `EXPO_PUBLIC_IS_PROD=false` if needed.

## Backend conventions
- Add endpoint: router in `routes/<domain>.py` (prefix e.g. `/patients`, `Depends(get_current_user)` if protected) → function in `services/<domain>.py` → query in `repositories/<domain>_repositories.py`. Reuse `PaginatedResponse` / `Response` from `schemas/response_dto/reponses.py`.
- DB: Supabase only. Use `get_supabase_for_user` dependency for RLS; `supabase_admin` only via `get_supabase_admin()` for the allowlisted trusted ops (auth provisioning/deletion, session revocation, presence writes — see `services/auth/user.py` header). Tables are UPPERCASE: `PATIENT`, `PATIENT_PROFILE`, `STAFF`, `APPOINTMENT`, `DENTAL_VISIT`, `ODONTOGRAM`, view `patient_summary`.
- Auth: Supabase Auth. Staff email convention `@ucc.com` via `utils/email_utils.py` (`add_ucc_domain`, `staff_id_format`). `security.py:get_current_user` verifies the JWT locally via Supabase JWKS (`config/jwks.py`, 0.4ms), falling back to `supabase.auth.get_user()` only when keys are unreachable. Roles in `app_metadata.role`.
- Follow `backend/versioning plan` for version bumps: breaking=X.0.0, feature=0.X.0, fix=0.0.X. Routes are dual-mounted in `main.py`: legacy unversioned (deprecated) + `/api/v1` (`API_V1_PREFIX`); new clients must use v1. Health is special: `/api/health` (permanent probe) + `/api/v1/health`.
- Known bug: `schemas/patient.py` references `confirm_birthday`/`confirm_age` but does not import them – fix import from `utils/validator/common.py` before touching patient validation.

## Mobile conventions (vistra-mobile)
- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Use `npx expo install <package>` (never bare npm/yarn/pnpm/bun add) — resolves SDK-compatible versions.
- Run `npx expo lint` and `npx tsc --noEmit` before declaring any task done.
- `ios/` and `android/` do not exist (Continuous Native Generation). Configure native behavior in `app.json` and config plugins only — never create/edit them by hand.
- Expo Go only includes bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Imports use `@/*` alias → `./src/*` (defined in `tsconfig.json`).
- Styling: NativeWind + Tailwind-first (`tailwind.config.js` tokens: `primary #14b8a6`). Mixed `.jsx/.tsx` allowed; keep new code `.tsx`/`.ts`.
- Data: currently `src/mock/` stubs. No Supabase/axios API client yet — see "Reusing the web API client in mobile" below.

## Frontend conventions (web)
- Imports use alias `/@/`: `import X from "/@/config/RoutePaths"`. Defined in `frontend/vite.config.js` + `tsconfig.json`.
- API: use `api/axios_client.ts:apiClient<T>()`, endpoints from `config/ApiConfig.ts:API_ENDPOINTS`. Do not use `api/client.ts` or direct `supabase-js` (orphaned dep).
- Server state: React Query hooks in `hooks/` (`usePatientQuery`, `AppointmentQuery`, `DentalQuery`, `UseLogin`). Pagination via `context/CreatePaginatedContext.tsx`. Forms via `react-hook-form + zod` (`api/schema/*`). View mappers in `repository/*Model.ts`.
- Routing: edit `config/RoutePaths.ts` + `routes/AppRoutes.tsx` together. Guards: `routes/ProtectedRoute.jsx` (staff, active), `components/ProtectedPatientRoute.jsx` (currently `skipAuth=true` debug bypass – do not ship; real check + `/patient/login` route still missing).
- Styling: Tailwind-first (`tailwind.config.js` tokens: `primary #14b8a6`, `background #f8fafc`). `index.css` is 3 lines; `App.css` is dead. MUI/Emotion installed but prefer Tailwind.

## Reusing the web API client in mobile (vistra-mobile)
**Yes**, the web `api/axios_client.ts` pattern can be reused in `vistra-mobile`, but not copied verbatim — axios works in React Native, but the web file imports Vite- and DOM-specific code that does not exist in Expo:

| Web dependency | Why it breaks in Expo | Mobile replacement |
|---|---|---|
| `import.meta.env.VITE_*` (Vite) | Not defined in Expo | `process.env.EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_IS_PROD` |
| `sessionManager` (localStorage + `syncBus`) | No `localStorage` in RN; `syncBus` is DOM `BroadcastChannel` | `expo-secure-store` (or `AsyncStorage`) token store |
| `api/schema/FastApiValidationResponse` + `api/errors` | Web-only files | Redefine the two small error classes inline in mobile |

**Minimal-change approach:** create `vistra-mobile/src/api/axios_client.ts` mirroring the web file, swapping only:
1. Config: read `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_IS_PROD` via `process.env` (baseURL).
2. Token store: a tiny mobile store backed by `expo-secure-store` exposing `getAccessToken()`, `getRefreshToken()`, `setTokens()`, `clear()`.
3. Errors: define `FastAPIValidationError` / `FastAPIConflictError` inline (copy the two small classes).
4. Keep the same `apiClient<T>()` wrapper, request interceptor (Bearer header), and response interceptor (401 → refresh-token retry, 422 → validation error, 409 → conflict error).

Then `npx expo install expo-secure-store` and add `vistra-mobile/.env` with `EXPO_PUBLIC_API_URL=http://127.0.0.1:8000`.

## Verification
- Backend: `uvicorn app.main:app --reload`, check `/docs` and `GET /api/health`.
- Automated API tests are Postman, not pytest: open `postman/postman/collections/VISTRA API Tests/` in Postman with env `VISTRA local` (`base_url=http://localhost:8000`), run Collection Runner in order. Coverage (43 requests): `Health` check; `Auth` login (chains `access_token` + `refresh_token`), invalid login, refresh, invalid refresh; `Staff` get-by-id (200 + shape, 401 no token, 404 no ID), create (chains `created_staff_id`), 422, 401, delete + deleted-check; `Patients` create (unique id via `beforeRequest`, chains `patient_id`), 422, 401, duplicate 409, list, profiles, by-id, not-found, summary, delete + deleted-check (runs last); `Appointments` full CRUD chain (captures `appointment_id`, ends with delete + 404 check), 422, 401; `Dental` create (captures `dental_visit_id`), 422, list, by-id, 404, 401, delete + deleted-check; `Medical` list, delete-not-found 404, 401. Create/update/delete tests accumulate real rows in Supabase on each run. When adding/changing endpoints, add/extend requests + `pm.test()` scripts there, not `backend/tests/`.
- Frontend: `npm run dev`, `npm run build` must pass. `npm run lint` only checks JS – also run `npx tsc --noEmit` for TS changes.
- Mobile: `npx expo start`, `npx tsc --noEmit`, `npx expo lint`. `npx expo-doctor` if native modules misbehave.
- Cross-check: backend route prefix must match `API_ENDPOINTS`; mobile `EXPO_PUBLIC_API_URL` and web `VITE_*_API_URL` must match the running backend port.
