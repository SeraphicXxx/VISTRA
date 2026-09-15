from enum import Enum
from typing import TypeVar

E = TypeVar("E", bound=Enum)


def validate_enum(value: str, enum_class: type[E]) -> str:
    if value not in [item.value for item in enum_class]:
        raise ValueError(
            f"Value must be one of: {', '.join(item.value for item in enum_class)}"
        )

    return value


def confirm_not_blank(value: str) -> str:
    value = value.strip()

    if not value:
        raise ValueError("Field cannot be blank")

    return value


def confirm_mobile_number(value: str) -> str:
    value = value.strip()

    if not value.isdigit():
        raise ValueError("Mobile number must contain only digits")

    if len(value) not in (10, 11):
        raise ValueError("Invalid mobile number")

    return value


def confirm_sex(value: str) -> str:
    allowed = {"Male", "Female"}

    if value not in Sex:
        raise ValueError(
            f"Sex must be one of : {', '.join(allowed)}"
        )

    return value


def confirm_civil_status(value: str) -> str:
    allowed = {
        "Single",
        "Married",
        "Widowed",
        "Separated"
    }

    if value not in allowed:
        raise ValueError(
            f"Civil status must be one of: {', '.join(allowed)}"
        )

    return value
