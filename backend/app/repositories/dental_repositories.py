class DentalRepositories:
    def __init__(self, supabase):
        self.supabase = supabase

    def create(self, data, staff_id):
        response = (
            self.supabase
            .table("DENTAL_VISIT")
            .insert({
                "patient_id": data.patient_id,
                "last_dental_visit": data.last_dental_visit,
                "brushing_frequency": data.brushing_frequency,
                "floss": data.floss,
                "calculus_severity": data.calculus_severity,
                "current_medications": data.current_medications,
                "notes": data.notes,
                "staff_id": staff_id,
            })
            .execute()
        )

        if not response.data:
            return None

        return response.data[0]["id"]

    def create_odontogram(
            self,
            data,
            patient_id,
            dental_record_id: int
    ):
        teeth = [
            {
                "patient_id": patient_id,
                "tooth_number": item.tooth_number,
                "is_permanent": item.dentition == "permanent",
                "condition": item.condition,
                "notes": item.notes,
                "dental_record_id": dental_record_id,
            }
            for item in data
        ]
        response = (
            self.supabase
            .table("ODONTOGRAM")
            .insert(teeth)
            .execute()
        )

        return response.data
