from pydantic import BaseModel


class SeparatedName(BaseModel):
    first_name: str
    middle_name: str | None = None
    last_name: str


def separate_name(full_name: str) -> SeparatedName:
    """Parse 'LAST, FIRST[, MIDDLE]' (comma-separated, last name first)."""
    parts = [part.strip() for part in full_name.split(",")]

    if len(parts) < 2 or not parts[0] or not parts[1]:
        raise ValueError(
            "Name must be in 'LAST, FIRST' format separated by a comma"
        )

    last_name = parts[0]
    first_name = parts[1]
    middle_name = parts[2] if len(parts) > 2 else None

    return SeparatedName(
        last_name=last_name,
        first_name=first_name,
        middle_name=middle_name,
    )