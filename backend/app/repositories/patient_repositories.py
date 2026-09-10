from app.schemas.query import Filter


class PatientRepository:

    def __init__(self, supabase):
        self.supabase = supabase

    def get_by_id(self, patient_id: str):
        response = (
            self.supabase
            .table("PATIENT")
            .select("*")
            .eq("patient_id", patient_id)
            .limit(1)
            .execute()
        )

        if response:
            return response.data

        return None

    def get_all(self):
        response = (
            self.supabase
            .table("PATIENT")
            .select("*")
            .execute()
        )

        return response.data

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

    def get_all_profile(self, query: Filter | None = None):

        table_query = self.supabase.table("PATIENT_PROFILE").select("*")

        if not query:
            return table_query.execute().data

        if query.search:
            query = query.or_(
                f"first_name.ilike.%{query.search}%,"
                f"last_name.ilike.%{query.search}%,"
                f"patient_id.ilike.%{query.search}%"
            )

        if query.sex:
            table_query = table_query.eq("sex", query.sex)

        if query.status:
            table_query = table_query.eq("status", query.status)

        if query.course:
            table_query = table_query.eq("course", query.course)

        if query.year_section:
            table_query = table_query.eq("year_section", query.year_section)

        response = table_query.execute()

        return response.data

