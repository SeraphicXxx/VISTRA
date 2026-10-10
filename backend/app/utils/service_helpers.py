from collections.abc import Callable
from functools import wraps
import logging
from typing import ParamSpec, TypeVar

from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

P = ParamSpec("P")
R = TypeVar("R")
T = TypeVar("T")

_UNSET = object()


def ok(data=_UNSET, message=None, **extra):
    """Success envelope: {"success": True, ...}.

    Pass data positionally for {"success": True, "data": ...},
    message= for {"success": True, "message": ...}, and anything
    else (e.g. medical_visit_id=) as keywords.
    """
    result = {"success": True}

    if data is not _UNSET:
        result["data"] = data

    if message is not None:
        result["message"] = message

    result.update(extra)

    return result


def or_404(value: T, detail: str) -> T:
    if (
        value is None
        or value is False
        or (isinstance(value, (list, dict, set)) and len(value) == 0)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail,
        )

    return value


def handle_service_errors(fn: Callable[P, R]) -> Callable[P, R]:
    """Raise-contract: re-raise HTTPException, wrap other errors."""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except HTTPException:
            raise
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=str(e),
            )
        except Exception as e:
            logger.exception("Unhandled error in %s: %s", fn.__name__, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    return wrapper


def handle_service_returns(fn: Callable[P, R]) -> Callable[P, R]:
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
            logger.exception("Unhandled error in %s: %s", fn.__name__, e)
            return {
                "success": False,
                "message": "Internal operation failed",
            }

    return wrapper
