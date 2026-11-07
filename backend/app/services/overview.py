from supabase import Client
from cachetools import TTLCache

from app.repositories.overview_repositories import OverviewRepository
from app.utils.service_helpers import handle_service_errors, ok, or_404

# Cache for read-heavy, low-churn overview stats (60s TTL, max 128 entries).
_overview_cache: TTLCache = TTLCache(maxsize=128, ttl=60)


@handle_service_errors
def get_overview_stats(supabase: Client):
    cache_key = "overview_stats"
    cached = _overview_cache.get(cache_key)
    if cached is not None:
        return ok(cached)

    overview_repo = OverviewRepository(supabase)
    response = overview_repo.get_overview_stats()
    result = ok(or_404(response, "Overview stats not available"))

    _overview_cache[cache_key] = result["data"]
    return result
