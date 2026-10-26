from typing import Any

from app.repositories.base import BaseRepository
from app.utils.supabase_query_builder import SupabaseQueryBuilder

class PatientRepository(BaseRepository):

    def get_by_id(self, patient_id: str):
        return self.fetch_one(
            "PATIENT",
            filters={"patient_id": patient_id},
        )

    def get_by_auth_id(self, auth_id: str):
        """PATIENT row for an auth uid (PATIENT.id == auth.uid())."""
        return self.fetch_one(
            "PATIENT",
            filters={"id": auth_id},
        )

    def get_all(self):
        return self.fetch_all("PATIENT")

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

    def get_medical_dental_summary(self, patient_id):
        """Combined medical + dental visit history from the
        patient_medical_dental_summary view (security_invoker)."""
        return (
            self.supabase
            .table("patient_medical_dental_summary")
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

    def update_profile(self, patient_id: str, profile_data: dict[str, Any]):
        return self.update_by_column(
            "PATIENT_PROFILE",
            "patient_id",
            patient_id,
            profile_data,
        )
