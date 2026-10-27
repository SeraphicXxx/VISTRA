from app.services.auth.user import get_supabase_admin
from app.utils.service_helpers import ok
import logging

logger = logging.getLogger(__name__)


def logout_user(jwt: str):
    """Revoke the caller's session server-side (this device only).

    Scope is "local": the presented session dies, other devices stay
    signed in. A global kill-everywhere is deliberately NOT the
    default (see module note); reach for scope="global" only for a
    compromise response, as a separate explicit action.

    Idempotent: if Supabase reports the session already gone, logout
    still succeeds — the session is over either way. Deliberately
    touches nothing else: STAFF.is_active is presence state owned
    solely by the 5pm clock-out trigger (see routes/internal.py).
    """
    admin = get_supabase_admin()

    try:
        admin.auth.admin.sign_out(jwt, scope="local")
    except Exception as e:
        logger.warning("Server-side sign-out failed (session already ended?): %s", e)

    return ok(message="Logged out successfully")
