from functools import wraps

from fastapi import HTTPException, status


def or_404(value, detail: str):
    if value:
        return value
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=detail,
    )


def handle_service_errors(fn):
    """Raise-contract: re-raise HTTPException, wrap other errors as 500."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(e),
            )

    return wrapper


def handle_service_returns(fn):
    """Return-contract: unexpected errors become {"success": False, ...}.

    Use ONLY for internal helpers whose callers consume the dict
    (e.g. insert_*_into_db results checked by create sagas).
    Route-facing services must raise via handle_service_errors.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
            }

    return wrapper
