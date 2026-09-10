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

    def get_appointments(self):
        response = (
            self.supabase
            .table("APPOINTMENT")
            .select("*")
            .execute()
        )

        return response.data

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
            self.supabase.table("APPOINTMENT").delete().eq("id", appointment_id).execute()
        )
        return bool(response.data)
