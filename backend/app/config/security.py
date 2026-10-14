import logging

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.database.database_client import security, supabase
from app.schemas.user import CurrentUser, PATIENT_ROLES, STAFF_ROLE, Role

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

    # Legacy free-text roles predate the canonical set: coerce them
    # to None (authenticated but unauthorized) instead of letting
    # Pydantic raise a 500 on the Literal. require_* gates then 403.
    if role != STAFF_ROLE and role not in PATIENT_ROLES:
        role = None

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


def require_role(*allowed: Role):
    """Dependency factory enforcing canonical backend roles.

    Authentication (valid token) is checked first via get_current_user;
    this adds authorization: 403 when the JWT role is missing or not
    in `allowed`.

    Authorization inputs are role + ownership (see services/access.py)
    ONLY. `on_duty` / `STAFF.is_active` are presence signals for UI
    display and must never appear in a require_* or scope path.
    """

    def check_role(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this resource",
            )

        return current_user

    return check_role


# Shorthand for the most common case: staff-only endpoints.
# Usage: `current_user: CurrentUser = Depends(require_staff)`.
require_staff = require_role("staff")

# Any non-staff system user (student/professor/faculty).
# Usage: `current_user: CurrentUser = Depends(require_patient)`.
require_patient = require_role("student", "professor", "faculty")
