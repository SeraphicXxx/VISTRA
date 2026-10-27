from fastapi import HTTPException, status

from app.database.database_client import supabase
from app.schemas.user import STAFF_ROLE
from app.services.auth.user import get_supabase_admin
from app.utils.email_utils import add_ucc_domain, staff_id_format
from app.utils.service_helpers import ok
import logging

logger = logging.getLogger(__name__)


def mark_staff_on_duty(email: str) -> None:
    """Set STAFF.is_active from the login duty choice. Best-effort:
    presence tracking must never fail authentication.

    This is an operational availability flag for UI display (sidebar
    duty dot) — never an authorization input. No require_* gate or
    scope check may read it.

    One-way only: nothing in the login path may set is_active back
    to False. Clearing is owned by the Postgres 5pm cron, with the
    emergency endpoint as manual override.
    """
    try:
        admin = get_supabase_admin()
    except HTTPException:
        # Privilege key unconfigured: presence stays untouched,
        # login proceeds (same as before).
        return

    try:
        admin.table("STAFF").update(
            {"is_active": True}
        ).eq(
            "staff_id", staff_id_format(email)
        ).execute()
    except Exception as e:
        logger.warning("Staff presence update failed: %s", e)


def _resolve_identifier(request) -> str:
    raw = (
        getattr(request, "identifier", None)
        or getattr(request, "email", None)
        or getattr(request, "staff_id", None)
        or getattr(request, "patient_id", None)
    )

    if not raw or not str(raw).strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="identifier, email, staff_id, or patient_id is required",
        )

    return str(raw).strip()


def login_user(request):
    try:
        identifier = _resolve_identifier(request)
        password = request.password

        auth_response = supabase.auth.sign_in_with_password({
            "email": add_ucc_domain(identifier),
            "password": password,
        })

        user = auth_response.user
        session = auth_response.session

        if not user or not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        app_metadata = getattr(user, "app_metadata", None) or {}
        if isinstance(app_metadata, dict):
            role = app_metadata.get("role")
        else:
            role = getattr(app_metadata, "role", None)

        if role == STAFF_ROLE and request.on_duty:
            # Presence write only (see mark_staff_on_duty): staff-role
            # membership (not duty state) is what authorizes requests.
            mark_staff_on_duty(user.email)

        return ok(
            user={
                "id": user.id,
                "user_id": staff_id_format(user.email),
                "email": user.email,
                "role": role,
            },
            access_token=session.access_token,
            refresh_token=session.refresh_token,
        )

    except HTTPException:
        raise

    except Exception as e:
        logger.exception("Login failed: %s", e)

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
