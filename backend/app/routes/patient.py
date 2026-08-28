from fastapi import APIRouter

from app.services.patient import get_all_patients

get_all_patients_router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

@get_all_patients_router.get("/")
def get_patients():
    return get_all_patients()