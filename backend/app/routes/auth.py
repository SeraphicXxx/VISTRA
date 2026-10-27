from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials

from app.config.security import get_current_user
from app.database.database_client import security
from app.schemas.auth import RefreshTokenRequest, LoginRequest
from app.schemas.user import CurrentUser
from app.services.auth.login import login_user
from app.services.auth.session import logout_user
from app.services.auth.staff import auth_refresh_token


auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@auth_router.post("/login/")
def login(request: LoginRequest):
    return login_user(request)

@auth_router.post("/refresh/")
def refresh(request: RefreshTokenRequest):
    return auth_refresh_token(request)

@auth_router.post("/logout/")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    _current_user: CurrentUser = Depends(get_current_user),
):
    return logout_user(credentials.credentials)
