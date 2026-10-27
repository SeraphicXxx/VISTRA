from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import require_staff
from app.schemas.staff import CreateStaffRequest, UpdateStaffAccessRequest
from app.services.access import require_module
from app.services.staff import get_all_staff
from app.services.staff import get_staff_by_id
from app.services.staff import create_staff as create_staff_service
from app.services.staff import delete_staff as delete_staff_service
from app.services.staff import update_staff_access as update_staff_access_service
from app.database.database_client import get_supabase_for_user

protected_staff_router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
    dependencies=[Depends(require_staff)]
)

@protected_staff_router.get("/", dependencies=[Depends(require_module("staff"))])
def list_staff(supabase: Client = Depends(get_supabase_for_user)):
    return get_all_staff(supabase)

@protected_staff_router.post("/", dependencies=[Depends(require_module("staff"))])
def create_staff(request: CreateStaffRequest, supabase: Client = Depends(get_supabase_for_user)):
    return create_staff_service(request, supabase)

@protected_staff_router.get("/{staff_id}/")
def get_staff(staff_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return get_staff_by_id(staff_id, supabase)

@protected_staff_router.delete("/{staff_id}/", dependencies=[Depends(require_module("staff"))])
def delete_staff(staff_id: str, supabase: Client = Depends(get_supabase_for_user)):
    return delete_staff_service(staff_id, supabase)

@protected_staff_router.patch("/{staff_id}/access", dependencies=[Depends(require_module("staff"))])
def update_staff_access(
    staff_id: str,
    request: UpdateStaffAccessRequest,
    supabase: Client = Depends(get_supabase_for_user),
):
    return update_staff_access_service(staff_id, request, supabase)
