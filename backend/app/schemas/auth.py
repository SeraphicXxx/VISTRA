from pydantic import BaseModel, model_validator


class LoginRequest(BaseModel):
    identifier: str | None = None
    email: str | None = None
    patient_id: str | None = None
    staff_id: str | None = None
    password: str

    @model_validator(mode="after")
    def check_identifier(self):
        fields = ("identifier", "email", "patient_id", "staff_id")

        if not any((getattr(self, field) or "").strip() for field in fields):
            raise ValueError(
                "identifier, email, staff_id, or patient_id is required"
            )

        return self


class RefreshTokenRequest(BaseModel):
    refresh_token: str
