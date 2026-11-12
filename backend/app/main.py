from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging

from app.config.settings import Config
from app.config.jwks import _get_client
from app.routes.auth import limiter as auth_limiter
from app.routes import health, auth, staff, patient, appointment, dental, medical, overview, internal, screening, attachments, vital_signs, document_ocr, email, profile_picture

app = FastAPI(
    title="VISTRA API",
    version="5.1.0"
)

# Register slowapi rate limiter for auth endpoints.
app.state.limiter = auth_limiter


@app.exception_handler(429)
async def rate_limit_exceeded_handler(request: Request, exc):
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={"success": False, "detail": "Rate limit exceeded. Try again later."},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[Config.frontend_url()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request latency + structured logging + security headers middleware.
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = round((time.time() - start) * 1000, 2)
    access_logger = logging.getLogger("vistra.access")
    access_logger.info(
        "method=%s path=%s status=%s duration_ms=%s",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    response.headers["X-Response-Time"] = f"{duration_ms}ms"
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    if Config.IS_PROD:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# Prewarm JWKS client at startup so the first request doesn't pay
# the key-fetch latency (~0.2-1s).
@app.on_event("startup")
def _prewarm_jwks():
    startup_logger = logging.getLogger("vistra.startup")
    startup_logger.info("Prewarming JWKS client...")
    _get_client()
    startup_logger.info("JWKS client ready.")


# API versioning: all client-facing routers are mounted only under
# API_V1_PREFIX. Legacy unversioned mounts were removed in v5.0.0
# (major bump per backend/versioning plan).
# Health is special: /api/health is a permanent probe + /api/v1/health.
API_V1_PREFIX = "/api/v1"

app.include_router(health.health_router, prefix="/api")
app.include_router(health.health_router, prefix=API_V1_PREFIX)
app.include_router(auth.auth_router, prefix=API_V1_PREFIX)
app.include_router(staff.protected_staff_router, prefix=API_V1_PREFIX)
app.include_router(patient.protected_patient_router, prefix=API_V1_PREFIX)
app.include_router(appointment.protected_appointment_router, prefix=API_V1_PREFIX)
app.include_router(dental.protected_dental_router, prefix=API_V1_PREFIX)
app.include_router(medical.protected_medical_router, prefix=API_V1_PREFIX)
app.include_router(overview.protected_overview_router, prefix=API_V1_PREFIX)
# New machine-trigger endpoints are v1-only.
app.include_router(internal.internal_router, prefix=API_V1_PREFIX)
app.include_router(screening.screening_router, prefix=API_V1_PREFIX)
app.include_router(attachments.patient_attachment_router, prefix=API_V1_PREFIX)
app.include_router(attachments.protected_attachment_router, prefix=API_V1_PREFIX)
app.include_router(vital_signs.vital_signs_router, prefix=API_V1_PREFIX)
app.include_router(document_ocr.document_ocr_router, prefix=API_V1_PREFIX)
app.include_router(email.email_router, prefix=API_V1_PREFIX)
app.include_router(profile_picture.profile_picture_router, prefix=API_V1_PREFIX)
