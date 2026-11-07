import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config.settings import Config
from app.utils.service_helpers import handle_service_errors, ok


def _get_gmail_credentials() -> tuple[str, str]:
    """Return (gmail_address, app_password) from env."""
    address = (Config.GMAIL_ADDRESS or "").strip()
    password = (Config.GMAIL_APP_PASSWORD or "").strip()
    if not address or not password:
        raise ValueError(
            "GMAIL_ADDRESS and GMAIL_APP_PASSWORD must be set in .env"
        )
    return address, password


@handle_service_errors
def send_email(to: str, subject: str, body: str):
    """Send an email via Gmail SMTP (TLS on port 587)."""
    sender, password = _get_gmail_credentials()

    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = to
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, to, msg.as_string())

    return ok(message="Email sent successfully", to=to)