from app.repositories.base import BaseRepository
from app.utils.supabase_query_builder import SupabaseQueryBuilder


class PatientRepository(BaseRepository):

    def get_by_id(self, patient_id: str):
        return self.fetch_one(
            "PATIENT",
            filters={"patient_id": patient_id},
        )

    def get_all(self):
        return self.fetch_all("PATIENT")

    def create(self, patient_data):
        return (
            self.supabase
            .table("PATIENT")
            .insert(patient_data.model_dump(mode="json"))
            .execute()
        )

    def create_profile(self, patient_profile):
        return (
            self.supabase
            .table("PATIENT_PROFILE")
            .insert(patient_profile.model_dump(mode="json"))
            .execute()
        )

    def get_profiles(self, filters):
        query = (
            SupabaseQueryBuilder(
                self.supabase,
                "PATIENT_PROFILE",
                count="exact",
            )
            .eq("sex", filters.sex)
            .eq("status", filters.status)
            .eq("course_department", filters.course)
            .eq("year_section", filters.year_section)
            .eq("person_type", filters.user_type)
        )

        if filters.search:
            query = query.or_(
                f"first_name.ilike.%{filters.search}%,last_name.ilike.%{filters.search}%,"
                f"patient_id.ilike.%{filters.search}%"
            )

        return self.fetch_page(query, filters.page, filters.page_size)

    def get_summary_records(self, patient_id):
        return (
            self.supabase
            .table("patient_summary")
            .select("*")
            .eq("patient_id", patient_id)
            .single()
            .execute()
        )

    def delete_patient_cascade(self, patient_id: str):
        # Atomic: profile + patient deleted in one transaction.
        # Requires migration 20261010120000_cascade_deletes.
        self.supabase.rpc(
            "delete_patient_records",
            {"p_patient_id": patient_id},
        ).execute()
