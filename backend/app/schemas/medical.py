from datetime import datetime

from pydantic import BaseModel

from app.enums.medical_terms import MedicalVisitType, MedicalVisitStatus, MedicalTreatmentType


class MedicalVisitCreateRequest(BaseModel):
    patient_id: str
    status: MedicalVisitStatus
    type: MedicalVisitType
    treatment_type: MedicalTreatmentType
    visit_date: datetime
    complaint: str
    treatment: str

    def to_db_dict(self, staff_id: str) -> dict:
        return {
            "patient_id": self.patient_id,
            "staff_id": staff_id,
            "type": self.type.value,
            "visit_date": self.visit_date.isoformat(),
            "treatment_type": self.treatment_type.value,
            "complaint": self.complaint,
            "treatment": self.treatment,
            "status": self.status.value,
        }

class MedicalVisitTab(BaseModel):
    id: str
    patient_id: str
    patient_name: str
    course: str
    visit_date: datetime
    staff_id: str
    status: MedicalVisitStatus
    type: MedicalVisitType
