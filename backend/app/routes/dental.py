from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.services.dental import create_dental_record
from app.schemas.dental import DentalCreateRequest

protected_dental_router = APIRouter(
    prefix="/dental",
    tags=["dental"],
    dependencies=[Depends(get_current_user())]
)

@protected_dental_router.post("/")
def create(request: DentalCreateRequest, supabase: Client = Depends(get_supabase_for_user)):
    return create_dental_record(request, supabase)