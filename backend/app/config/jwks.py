import logging
import threading

import jwt
from jwt import PyJWKClient

from app.config.settings import Config

logger = logging.getLogger(__name__)

# Local JWT verification via Supabase JWKS. Removes the Auth-API
# roundtrip (~0.2-1s + stall risk) from every request: the access
# token already carries sub/email/app_metadata. Keys rotate rarely;
# PyJWKClient caches them for JWKS_TTL_SECONDS and refetches once
# on an unknown kid before giving up.
JWKS_TTL_SECONDS = 10 * 60
_EXPECTED_AUDIENCE = "authenticated"
_CLOCK_SKEW_LEEWAY_SECONDS = 30

_client_lock = threading.Lock()
_jwks_client: PyJWKClient | None = None
_jwks_url: str | None = None


class JWKSUnavailable(Exception):
    """Key set unreachable (network/timeout) — caller should fall back
    to remote validation, not fail the request."""


class TokenRejected(Exception):
    """Signature invalid, expired, wrong audience/issuer, or malformed.
    Fail closed: no remote fallback (a forged token must not get a
    second opinion)."""


def _get_client() -> PyJWKClient:
    global _jwks_client, _jwks_url

    url = f"{Config.supabase_url().rstrip('/')}/auth/v1/.well-known/jwks.json"

    with _client_lock:
        if _jwks_client is None or _jwks_url != url:
            _jwks_client = PyJWKClient(
                url,
                cache_keys=True,
                lifespan=JWKS_TTL_SECONDS,
                timeout=5.0,
            )
            _jwks_url = url

        return _jwks_client


def verify_access_token(access_token: str) -> dict:
    """Verify signature + exp/aud/iss locally. Returns JWT claims.

    Raises TokenRejected (fail closed) or JWKSUnavailable (caller
    falls back to supabase.auth.get_user).
    """
    if not access_token or not isinstance(access_token, str):
        raise TokenRejected("Missing access token")

    try:
        signing_key = _get_client().get_signing_key_from_jwt(access_token)
    except jwt.PyJWKClientError as e:
        logger.warning("JWKS fetch failed, falling back to remote validation: %s", e)
        raise JWKSUnavailable(str(e))
    except jwt.InvalidTokenError:
        # Not even shaped like a JWT (wrong segment count etc.).
        raise TokenRejected("Malformed token")

    issuer = f"{Config.supabase_url().rstrip('/')}/auth/v1"

    try:
        return jwt.decode(
            access_token,
            signing_key.key,
            algorithms=["ES256"],
            audience=_EXPECTED_AUDIENCE,
            issuer=issuer,
            leeway=_CLOCK_SKEW_LEEWAY_SECONDS,
            options={"require": ["exp", "sub"]},
        )
    except jwt.ExpiredSignatureError:
        raise TokenRejected("Token expired")
    except jwt.InvalidTokenError as e:
        raise TokenRejected(f"Token rejected: {e}")
