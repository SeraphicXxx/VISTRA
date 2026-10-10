from datetime import datetime
from pydantic import BaseModel, model_validator


class Appointments(BaseModel):
    id: int
    patient_id: str
    scheduled_start: datetime
    scheduled_end: datetime
    status: str
    reason: str | None = None
    location: str | None = None
    created_at: datetime
    staff_id: str | None = None
    notes: str | None = None
    decline_reason: str | None = None

class CreateAppointmentRequest(BaseModel):
    patient_id: str
    scheduled_start: datetime
    scheduled_end: datetime
    reason: str | None = None
    location: str | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def check_range(self):
        if self.scheduled_end <= self.scheduled_start:
            raise ValueError("scheduled_end must be after scheduled_start")

        return self

class UpdateAppointmentRequest(BaseModel):
    status: str | None = None
    reason: str | None = None
    location: str | None = None
    notes: str | None = None
    decline_reason: str | None = None
