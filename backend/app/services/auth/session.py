from app.services.auth.user import get_supabase_admin
from app.utils.service_helpers import ok
import logging

logger = logging.getLogger(__name__)


def logout_user(jwt: str):
    """Revoke the caller's session server-side (global sign-out).

    Idempotent: if Supabase reports the session already gone, logout
    still succeeds — the session is over either way. Deliberately
    touches nothing else: STAFF.is_active is presence state owned
    solely by the 5pm clock-out trigger (see routes/internal.py).
    """
    admin = get_supabase_admin()

    try:
        admin.auth.admin.sign_out(jwt)
    except Exception as e:
        logger.warning("Server-side sign-out failed (session already ended?): %s", e)

    return ok(message="Logged out successfully")
