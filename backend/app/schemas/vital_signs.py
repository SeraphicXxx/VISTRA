
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VitalSignsBase(BaseModel):
    """Shared vital signs measurement fields."""

    height: float | None = Field(
        default=None,
        gt=0,
        description="Patient height, in centimeters",
    )
    weight: float | None = Field(
        default=None,
        gt=0,
        description="Patient weight, in kilograms",
    )
    temperature: float | None = Field(
        default=None,
        ge=25,
        le=45,
        description="Body temperature, in degrees Celsius",
    )
    heart_rate: int | None = Field(
        default=None,
        ge=0,
        le=300,
        description="Heart rate, in beats per minute",
    )
    spo2: float | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Peripheral oxygen saturation, in percent",
    )


class CreateVitalSignsRequest(VitalSignsBase):
    """Request body for creating a vital signs record."""

    patient_id: str = Field(
        min_length=1,
        description="ID of the patient associated with the record",
    )

    recorded_at: datetime | None = Field(
        default=None,
        description="Recording timestamp; defaults to database time",
    )


class UpdateVitalSignsRequest(VitalSignsBase):
    """Request body for updating an existing vital signs record.

    All fields are optional. Only explicitly supplied fields are updated.
    """

    model_config = ConfigDict(extra="forbid")


class VitalSigns(VitalSignsBase):
    """Complete vital signs record returned by the database."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: str
    recorded_at: datetime
