import httpx
from fastapi import HTTPException
from app.config.settings import Config

class MLServiceClient:
    def __init__(self):
        url = Config.ml_service_url() or "http://127.0.0.1:8001"
        self.base_url = url.rstrip("/")
        self.api_key = Config.ml_service_api_key()

    def predict(self, payload: dict) -> dict:
        url = f"{self.base_url}/api/v1/predict"
        headers = {
            "Content-Type": "application/json"
        }
        if self.api_key:
            headers["X-API-KEY"] = self.api_key

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload, headers=headers)
                
                if response.status_code == 403:
                    raise HTTPException(
                        status_code=500,
                        detail="ML Service authentication failed (Invalid or missing API Key)"
                    )
                
                response.raise_for_status()
                return response.json()
        except httpx.ConnectError:
            raise HTTPException(
                status_code=503,
                detail="Vistra_ML service is currently unreachable"
            )
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"ML Service error: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected error communicating with ML service: {str(e)}"
            )
