import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.database.database_client import security, supabase
from app.schemas.user import CurrentUser

logger = logging.getLogger(__name__)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> CurrentUser:
    access_token = credentials.credentials

    try:
        response = supabase.auth.get_user(access_token)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Token validation failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    if not response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
        )

    user = response.user
    app_metadata = getattr(user, "app_metadata", None) or {}
    role = (
        app_metadata.get("role")
        if isinstance(app_metadata, dict)
        else getattr(app_metadata, "role", None)
    )

    return CurrentUser(
        id=user.id,
        email=user.email,
        role=role,
    )


def require_user_email(current_user: CurrentUser) -> str:
    if not current_user.email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user has no email",
        )

    return current_user.email
