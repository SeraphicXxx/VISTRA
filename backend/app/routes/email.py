from fastapi import APIRouter, Depends
from supabase import Client

from app.config.security import get_current_user
from app.database.database_client import get_supabase_for_user
from app.schemas.email import SendEmailRequest, SendEmailResponse
from app.schemas.response_dto.responses import EmailSendResponse
from app.services.email import send_email as send_email_service

email_router = APIRouter(
    prefix="/email",
    tags=["Email"],
    dependencies=[Depends(get_current_user)],
)


@email_router.post("/send/", response_model=EmailSendResponse)
def send_email_route(
    request: SendEmailRequest,
    supabase: Client = Depends(get_supabase_for_user),
):
    return send_email_service(
        to=request.to,
        subject=request.subject,
        body=request.body,
    )