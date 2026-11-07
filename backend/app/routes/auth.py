from fastapi import APIRouter, Depends, Request
from fastapi.security import HTTPAuthorizationCredentials
from slowapi import Limiter
from slowapi.util import get_remote_address

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

# Rate limiter keyed by client IP for auth endpoints.
limiter = Limiter(key_func=get_remote_address)


@auth_router.post("/login/")
@limiter.limit("5/minute")
def login(request: Request, login_request: LoginRequest):
    return login_user(login_request)


@auth_router.post("/refresh/")
def refresh(request: RefreshTokenRequest):
    return auth_refresh_token(request)


@auth_router.post("/logout/")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    _current_user: CurrentUser = Depends(get_current_user),
):
    return logout_user(credentials.credentials)
