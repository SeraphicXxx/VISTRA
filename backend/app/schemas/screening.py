from pydantic import BaseModel, Field

class ScreeningPredictRequest(BaseModel):
    bmi : float = Field(..., ge = 10.0, le=100.0, description="Calculated Bmi", example = 23.4)
    age : int = Field(..., ge=1, le=120, description="Age in years")
    sex : str | int  = Field(..., description="Male/Female or 1/0", example="Male")


class ConditionResult(BaseModel):
    risk_probability : float
    triage_flag : str


class ScreeningResult(BaseModel):
    hypertension: ConditionResult
    type_2_diabetes: ConditionResult


class ScreeningPredictionResponse(BaseModel):
    status : str
    inputs_received: dict
    screening_results : ScreeningResult