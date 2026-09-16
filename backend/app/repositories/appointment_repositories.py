from app.schemas.response_dto.reponses import PaginatedResponse
from app.utils.supabase_query_builder import SupabaseQueryBuilder


class AppointmentRepository:
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
        query = (
            SupabaseQueryBuilder(
                self.supabase,
                "APPOINTMENT",
                count="exact",
            )
            .eq("status", filters.status)
            .eq("type", filters.type)
            .eq("course", filters.course)
            .eq("date", filters.date)
        )
        response = (
            query
            .paginate(
                filters.page,
                filters.page_size,
            )
            .build()
            .execute()
        )

        total = response.count or 0

        return PaginatedResponse(
            items=response.data,
            total=total,
            page=filters.page,
            page_size=filters.page_size,
        )

    def get_appointment_by_id(self, appointment_id: int):
        response = (
            self.supabase
            .table("APPOINTMENT")
            .select("*")
            .eq("id", appointment_id)
            .limit(1)
            .execute()
        )

        if response.data:
            return response.data[0]

        return None

    def update_appointment(self, appointment_id: int, updated_appointment_data: dict):
        response = (
            self.supabase
            .table("APPOINTMENT")
            .update(updated_appointment_data)
            .eq("id", appointment_id)
            .execute()
        )

        if response.data:
            return response.data[0]

        return None

    def delete_appointment(self, appointment_id: int):
        response = (
            self.supabase.table("APPOINTMENT")
            .delete()
            .eq("id", appointment_id)
            .execute()
        )
        return bool(response.data)
