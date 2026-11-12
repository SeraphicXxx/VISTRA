from typing import Generic, TypeVar, Any

from pydantic import BaseModel, computed_field

from app.schemas.patient import PatientRecord

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int

    @computed_field
    def total_pages(self) -> int:
        if self.page_size <= 0:
            return 0

        return (self.total + self.page_size - 1) // self.page_size


class Response(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str | None = None


class SuccessResponse(BaseModel):
    """Simple success envelope: {"success": True, "message": ...}."""
    success: bool = True
    message: str | None = None


class DataResponse(BaseModel, Generic[T]):
    """Data envelope: {"success": True, "data": ..., "message": ...}."""
    success: bool = True
    data: T | None = None
    message: str | None = None


class SummaryRecord(BaseModel):
    patient_id: str
    patient_name: str
    course: str | None
    department: str | None
    school_year: str | None
    appointment: list[PatientRecord]
    medical: list[PatientRecord]
    dental: list[PatientRecord]


# --- Auth responses ---

class LoginResponse(BaseModel):
    success: bool = True
    user: dict[str, Any]
    access_token: str
    refresh_token: str


class RefreshResponse(BaseModel):
    success: bool = True
    access_token: str
    refresh_token: str


class LogoutResponse(BaseModel):
    success: bool = True
    message: str | None = None


# --- Staff responses ---

class StaffPermissions(BaseModel):
    staff_id: str
    dental_module: bool = False
    medical_module: bool = False
    appointment_module: bool = False
    patient_module: bool = False
    staff_module: bool = False


class StaffRecord(BaseModel):
    id: str
    staff_id: str
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    role: str | None = None
    is_active: bool = False
    permissions: StaffPermissions | None = None


# --- Patient responses ---

class PatientRecordResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: str | None = None


# --- Appointment responses ---

class AppointmentRecord(BaseModel):
    id: int
    patient_id: str
    scheduled_start: str
    scheduled_end: str | None = None
    status: str
    reason: str | None = None
    location: str | None = None
    staff_id: str | None = None
    notes: str | None = None
    decline_reason: str | None = None
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    course: str | None = None


# --- Dental responses ---

class DentalVisitRecord(BaseModel):
    id: int
    patient_id: str
    patient_name: str | None = None
    course: str | None = None
    visit_date: str
    staff_id: str | None = None
    status: str
    calculus: str | None = None
    medication: str | None = None
    notes: str | None = None
    dentist: str | None = None


# --- Medical responses ---

class MedicalVisitRecord(BaseModel):
    id: int
    patient_id: str
    patient_name: str | None = None
    course: str | None = None
    visit_date: str
    staff_id: str | None = None
    status: str
    type: str | None = None
    complaint: str | None = None
    treatment: str | None = None
    treatment_type: str | None = None
    doctor: str | None = None


# --- Vital Signs responses ---

class VitalSignsRecord(BaseModel):
    id: int
    patient_id: str
    height: float | None = None
    weight: float | None = None
    temperature: float | None = None
    heart_rate: int | None = None
    spo2: float | None = None
    recorded_at: str


# --- Overview responses ---

class OverviewStatsResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: str | None = None


# --- Email responses ---

class EmailSendResponse(BaseModel):
    success: bool = True
    message: str | None = None
    to: str | None = None


# --- Delete / Create responses ---

class DeleteResponse(BaseModel):
    success: bool = True
    message: str | None = None


class CreateResponse(BaseModel):
    success: bool = True
    message: str | None = None
    data: Any = None