from app.repositories.base import BaseRepository


class OverviewRepository(BaseRepository):
    def get_overview_stats(self):
        return self.fetch_one("clinic_overview_stats")
