
from enum import Enum

class Frequency(str, Enum):
    EVERYDAY = "Everyday"
    MODERATE = "Moderate"
    OCCASIONAL = "Occasional" 
    NONE = "None"

class Sexual_activity(str, Enum):
    YES = "Yes"
    NO = "No"

class Results(str, Enum):
    NORMAL = "Normal"
    ABNORMAL = "Abnormal"

    