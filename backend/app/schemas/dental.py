from pydantic import BaseModel


class DentalRecord(BaseModel):
    id: int
    patient_id: str
    staff_id: str
    last_dental_visit: str
    floss: bool
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
    tooth_number: int
    condition: str
    dentition: str
    notes: str


class DentalVisitCreateRequest(BaseModel):
    patient_id: str
    last_dental_visit: str
    brushing_frequency: str
    floss: bool
    calculus_severity: str
    current_medications: str
    notes: str
    status: str

    tooth_records: list[OdontogramCreateRequest]


