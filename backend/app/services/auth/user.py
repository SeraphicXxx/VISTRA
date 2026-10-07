from app.database.database_client import supabase_admin
from app.utils.email_utils import add_ucc_domain
from fastapi import HTTPException, status

def create_auth_user(
    user_id: str,
    password: str,
    role: str
):
    auth_email = add_ucc_domain(user_id)

    if supabase_admin is None:
        return {
            "success": False,
            "message": "Auth admin is not configured (missing SUPABASE_PRIVILEGE_KEY)"
        }

    try:
        auth_response = supabase_admin.auth.admin.create_user({
            "email": auth_email,
            "password": password,
            "email_confirm": True,
            "app_metadata": {
                "role": role
            }
        })

        return {
            "success": True,
            "user": auth_response.user
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

def delete_auth_user(user_id: str):
    if supabase_admin is None:
        return {
            "success": False,
            "message": "Auth admin is not configured (missing SUPABASE_PRIVILEGE_KEY)"
        }

    try:
        response = supabase_admin.auth.admin.delete_user(user_id)

        return {
            "success": True,
            "data": response
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


def compensate_auth_user(user_id: str, db_message: str, rollback_prefix: str):
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