from pydantic import BaseModel


class DentalRecord(BaseModel):
    id: int
    patient_id: str
    appointment_id: int
    last_dental_visit: str
    flossing_frequency: str
    brushing_frequency: str
    calculus_severity: str
    current_medication: str
    notes: str


class Odontogram(BaseModel):
    id: int
    patient_id: str
    tooth_number: int
    is_permanent: bool
    condition: str
    notes: str
    dental_record_id: int


class OdontogramCreateRequest(BaseModel):
    patient_id: str
    tooth_number: int
    is_permanent: bool
    condition: str
    notes: str
    dental_record_id: int


class DentalRecordCreateRequest(BaseModel):
    patient_id: str
    appointment_id: int
    last_dental_visit: str
    flossing_frequency: str
    brushing_frequency: str
    calculus_severity: str
    current_medication: str
    notes: str


class DentalCreateRequest(BaseModel):
    patient_id: str
    appointment_id: int
    last_dental_visit: str
    flossing_frequency: str
    brushing_frequency: str
    calculus_severity: str
    current_medication: str
    notes: str
    tooth: list[OdontogramCreateRequest]


