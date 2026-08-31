class PatientRepository:

    def __init__(self, supabase):
        self.supabase = supabase

    def get_by_id(self, patient_id: str):
        response = (
            self.supabase
            .table("PATIENT")
            .select("*")
            .eq("patient_id",patient_id)
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