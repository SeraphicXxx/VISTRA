from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.services.overview import get_overview_stats as get_overview_stats_service

protected_overview_router = APIRouter(
    prefix="/overview",
    tags=["Overview"],
    dependencies=[Depends(get_current_user)]
)


@protected_overview_router.get("/stats/")
def get_overview_stats(supabase: Client = Depends(get_supabase_for_user)):
    return get_overview_stats_service(supabase)
