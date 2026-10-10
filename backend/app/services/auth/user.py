from app.database.database_client import supabase_admin
from app.utils.email_utils import add_ucc_domain
from app.utils.service_helpers import ok
from fastapi import HTTPException, status
from typing import NoReturn
import logging

logger = logging.getLogger(__name__)


def get_supabase_admin():
    if supabase_admin is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service not configured (missing privilege key)",
        )

    return supabase_admin


def create_auth_user(
    user_id: str,
    password: str,
    role: str
):
    auth_email = add_ucc_domain(user_id)
    admin = get_supabase_admin()

    try:
        auth_response = admin.auth.admin.create_user({
            "email": auth_email,
            "password": password,
            "email_confirm": True,
            "app_metadata": {
                "role": role
            }
        })

        return ok(user=auth_response.user)

    except Exception as e:
        logger.exception("Auth admin create_user failed: %s", e)
        return {
            "success": False,
            "message": "Failed to provision auth user"
        }


def delete_auth_user(user_id: str):
    admin = get_supabase_admin()

    try:
        response = admin.auth.admin.delete_user(user_id)

        return ok(data=response)

    except Exception as e:
        logger.exception("Auth admin delete_user failed: %s", e)
        return {
            "success": False,
            "message": "Failed to delete auth user"
        }


def raise_for_auth_failure(auth_response: dict, status_code: int):
    if not auth_response["success"]:
        raise HTTPException(
            status_code=status_code,
            detail=auth_response["message"],
        )


def provision_auth_or_raise(user_id: str, password: str, role: str):
    auth_response = create_auth_user(
        user_id=user_id,
        password=password,
        role=role,
    )
    raise_for_auth_failure(auth_response, status.HTTP_400_BAD_REQUEST)

    return auth_response["user"]


def delete_auth_or_500(label: str, auth_id: str) -> None:
    delete_response = delete_auth_user(auth_id)

    if not delete_response["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                f"{label} deleted from database but failed "
                f"to delete user from auth: {delete_response['message']}"
            )
        )


def compensate_auth_user(user_id: str, db_message: str, rollback_prefix: str) -> NoReturn:
    """Roll back a provisioned auth user, always raising 500.

    Shared by create sagas (patient, staff): on DB failure after auth
    creation, delete the auth user. Raises with the rollback failure
    detail if cleanup fails, otherwise with the original DB message.
    """
    delete_response = delete_auth_user(user_id)

    if not delete_response["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{rollback_prefix}: {delete_response['message']}",
        )

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=db_message,
    )
