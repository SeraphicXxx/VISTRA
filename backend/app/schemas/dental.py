from datetime import datetime

from pydantic import BaseModel


DENTITION_PERMANENT = "permanent"

EDITABLE_VISIT_COLUMNS = frozenset({
    "visit_date",
    "last_dental_visit",
    "floss",
    "brushing_frequency",
    "calculus_severity",
    "current_medications",
    "status",
    "notes",
})

EDITABLE_ODONTOGRAM_COLUMNS = frozenset({
    "is_permanent",
    "condition",
    "notes",
})


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


class OdontogramUpdateRequest(BaseModel):
    id: int | None = None
    tooth_number: int | None = None
    is_permanent: bool | None = None
    condition: str | None = None
    notes: str | None = None

    def to_tooth_update(self) -> dict:
        return {
            key: value
            for key, value in self.model_dump(exclude_unset=True).items()
            if key in EDITABLE_ODONTOGRAM_COLUMNS
            and value is not None
        }


class DentalVisitUpdateRequest(BaseModel):
    visit_date: datetime | None = None
    last_dental_visit: str | None = None
    floss: bool | None = None
    brushing_frequency: str | None = None
    calculus_severity: str | None = None
    current_medications: str | None = None
    status: str | None = None
    notes: str | None = None

    tooth_records: list[OdontogramUpdateRequest] | None = None

    def to_visit_update(self) -> dict:
        return {
            key: value
            for key, value in self.model_dump(
                mode="json", exclude_unset=True
            ).items()
            if key in EDITABLE_VISIT_COLUMNS and value is not None
        }


