from typing import Any, Optional

from app.schemas.patient import CreateMedicalhistory, FamilyHistory, PatientResults
from app.schemas.response_dto.responses import PaginatedResponse
from app.repositories.base import BaseRepository
from app.utils.supabase_query_builder import SupabaseQueryBuilder


class PatientRepository(BaseRepository):

    def get_by_id(self, patient_id: str) -> Optional[dict[str, Any]]:
        return self.fetch_one(
            "PATIENT",
            filters={"patient_id": patient_id},
        )

    def get_by_auth_id(self, auth_id: str) -> Optional[dict[str, Any]]:
        """PATIENT row for an auth uid (PATIENT.id == auth.uid())."""
        return self.fetch_one(
            "PATIENT",
            filters={"id": auth_id},
        )

    def get_all(self) -> Optional[list[dict[str, Any]]]:
        return self.fetch_all("PATIENT")

    def get_profiles(self, filters: Any) -> PaginatedResponse:
        # registration_status lives on PATIENT, while the profile fields live on
        # PATIENT_PROFILE. PATIENT_PROFILE.patient_id references PATIENT.patient_id,
        # so we query PATIENT with PATIENT_PROFILE nested (same pattern used by
        # appointment_repositories and list_registrations), filter registration_status
        # on PATIENT, then flatten PATIENT_PROFILE to top level so the response shape
        # stays compatible with the existing PatientProfile consumer.
        query = (
            SupabaseQueryBuilder(
                self.supabase,
                "PATIENT",
                columns="""\
                    *,
                    PATIENT_PROFILE!inner(
                        patient_id,
                        first_name,
                        middle_name,
                        last_name,
                        birthday,
                        age,
                        sex,
                        complete_address,
                        barangay,
                        civil_status,
                        course,
                        contact_no,
                        school_year,
                        department,
                        section,
                        person_type
                    )
                """,
                count="exact",
            )
            .eq("registration_status", filters.status)
            .eq("PATIENT_PROFILE.sex", filters.sex)
            .eq("PATIENT_PROFILE.course", filters.course)
            .eq("PATIENT_PROFILE.school_year", filters.year_section)
            .eq("PATIENT_PROFILE.person_type", filters.user_type)
        )

        if filters.search:
            like = f"%{filters.search}%"
            query = query.or_(
                f"patient_id.ilike.{like}"
            )

        result = self.fetch_page(query, filters.page, filters.page_size)

        result.items = [
            {**(item.get("PATIENT_PROFILE") or {}), "registration_status": item.get("registration_status")}
            for item in result.items
        ]

        return result

    def get_summary_records(self, patient_id: str) -> Any:
        return (
            self.supabase
            .table("patient_summary")
            .select("*")
            .eq("patient_id", patient_id)
            .single()
            .execute()
        )

    def get_medical_dental_summary(self, patient_id: str) -> Any:
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

    def get_medical_history(self, patient_id: str) -> Optional[dict[str, Any]]:
        """Retrieve the medical history record for a patient."""
        return self.fetch_one(
            "MEDICAL_HISTORY",
            filters={"patient_id": patient_id},
        )

    def get_family_history(self, patient_id: str) -> Optional[dict[str, Any]]:
        """Retrieve the family history record for a patient."""
        return self.fetch_one(
            "FAMILY_MEDICAL_HISTORY",
            filters={"patient_id": patient_id},
        )

    def delete_patient_cascade(self, patient_id: str) -> Any:
        # Atomic: profile + patient deleted in one transaction.
        # Requires migration 20261010120000_cascade_deletes.
        return self.supabase.rpc(
            "delete_patient_records",
            {"p_patient_id": patient_id},
        ).execute()

    def update_profile(self, patient_id: str, profile_data: dict[str, Any]) -> Optional[dict[str, Any]]:
        return self.update_by_column(
            "PATIENT_PROFILE",
            "patient_id",
            patient_id,
            profile_data,
        )

    def insert_personal_record(self, patient_id: str, data: CreateMedicalhistory) -> Optional[str]:
        response = (
            self.supabase
            .table("MEDICAL_HISTORY")
            .insert(data.to_db_dict(patient_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]

    def insert_family_history(self, patient_id: str, data: FamilyHistory) -> Optional[str]:
        response = (
            self.supabase
            .table("FAMILY_MEDICAL_HISTORY")
            .insert(data.to_db_dict(patient_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]

    def insert_results(self, patient_id: str, data: PatientResults) -> Optional[str]:
        response = (
            self.supabase
            .table("RESULTS")
            .insert(data.to_db_dict(patient_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]
