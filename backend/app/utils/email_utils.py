UCC_DOMAIN = "@ucc.com"


def remove_ucc_domain(email: str) -> str:
    if email.lower().endswith(UCC_DOMAIN):
        return email[: -len(UCC_DOMAIN)]

    return email


def add_ucc_domain(username: str) -> str:
    if username.lower().endswith(UCC_DOMAIN):
        return username

    return f"{username}{UCC_DOMAIN}"


def staff_id_format(email: str) -> str:
    email = remove_ucc_domain(email)
    return email.upper()
