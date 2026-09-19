from app.schemas.dentalcreaterequest import OdontogramCreateRequest


class DentalRepositories:
    def __init__(self, supabase):
        self.supabase = supabase

    def create(self, data):
        response = (
            self.supabase
            .table("DENTAL_RECORD")
            .insert(data)
            .execute()
        )

        if response.inserted_id:
            return response.inserted_id

        return None

    def create_odontogram(
        self,
        data: list[OdontogramCreateRequest],
        dental_record_id: int
    ):
        teeth = [
            {
                **item.model_dump(mode="json"),
                "dental_record_id": dental_record_id
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