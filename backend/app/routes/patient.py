from fastapi import APIRouter
from app.schemas.patient import CreatePatientRequest
from app.services.patient import get_all_patients, create_patient, get_patient_by_id
#TODO: add depends
patients_router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

@patients_router.get("/")
def get_patients():
    return get_all_patients()

@patients_router.post("/")
def create(request: CreatePatientRequest):
    return create_patient(request)

@patients_router.get("/{patient_id}")
def get_patient(patient_id: str):
    return get_patient_by_id(patient_id)