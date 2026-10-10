from pydantic import BaseModel


DENTITION_PERMANENT = "permanent"


class OdontogramCreateRequest(BaseModel):
    tooth_number: int
    condition: str
    dentition: str
    notes: str

    def to_db_dict(self, patient_id: str, dental_record_id: int) -> dict:
        return {
            "patient_id": patient_id,
            "tooth_number": self.tooth_number,
            "is_permanent": self.dentition == DENTITION_PERMANENT,
            "condition": self.condition,
            "notes": self.notes,
            "dental_record_id": dental_record_id,
        }


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

    def to_db_dict(self, staff_id: str) -> dict:
        return {
            "patient_id": self.patient_id,
            "last_dental_visit": self.last_dental_visit,
            "brushing_frequency": self.brushing_frequency,
            "floss": self.floss,
            "calculus_severity": self.calculus_severity,
            "current_medications": self.current_medications,
            "notes": self.notes,
            "status": self.status,
            "staff_id": staff_id,
        }


