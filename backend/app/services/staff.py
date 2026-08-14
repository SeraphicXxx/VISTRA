"""
TODO: Implement staff management functions using Supabase Admin API.
staff_create() / 
staff_get()
staff_update()
staff_delete()
"""
from app.database.DataBaseClient import supabase_admin
from app.utils.email_utils import add_ucc_domain, remove_ucc_domain

def staff_create(request):
    if supabase_admin is None:
        return {
            "success": False,
            "message": "Admin client is not configured."
        }

    staff_id = remove_ucc_domain(request.staff_id)
    staff_auth_email = add_ucc_domain(request.email)
    try:

        auth_response = supabase_admin.auth.admin.create_user({
            "email": staff_auth_email,
            "password": request.password,
            "email_confirm": True,
            "user_metadata": {
                "staff_id": staff_id,
                "first_name": request.first_name,
                "position": request.position,
                "last_name": request.last_name,
                "middle_name": request.middle_name,
                "specialty": request.specialty,
                "phone_number": request.phone_number,
                "email": request.email
            }
        })

        user = auth_response.user

        return {
            "success": True,
            "user": {
                "id": staff_id,
                "email": user.email,
                "metadata": user.user_metadata
            }
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }