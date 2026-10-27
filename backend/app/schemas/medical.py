from datetime import datetime

from pydantic import BaseModel

from app.enums.medical_terms import MedicalVisitType, MedicalVisitStatus, MedicalTreatmentType


EDITABLE_MEDICAL_VISIT_COLUMNS = frozenset({
    "visit_date",
    "status",
    "complaint",
    "treatment",
})


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


class MedicalVisitUpdateRequest(BaseModel):
    visit_date: datetime | None = None
    status: MedicalVisitStatus | None = None
    complaint: str | None = None
    treatment: str | None = None

    def to_visit_update(self) -> dict:
        return {
            key: value
            for key, value in self.model_dump(
                mode="json", exclude_unset=True
            ).items()
            if key in EDITABLE_MEDICAL_VISIT_COLUMNS and value is not None
        }
