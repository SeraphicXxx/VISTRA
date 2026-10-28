from app.repositories.base import BaseRepository
from app.schemas.appointments import EDITABLE_APPOINTMENT_COLUMNS
from app.utils.supabase_query_builder import SupabaseQueryBuilder


class AppointmentRepository(BaseRepository):
    def __init__(self, supabase):
        self.supabase = supabase

    def create_appointment(self, appointment_data):
        response = (
            self.supabase
            .table("APPOINTMENT")
            .insert(appointment_data)
            .execute()
        )

        if response.data:
            return response.data[0]

        return None

    def get_appointments(self, filters):
        use_course_filter = bool(getattr(filters, "course", None))
        columns = """
                    *,
                    PATIENT!inner(
                        PATIENT_PROFILE!inner(
                            first_name,
                            middle_name,
                            last_name,
                            course
                        )
                    )
                """ if use_course_filter else """
                    *,
                    PATIENT(
                        PATIENT_PROFILE(
                            first_name,
                            middle_name,
                            last_name,
                            course
                        )
                    )
                """
        query = (
            SupabaseQueryBuilder(
                self.supabase,
                "APPOINTMENT",
                columns=columns,
                count="exact"
            )
            .eq("patient_id", filters.patient_id)
            .eq("status", filters.status)
            .eq("type", filters.type)
            .order("scheduled_start", "desc")
        )

        if use_course_filter:
            query = query.eq(
                "PATIENT.PATIENT_PROFILE.course", filters.course
            )

        if filters.date:
            query = query.date_day("scheduled_start", filters.date)

        result = self.fetch_page(query, filters.page, filters.page_size)
        result.items = [
            self._map_appointment(appointment)
            for appointment in result.items
        ]

        return result

    def get_appointment_by_id(self, appointment_id: int, patient_id: str):
        row = self.fetch_one(
            "APPOINTMENT",
            select="""
                *,
                PATIENT(
                    PATIENT_PROFILE(
                        first_name,
                        middle_name,
                        last_name,
                        course
                    )
                )
            """,
            filters={
                "id": appointment_id,
                "patient_id": patient_id,
            },
        )

        if row is None:
            return None

        return self._map_appointment(row)

    def update_appointment(self, appointment_id: int, updated_appointment_data: dict):
        updatable = {
            key: value
            for key, value in (updated_appointment_data or {}).items()
            if key in EDITABLE_APPOINTMENT_COLUMNS
        }

        if not updatable:
            raise ValueError(
                "No updatable fields provided. Allowed: "
                + ", ".join(sorted(EDITABLE_APPOINTMENT_COLUMNS))
            )

        response = (
            self.supabase
            .table("APPOINTMENT")
            .update(updatable)
            .eq("id", appointment_id)
            .execute()
        )

        if response.data:
            return response.data[0]

        return None

    def delete_appointment(self, appointment_id: int):
        return self.delete_by_column("APPOINTMENT", "id", appointment_id)

    @staticmethod
    def _map_appointment(appointment):
        if not isinstance(appointment, dict):
            return appointment

        appointment = dict(appointment)
        patient = appointment.pop("PATIENT", {}) or {}

        if isinstance(patient, list):
            patient = patient[0] if patient else {}

        if not isinstance(patient, dict):
            patient = {}

        profile = patient.get("PATIENT_PROFILE", {}) or {}

        if isinstance(profile, list):
            profile = profile[0] if profile else {}

        if not isinstance(profile, dict):
            profile = {}

        return {
            **appointment,
            "first_name": profile.get("first_name"),
            "middle_name": profile.get("middle_name"),
            "last_name": profile.get("last_name"),
            "course": profile.get("course"),
        }
