from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class Patient(BaseModel):
    id: UUID
    patient_id: str
    created_at: datetime
    updated_at: datetime
    created_by: str


class PatientProfile(BaseModel):
    id: int
    patient_id: str
    created_at: datetime
    first_name: str
    middle_name: str | None = None
    last_name: str
    birthday: date
    age: float
    sex: str
    complete_address: str
    barangay: str
    civil_status: str
    course: str | None = None
    contact_no: str | None = None
    school_year: str | None = None


class PatientMedicalHistory(BaseModel):
    id: int
    patient_id: str
    hospitalization_operation: str | None = None
    hospitalization_year: str | None = None
    diagnosis: str | None = None
    allergy_medicine: str | None = None
    allergy_food: str | None = None
    smoking: bool | None = None
    vaping: bool | None = None
    alcohol_intake: bool | None = None
    last_menstrual_period: str | None = "N/A"
    family_planning_method: str | None = None


class PatientVitalSigns(BaseModel):
    id: int
    patient_id: str
    temperature: float | None = None
    blood_pressure: float | None = None
    hearth_rate: float | None = None
    respiratory_rate: float | None = None
    eyes: float | None = None
    recorded_at: date | None = None


class PatientFamilyMedicalHistory(BaseModel):
    id: int
    patient_id: str
    condition: str | None = "NONE"
    other_condition: str | None = "NONE"