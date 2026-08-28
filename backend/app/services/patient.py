from app.database.database_client import supabase
from app.repositories.patient_repositories import PatientRepository

def get_all_patients():
    try:
        patient_repo = PatientRepository(supabase)
        response = patient_repo.get_all()

        return {
            "success": True,
            "data": response
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }