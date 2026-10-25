def map_age_to_bracket(age: int) -> int:

    if age < 25:       # Handles students under 18 safely
        return 1
    elif age < 30:
        return 2
    elif age < 35:
        return 3
    elif age < 40:
        return 4
    elif age < 45:
        return 5
    elif age < 50:
        return 6
    elif age < 55:
        return 7
    elif age < 60:
        return 8
    elif age < 65:
        return 9
    elif age < 70:
        return 10
    elif age < 75:
        return 11
    elif age < 80:
        return 12
    else:
        return 13