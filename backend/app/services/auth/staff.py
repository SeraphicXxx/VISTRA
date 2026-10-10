from fastapi import HTTPException

from app.database.database_client import supabase
import logging

logger = logging.getLogger(__name__)


def auth_refresh_token(request):
    try:
        auth_response = supabase.auth.refresh_session(
            request.refresh_token
        )

        session = auth_response.session

        if not session:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token"
            )

        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token
        }

    except HTTPException:
        raise

    except Exception as e:
        logger.exception("Token refresh failed: %s", e)

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired refresh token"
        )
