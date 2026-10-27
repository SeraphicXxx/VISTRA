from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class Measurement(BaseModel):
    value: float = Field(..., description="Measured value")
    unit: str = Field(..., description="Unit of measurement")


class VitalMeasurements(BaseModel):
    height: Measurement
    weight: Measurement
    temperature: Measurement
    heartRate: Measurement
    spo2: Measurement


class VistraVitalsSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["VISTRA_VITALS"] = "VISTRA_VITALS"
    version: Literal["1.0"] = "1.0"
    generatedAt: datetime
    measurements: VitalMeasurements