from fastapi import APIRouter

from app.schemas.auth import LoginRequest
from app.services.auth import user_login


router = APIRouter(
    prefix="/admin/auth",
    tags=["admin"]
)


@router.post("/login")
def login(request: LoginRequest):
    return user_login(request)