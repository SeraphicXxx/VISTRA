from app.database.database_client import supabase, supabase_admin
from app.repositories.patient_repositories import PatientRepository
from app.schemas.patient import PatientData, CreatePatientRequest
from app.utils.email_utils import add_ucc_domain, remove_ucc_domain

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
    
def get_patient_by_id(patient_id: str):
    try:
        patient_repo = PatientRepository(supabase)
        response = patient_repo.get_by_id(patient_id)

        print("patient_id:", repr(patient_id))
        print("response:", response)

        if response:
            return {
                "success": True,
                "data": response
            }

        return {
            "success": False,
            "message": f"Patient not found for {patient_id}"
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

def create_patient(request: CreatePatientRequest):
    patient_id = remove_ucc_domain(request.patient_id)
    patient_auth_email = add_ucc_domain(request.patient_id)

    try:
        auth_response = supabase_admin.auth.admin.create_user({
            "email": patient_auth_email,
            "password": request.password,
            "email_confirm": True,
            "app_metadata": {
                "role": "patient"
            }
        })

        patient_data = PatientData(
            id=auth_response.user.id,
            patient_id=patient_id,
            created_by=request.created_by
        )

        insert_response = insert_patient_into_db(patient_data)

        if insert_response["success"]:
            return {
                    "success": True,
                    "user": patient_data.model_dump()
                    }

        delete_patient_response = delete_patient(auth_response.user.id)

        if delete_patient_response["success"]:
            return {
                "success": False,
                "message": insert_response["message"]
            }

        return {
            "success": False,
            "message": (
                "Failed to insert patient into database and failed to delete "
                f"user from auth: {delete_patient_response['message']}"
            )
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

def insert_patient_into_db(patient_data: PatientData):
    try:
        patient_repo = PatientRepository(supabase)
        response = patient_repo.create(patient_data)

        return{
            "success": True,
            "data": response.data
        }

    except Exception as e:
        return {
            "success": False,   
            "message": str(e)
        }

def delete_patient(patient_id: str):
    try:
        response = supabase_admin.auth.admin.delete_user(patient_id)

        return {
            "success": True,
            "data": response
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }