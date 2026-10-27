from enum import Enum

class AttachmentCategory(str, Enum):
    LABORATORY_RESULT = "laboratory_result"
    CLINICAL_PHOTO = "clinical_photo"