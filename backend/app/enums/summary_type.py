from enum import Enum

class SummaryType(str, Enum):
    APPOINTMENT = "appointment"
    MEDICAL = "medical"
    DENTAL = "dental"