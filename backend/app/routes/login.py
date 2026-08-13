from fastapi import APIRouter

from app.schemas.auth import LoginRequest
from app.services.auth import user_login


admin_auth_router = APIRouter(
    prefix="/admin/auth",
    tags=["Admin Authentication"]
)

admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# TODO: Refactor this function to once patient login is done
@admin_auth_router.post("/login")
def login(request: LoginRequest):
    return user_login(request)