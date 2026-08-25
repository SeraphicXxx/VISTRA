"""
TODO: Implement staff management functions using Supabase Admin API.
staff_update()
"""
from app.database.database_client import supabase_admin, supabase
from app.schemas.staff import StaffData
from app.utils.email_utils import add_ucc_domain, remove_ucc_domain


def create_staff(request):
    staff_id = remove_ucc_domain(request.staff_id)
    staff_auth_email = add_ucc_domain(request.staff_id)
    try:

        auth_response = supabase_admin.auth.admin.create_user({
            "email": staff_auth_email,
            "password": request.password,
            "email_confirm": True,
            "app_metadata": {
                "role": "staff"
            }
        })

        staff_data = StaffData(
            id=auth_user_id,
            staff_id=staff_id,
            **request.model_dump(exclude={"staff_id", "password"})
        )

        db_response = insert_staff_into_db(staff_data)

        if db_response["success"]:
            return {
                "success": True,
                "user": staff_data.model_dump()
            }

        delete_response = delete_staff(auth_response.user.id)

        if delete_response["success"]:
            return {
                "success": False,
                "message": db_response["message"]
            }

        return {
            "success": False,
            "message": (
                "Failed to insert staff into database and failed to delete "
                f"user from auth: {delete_response['message']}"
            )
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
def insert_staff_into_db(staff_data : StaffData):
    try:
        response = (supabase.table("STAFF")
                    .insert(staff_data.model_dump())
                    .execute())
        return {
            "success": True,
            "data": response.data
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
def delete_staff(staff_id: str):
    try:
        response = supabase_admin.auth.admin.delete_user(staff_id)

        return {
            "success": True,
            "data": response
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
def get_staff_by_id(staff_id: str):
    try:
        response = (
            supabase
            .table("STAFF")
            .select("*")
            .eq("staff_id", staff_id)
            .execute()
        )

        print("staff_id:", repr(staff_id))
        print("response.data:", response.data)

        if response.data:
            return {
                "success": True,
                "data": response.data[0]
            }

        return {
            "success": False,
            "message": f"Staff not found for {staff_id}"
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }
