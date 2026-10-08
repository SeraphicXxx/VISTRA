from enum import Enum


class MedicalVisitTypes(str, Enum):
    MEDICAL_CONSULTATION = "medicalConsultation"
    FOLLOWUP = "followUp"

class MedicalVisitStatus(str, Enum):
    CLEARED = "cleared"
    NOT_CLEARED = "notCleared"
    SECOND_OPTION = "secondOption"
    RECOVERED = "recovered"
    REFERRED = "referred"
    ONGOING_TREATMENT = "ongoingTreatment"


class MedicalTreatmentType(str, Enum):
    MEDICINE = "Medicine"
    PROCEDURE = "Procedure"
    ADVICE = "Advice"
    REFERRAL = "Referral"
    OTHER = "Other"
