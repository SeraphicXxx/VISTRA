from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.enums.civil_status import CivilStatus
from app.enums.sex import Sex
from app.utils.name_utils import separate_name
from app.utils.validator.common import confirm_mobile_number, confirm_not_blank, confirm_birthday


class Patient(BaseModel):
    id: UUID
    patient_id: str
    created_by: str


class PatientProfile(BaseModel):
    patient_id: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    birthday: date
    age: int
    sex: Sex
    complete_address: str
    barangay: str
    civil_status: CivilStatus
    course: str | None = None
    contact_no: str | None = None
    school_year: str | None = None
    department: str | None = None
    person_type: str | None = None


class CreatePatientRequest(BaseModel):
    patient_id: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)
    created_by: str = Field(..., min_length=1)

    name: str = Field(..., min_length=2, max_length=150)
    address: str = Field(..., min_length=1, max_length=255)
    age: int = Field(..., ge=0, le=150)
    barangay: str = Field(..., min_length=1, max_length=100)
    birthday: date

    mobile_number: str = Field(..., min_length=10, max_length=15)

    sex: Sex
    civil_status: CivilStatus
    classification: str

    course: str | None = None
    school_year: str | None = None
    section: str | None = None
    department: str | None = None
    position: str | None = None

    def to_patient_profile(self) -> PatientProfile:
        name = separate_name(self.name)

        return PatientProfile(
            patient_id=self.patient_id,
            first_name=name.first_name,
            middle_name=name.middle_name,
            last_name=name.last_name,
            birthday=self.birthday,
            age=self.age,
            sex=self.sex,
            complete_address=self.address,
            barangay=self.barangay,
            civil_status=self.civil_status,
            course=self.course,
            contact_no=self.mobile_number,
            school_year=self.school_year,
            department=self.department,
            person_type=self.classification,

        )

    @field_validator("patient_id", "name", "address", "barangay")
    @classmethod
    def validate_not_blank(cls, value: str):
        return confirm_not_blank(value)

    @field_validator("name")
    @classmethod
    def validate_name_format(cls, value: str) -> str:
        separate_name(value)

        return value

    @field_validator("birthday")
    @classmethod
    def validate_birthday(cls, value: date):
        return confirm_birthday(value)

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile(cls, value: str) -> str:
        return confirm_mobile_number(value)

class PatientRecord(BaseModel):
    id: int
    date: str
    title: str
    notes: str | None
    staff_id: str
    provider: str