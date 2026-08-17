from fastapi import APIRouter
from app.schemas.staff import CreateStaffRequest
from app.services.staff import create_staff
from app.config.security import get_current_user

create_staff_router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
    dependencies=[Depends(get_current_user)]
)

@create_staff_router.post("/")
def create(request: CreateStaffRequest):
    return create_staff(request)