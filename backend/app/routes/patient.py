from fastapi import APIRouter,Depends

from app.config.security import get_current_user
from app.schemas.patient import CreatePatientRequest
from app.services.patient import get_all_patients, create_patient, get_patient_by_id

protected_patients_router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
    dependencies=[Depends(get_current_user)]
)

@protected_patients_router.get("/")
def get_patients():
    return get_all_patients()

@protected_patients_router.post("/")
def create(request: CreatePatientRequest):
    return create_patient(request)

@protected_patients_router.get("/{patient_id}/")
def get_patient(patient_id: str):
    return get_patient_by_id(patient_id)