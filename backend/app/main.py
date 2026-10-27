from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import Config
from app.routes import health, auth, staff, patient, appointment, dental, medical, overview, internal, attachments

app = FastAPI(
    title="VISTRA API",
    version="4.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[Config.frontend_url()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API versioning: every router is served twice during the
# transition period — unversioned (legacy, deprecated) and
# under API_V1_PREFIX (current). New clients must use the
# versioned paths. Removing the legacy mounts is a MAJOR bump.
API_V1_PREFIX = "/api/v1"

app.include_router(health.health_router, prefix="/api")
app.include_router(health.health_router, prefix=API_V1_PREFIX)
app.include_router(auth.auth_router, deprecated=True)
app.include_router(auth.auth_router, prefix=API_V1_PREFIX)
app.include_router(staff.protected_staff_router, deprecated=True)
app.include_router(staff.protected_staff_router, prefix=API_V1_PREFIX)
app.include_router(patient.protected_patient_router, deprecated=True)
app.include_router(patient.protected_patient_router, prefix=API_V1_PREFIX)
app.include_router(appointment.protected_appointment_router, deprecated=True)
app.include_router(appointment.protected_appointment_router, prefix=API_V1_PREFIX)
app.include_router(dental.protected_dental_router, deprecated=True)
app.include_router(dental.protected_dental_router, prefix=API_V1_PREFIX)
app.include_router(medical.protected_medical_router, deprecated=True)
app.include_router(medical.protected_medical_router, prefix=API_V1_PREFIX)
app.include_router(overview.protected_overview_router, deprecated=True)
app.include_router(overview.protected_overview_router, prefix=API_V1_PREFIX)
app.include_router(attachments.protected_attachment_router, prefix=API_V1_PREFIX)
# New machine-trigger endpoints are v1-only: the legacy mount is
# deprecated from birth and gains no new surface.
app.include_router(internal.internal_router, prefix=API_V1_PREFIX)