from fastapi import APIRouter, Depends
from app.config.security import get_current_user
from app.schemas.response_dto.responses import DataResponse
from app.schemas.screening import ScreeningPredictRequest
from app.services.screening import get_kiosk_screening_prediction

screening_router = APIRouter(
    prefix="/screening",
    tags=["screening"]
)

@screening_router.post("/predict", dependencies=[Depends(get_current_user)], response_model=DataResponse)
def predict_screening(request: ScreeningPredictRequest):
    return get_kiosk_screening_prediction(request)