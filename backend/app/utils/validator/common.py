from datetime import date

def confirm_birthday(value: date) -> date:
    today = date.today()

    try:
        hundred_years_ago = today.replace(year=today.year - 100)
    except ValueError:
        # Feb 29 has no counterpart 100 years ago on non-leap years.
        hundred_years_ago = today.replace(
            year=today.year - 100, day=28
        )

    if value < hundred_years_ago:
        raise ValueError("Birthday must be for someone younger than 100 years old")

    return value


def confirm_enum(value: str, enum_class) -> str:
    valid = [item.value for item in enum_class]

    if value not in valid:
        raise ValueError(f"Value must be one of: {', '.join(valid)}")

    return value


def confirm_not_blank(value: str) -> str:
    value = value.strip()

    if not value:
        raise ValueError("Field cannot be blank")

    return value


def confirm_mobile_number(value: str) -> str:
    value = confirm_not_blank(value)

    if not value.isdigit():
        raise ValueError("Mobile number must contain only digits")

    if len(value) not in (10, 11):
        raise ValueError("Invalid mobile number")

    return value
