from supabase import Client

from app.repositories.overview_repositories import OverviewRepository
from app.utils.service_helpers import handle_service_errors, ok, or_404


@handle_service_errors
def get_overview_stats(supabase: Client):
    overview_repo = OverviewRepository(supabase)
    response = overview_repo.get_overview_stats()

    return ok(or_404(response, "Overview stats not available"))
