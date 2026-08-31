from fastapi import APIRouter, Depends

from app.config.security import get_current_user
from app.schemas.staff import CreateStaffRequest
from app.services.staff import create_staff, get_staff_by_id

protected_staff_router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
    dependencies=[Depends(get_current_user)]
)

@protected_staff_router.post("/")
def create(request: CreateStaffRequest):
    return create_staff(request)

@protected_staff_router.get("/{staff_id}/")
def get_by_id(staff_id):
    return get_staff_by_id(staff_id)
