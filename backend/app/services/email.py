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


def _build_html_body(subject: str, body: str) -> str:
    """Build a branded HTML email template."""
    return f"""\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#0d9488;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">VISTRA Clinic</h1>
              <p style="margin:4px 0 0;color:#ccfbf1;font-size:13px;">University of Caloocan City — Health Services</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;color:#1e293b;font-size:18px;font-weight:600;">{subject}</h2>
              <p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.6;white-space:pre-line;">{body}</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 4px;color:#64748b;font-size:12px;">
                This is an automated notification from VISTRA Clinic.
              </p>
              <p style="margin:0 0 4px;color:#64748b;font-size:12px;">
                Biglang Awa St., 12th Avenue, Caloocan City
              </p>
              <p style="margin:0;color:#94a3b8;font-size:11px;">
                If you no longer wish to receive these emails, please contact the clinic front desk.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


@handle_service_errors
def send_email(to: str, subject: str, body: str):
    """Send an email via Gmail SMTP (TLS on port 587).

    Sends both plain-text and HTML (multipart/alternative) versions.
    """
    sender, password = _get_gmail_credentials()

    msg = MIMEMultipart("alternative")
    msg["From"] = f"VISTRA Clinic <{sender}>"
    msg["To"] = to
    msg["Subject"] = subject
    msg["Reply-To"] = sender

    # Plain text fallback
    plain = f"{subject}\n\n{body}\n\n---\nVISTRA Clinic\nUniversity of Caloocan City — Health Services"
    msg.attach(MIMEText(plain, "plain"))

    # HTML version
    msg.attach(MIMEText(_build_html_body(subject, body), "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender, password)
        server.sendmail(sender, to, msg.as_string())

    return ok(message="Email sent successfully", to=to)