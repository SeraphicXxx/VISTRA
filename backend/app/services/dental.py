from app.schemas.dental import DentalCreateRequest

from app.repositories.dental_repositories import DentalRepositories


def create_dental_record(request: DentalCreateRequest, supabase):
    try:
        dental_repository = DentalRepositories(supabase)

        dental_data = request.model_dump(
            mode="json",
            exclude={"tooth"}
        )

        dental_record_id = dental_repository.create(dental_data)

        if not dental_record_id:
            raise Exception("Failed to create dental record")

        dental_repository.create_odontogram(
            request.tooth,
            dental_record_id
        )

        return {
            "success": True,
            "dental_record_id": dental_record_id
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }