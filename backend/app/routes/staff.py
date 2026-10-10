from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.schemas.staff import CreateStaffRequest
from app.services.staff import get_staff_by_id
from app.services.staff import create_staff as create_staff_service
from app.services.staff import delete_staff as delete_staff_service
from app.database.database_client import get_supabase_for_user

protected_staff_router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
    dependencies=[Depends(get_current_user)]
)

@protected_staff_router.post("/")
def create_staff(request: CreateStaffRequest, supabase: Client = Depends(get_supabase_for_user)):
    return create_staff_service(request, supabase)

@protected_staff_router.get("/{staff_id}/")
def get_staff(staff_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return get_staff_by_id(staff_id, supabase)

@protected_staff_router.delete("/{staff_id}/")
def delete_staff(staff_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return delete_staff_service(staff_id, supabase)
