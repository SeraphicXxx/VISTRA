from fastapi import APIRouter

from app.schemas.response_dto.responses import SuccessResponse

health_router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@health_router.get("/", response_model=SuccessResponse)
def health_check():
    return {
        "success": True,
        "message": "API is running"
    }