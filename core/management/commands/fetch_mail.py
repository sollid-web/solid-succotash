import email
import imaplib
import logging
import os
from email.header import decode_header
from email.utils import parseaddr

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import get_valid_filename
from dotenv import load_dotenv

from core.models import EmailAttachment, IncomingEmail

# Load environment variables from .env file
load_dotenv()

# Logger for this management command
logger = logging.getLogger("core.management.fetch_mail")


def _decode_mime_header(value: str | None) -> str:
    """Decode MIME-encoded headers, join multiple parts safely."""
    if not value:
        return ""
    parts = decode_header(value)
    decoded_fragments = []
    for fragment, enc in parts:
        try:
            if isinstance(fragment, bytes):
                decoded_fragments.append(fragment.decode(enc or "utf-8", errors="replace"))
            else:
                decoded_fragments.append(str(fragment))
        except Exception:
            decoded_fragments.append(str(fragment))
    return "".join(decoded_fragments).strip()


def _scan_attachment(payload: bytes, filename: str) -> bool:
    """Basic attachment scanning stub.

    - Rejects files over 10MB.
    - Rejects dangerous extensions (.exe, .scr, .bat, .js, .vbs).

    This is a placeholder for integration with a real AV scanner (e.g., ClamAV).
    Returns True if attachment is allowed, False if it should be skipped.
    """
    MAX_BYTES = 10 * 1024 * 1024  # 10 MB
    blocked_ext = {".exe", ".scr", ".bat", ".js", ".vbs", ".cmd"}
    if not payload:
        return False
    if len(payload) > MAX_BYTES:
        logger.warning("Attachment %s rejected: size %d > %d", filename, len(payload), MAX_BYTES)
        return False
    _, ext = os.path.splitext(filename.lower())
    if ext in blocked_ext:
        logger.warning("Attachment %s rejected: blocked extension %s", filename, ext)
        return False
    # Passed basic checks
    return True


class Command(BaseCommand):
    help = 'Fetch emails from the IMAP server and store them in the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            dest="dry_run",
            help="Parse and show emails without saving to the database",
        )
        parser.add_argument(
            "--limit",
            type=int,
            dest="limit",
            default=0,
            help="Optional limit on number of emails to fetch (0 = no limit)",
        )

    def handle(self, *args, **kwargs):
        dry_run = kwargs.get("dry_run", False)
        limit = int(kwargs.get("limit", 0) or 0)
        if dry_run:
            self.stdout.write("Running in dry-run mode: emails will not be saved.")
            logger.info("Starting fetch_mail in dry-run mode")

        # IMAP server credentials - try multiple common env var names and fallbacks
        imap_host = (
            os.getenv("IMAP_HOST")
            or os.getenv("INBOX_IMAP_HOST")
            or os.getenv("SMTP_HOST")
        )
        imap_port = (
            os.getenv("IMAP_PORT")
            or os.getenv("INBOX_IMAP_PORT")
        )
        imap_user = (
            os.getenv("IMAP_USER")
            or os.getenv("INBOX_EMAIL_USER")
            or os.getenv("EMAIL_USER")
            or os.getenv("DEFAULT_FROM_EMAIL")
        )
        imap_password = (
            os.getenv("IMAP_PASS")
            or os.getenv("INBOX_EMAIL_PASSWORD")
            or os.getenv("EMAIL_PASS")
            or os.getenv("EMAIL_HOST_PASSWORD")
        )

        if not all([imap_host, imap_user, imap_password]):
            missing = [
                name
                for name, val in (
                    ("IMAP_HOST", imap_host),
                    ("IMAP_USER", imap_user),
                    ("IMAP_PASSWORD/IMAP_PASS", imap_password),
                )
                if not val
            ]
            self.stderr.write(
                f"IMAP credentials missing: {', '.join(missing)}.\n"
                "Checked IMAP_HOST/INBOX_IMAP_HOST/SMTP_HOST, IMAP_USER/INBOX_EMAIL_USER/EMAIL_USER/DEFAULT_FROM_EMAIL, "
                "and IMAP_PASS/INBOX_EMAIL_PASSWORD/EMAIL_PASS/EMAIL_HOST_PASSWORD."
            )
            logger.error("Missing IMAP credentials: %s", missing)
            return

        try:
            # Connect to the server (use provided port if available)
            if imap_port:
                try:
                    mail = imaplib.IMAP4_SSL(imap_host, int(imap_port))
                except Exception:
                    # Fall back to default SSL connection if port parsing fails
                    mail = imaplib.IMAP4_SSL(imap_host)
            else:
                mail = imaplib.IMAP4_SSL(imap_host)
            mail.login(imap_user, imap_password)

            # Select the mailbox you want to use
            mail.select("inbox")

            # Search for all unseen emails
            status, messages = mail.search(None, "UNSEEN")

            if status != "OK":
                self.stderr.write("Failed to fetch emails.")
                logger.error("IMAP search failed status=%s", status)
                return

            fetched = 0
            for num in messages[0].split():
                if limit and fetched >= limit:
                    break
                # Fetch the email by ID
                status, msg_data = mail.fetch(num, "(RFC822)")
                if status != "OK":
                    self.stderr.write(f"Failed to fetch email ID {num}.")
                    logger.warning("Failed to fetch email id %s status=%s", num, status)
                    continue

                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        # Parse the email
                        msg = email.message_from_bytes(response_part[1])

                        # Decode email subject (robust to missing header)
                        raw_subject = msg.get("Subject")
                        subject = _decode_mime_header(raw_subject)

                        # Decode sender
                        from_raw = msg.get("From") or ""
                        from_name, from_email = parseaddr(from_raw)
                        from_name = _decode_mime_header(from_name)
                        from_ = f"{from_name} <{from_email}>" if from_email else from_raw

                        # Decode recipients
                        to = msg.get("To") or ""

                        # Get the email body (prefer text/plain, fallback to text/html)
                        body = ""
                        body_html = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition") or "")
                                try:
                                    if content_type == "text/plain" and "attachment" not in content_disposition:
                                        payload = part.get_payload(decode=True)
                                        if payload:
                                            body = payload.decode(errors="replace")
                                            break
                                    if content_type == "text/html" and "attachment" not in content_disposition:
                                        payload = part.get_payload(decode=True)
                                        if payload:
                                            body_html = payload.decode(errors="replace")
                                except Exception:
                                    logger.exception("Error decoding email body part")
                        else:
                            try:
                                payload = msg.get_payload(decode=True)
                                if payload:
                                    body = payload.decode(errors="replace")
                            except Exception:
                                body = str(msg.get_payload())

                        if not body and body_html:
                            # fallback to html if no plain text available
                            body = body_html

                        # Show/save the email according to dry-run flag
                        if dry_run:
                            self.stdout.write(f"[DRY] From: {from_} Subject: {subject}")
                            logger.debug("Parsed email (dry): from=%s subject=%s", from_, subject)
                        else:
                            incoming_email = IncomingEmail.objects.create(
                                subject=subject,
                                sender=from_,
                                recipients=to,
                                body=body,
                                raw_date=msg.get("Date"),
                                received_by=imap_user,
                            )

                            # Process attachments
                            for part in msg.walk():
                                content_disposition = str(part.get("Content-Disposition") or "")
                                if "attachment" in content_disposition:
                                    filename = part.get_filename()
                                    if not filename:
                                        continue
                                    payload = part.get_payload(decode=True)
                                    if not payload:
                                        logger.info("Skipping attachment %s: empty payload", filename)
                                        continue
                                    safe_name = get_valid_filename(filename)
                                    # Basic scan check before writing
                                    if not _scan_attachment(payload, safe_name):
                                        logger.info("Skipping attachment %s due to scan/size rules", safe_name)
                                        continue

                                    attachment_content = ContentFile(payload, name=safe_name)

                                    EmailAttachment.objects.create(
                                        email=incoming_email,
                                        filename=safe_name,
                                        file=attachment_content,
                                    )

                            self.stdout.write(f"Email from {from_} with subject '{subject}' saved.")
                            logger.info("Saved email from %s subject=%s id=%s", from_, subject, incoming_email.id)
                        fetched += 1

            # Close the connection
            mail.logout()
        except Exception as e:
            logger.exception("Unhandled error in fetch_mail")
            self.stderr.write(f"An error occurred: {e}")
