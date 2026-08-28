class PatientRepository:

    def __init__(self, supabase):
        self.supabase = supabase

    def get_all(self):
        response = (
            self.supabase
            .table("PATIENT")
            .select("*")
            .execute()
        )

        return response.data
