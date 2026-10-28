from app.clients.ml_client import MLServiceClient
from app.schemas.screening import ScreeningPredictRequest
from app.utils.screening_utils import map_age_to_bracket
from app.utils.service_helpers import handle_service_errors

ml_client = MLServiceClient()

def prepare_ml_payload(request: ScreeningPredictRequest) -> dict:

    bracket = map_age_to_bracket(request.age)

    if isinstance(request.sex, str) : 
        sex_binary = 1 if request.sex.lower().startswith("m") else 0
    else:
        sex_binary = 1 if request.sex == 1 else 0

    return {
        "bmi" : float(request.bmi),
        "age" : bracket,
        "sex" : sex_binary
    }

@handle_service_errors
def get_kiosk_screening_prediction(request: ScreeningPredictRequest):

    payload = prepare_ml_payload(request)

    result = ml_client.predict(payload)

    return {
        "success" : True,
        "data" : result
    }