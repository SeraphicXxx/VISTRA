from pydantic import BaseModel, Field


class SendEmailRequest(BaseModel):
    """Request body for sending an email notification."""

    to: str = Field(..., min_length=1, description="Recipient email address")
    subject: str = Field(..., min_length=1, max_length=200, description="Email subject")
    body: str = Field(..., min_length=1, description="Email body (plain text)")


class SendEmailResponse(BaseModel):
    """Response after attempting to send an email."""

    success: bool
    message: str
    to: str | None = None