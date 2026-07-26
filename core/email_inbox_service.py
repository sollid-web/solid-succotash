"""
Professional Email Inbox Service
Handles IMAP email fetching, parsing, and storage
"""

import email
import imaplib
import logging
from datetime import datetime
from email.header import decode_header
from email.utils import parseaddr, parsedate_to_datetime

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import EmailInbox

logger = logging.getLogger(__name__)


class EmailInboxService:
    """Service for fetching and managing business email inbox."""

    def __init__(self):
        self.host = getattr(settings, 'INBOX_IMAP_HOST', 'imap.gmail.com')
        self.port = getattr(settings, 'INBOX_IMAP_PORT', 993)
        self.username = getattr(settings, 'INBOX_EMAIL_USER', '')
        self.password = getattr(settings, 'INBOX_EMAIL_PASSWORD', '')
        self.folder = getattr(settings, 'INBOX_FOLDER', 'INBOX')
        self.use_ssl = getattr(settings, 'INBOX_USE_SSL', True)

    def connect(self) -> imaplib.IMAP4_SSL | None:
        """Connect to IMAP server."""
        try:
            if self.use_ssl:
                mail = imaplib.IMAP4_SSL(self.host, self.port)
            else:
                mail = imaplib.IMAP4(self.host, self.port)

            mail.login(self.username, self.password)
            logger.info(f"Connected to {self.host} as {self.username}")
            return mail
        except Exception as e:
            logger.error(f"IMAP connection failed: {e}")
            return None

    def decode_header_value(self, value: str) -> str:
        """Decode email header value."""
        if not value:
            return ""

        decoded_parts = decode_header(value)
        decoded_string = ""

        for part, encoding in decoded_parts:
            if isinstance(part, bytes):
                try:
                    decoded_string += part.decode(encoding or 'utf-8', errors='ignore')
                except Exception:
                    decoded_string += part.decode('utf-8', errors='ignore')
            else:
                decoded_string += str(part)

        return decoded_string.strip()

    def extract_email_body(self, msg) -> tuple[str, str]:
        """Extract plain text and HTML body from email."""
        text_body = ""
        html_body = ""

        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                disposition = str(part.get("Content-Disposition", ""))

                if "attachment" not in disposition:
                    try:
                        payload = part.get_payload(decode=True)
                        if payload:
                            charset = part.get_content_charset() or 'utf-8'
                            decoded = payload.decode(charset, errors='ignore')

                            if content_type == "text/plain":
                                text_body += decoded
                            elif content_type == "text/html":
                                html_body += decoded
                    except Exception as e:
                        logger.warning(f"Error decoding part: {e}")
        else:
            try:
                payload = msg.get_payload(decode=True)
                if payload:
                    charset = msg.get_content_charset() or 'utf-8'
                    decoded = payload.decode(charset, errors='ignore')

                    if msg.get_content_type() == "text/plain":
                        text_body = decoded
                    elif msg.get_content_type() == "text/html":
                        html_body = decoded
            except Exception as e:
                logger.warning(f"Error decoding message: {e}")

        return text_body.strip(), html_body.strip()

    def extract_attachments(self, msg) -> dict:
        """Extract attachment information from email."""
        attachments = []

        if msg.is_multipart():
            for part in msg.walk():
                disposition = str(part.get("Content-Disposition", ""))

                if "attachment" in disposition:
                    filename = part.get_filename()
                    if filename:
                        filename = self.decode_header_value(filename)
                        content_type = part.get_content_type()
                        size = len(part.get_payload(decode=True) or b"")

                        attachments.append({
                            "filename": filename,
                            "content_type": content_type,
                            "size": size
                        })

        return {
            "count": len(attachments),
            "files": attachments
        }

    def parse_email(self, raw_email: bytes, message_id: str) -> dict:
        """Parse raw email into structured data."""
        msg = email.message_from_bytes(raw_email)

        # Extract headers
        subject = self.decode_header_value(msg.get("Subject", ""))
        from_header = msg.get("From", "")
        from_name, from_email = parseaddr(from_header)
        from_name = self.decode_header_value(from_name)

        to_email = msg.get("To", "")
        cc = msg.get("Cc", "")
        bcc = msg.get("Bcc", "")
        reply_to = msg.get("Reply-To", "")

        # Parse date
        date_header = msg.get("Date", "")
        try:
            received_at = parsedate_to_datetime(date_header)
            if received_at.tzinfo is None:
                received_at = timezone.make_aware(received_at)
        except Exception:
            received_at = timezone.now()

        # Extract body
        text_body, html_body = self.extract_email_body(msg)

        # Extract attachments
        attachment_info = self.extract_attachments(msg)

        # Build headers dict
        headers = {}
        for key, value in msg.items():
            headers[key] = self.decode_header_value(value)

        return {
            "message_id": message_id or msg.get("Message-ID", ""),
            "subject": subject,
            "from_email": from_email,
            "from_name": from_name,
            "to_email": to_email,
            "cc": cc,
            "bcc": bcc,
            "reply_to": reply_to if reply_to else from_email,
            "body_text": text_body or "No plain text body",
            "body_html": html_body,
            "has_attachments": attachment_info["count"] > 0,
            "attachment_info": attachment_info,
            "received_at": received_at,
            "raw_headers": headers,
            "raw_email": raw_email.decode('utf-8', errors='ignore')
        }

    @transaction.atomic
    def save_email(self, email_data: dict) -> EmailInbox | None:
        """Save parsed email to database."""
        try:
            # Check if already exists
            if EmailInbox.objects.filter(message_id=email_data["message_id"]).exists():
                logger.info(f"Email {email_data['message_id']} already exists, skipping")
                return None

            # Create new email record
            inbox_email = EmailInbox.objects.create(**email_data)
            logger.info(f"Saved email: {inbox_email.subject}")
            return inbox_email

        except Exception as e:
            logger.error(f"Error saving email: {e}")
            return None

    def fetch_emails(self, limit: int = 50, folder: str = None) -> int:
        """Fetch emails from IMAP server and save to database."""
        mail = self.connect()
        if not mail:
            return 0

        try:
            folder = folder or self.folder
            mail.select(folder)

            # Search for all emails (or unseen only)
            status, messages = mail.search(None, 'ALL')

            if status != 'OK':
                logger.error("Failed to search emails")
                return 0

            email_ids = messages[0].split()

            # Limit number of emails to fetch
            email_ids = email_ids[-limit:]

            saved_count = 0

            for email_id in email_ids:
                try:
                    # Fetch email
                    status, msg_data = mail.fetch(email_id, '(RFC822)')

                    if status != 'OK':
                        continue

                    raw_email = msg_data[0][1]

                    # Parse and save
                    email_data = self.parse_email(raw_email, f"imap-{email_id.decode()}-{datetime.now().timestamp()}")

                    if self.save_email(email_data):
                        saved_count += 1

                except Exception as e:
                    logger.error(f"Error processing email {email_id}: {e}")
                    continue

            logger.info(f"Fetched and saved {saved_count} new emails")
            return saved_count

        except Exception as e:
            logger.error(f"Error fetching emails: {e}")
            return 0
        finally:
            try:
                mail.close()
                mail.logout()
            except Exception:
                pass

    def mark_as_read_on_server(self, message_id: str):
        """Mark email as read on IMAP server."""
        mail = self.connect()
        if not mail:
            return False

        try:
            mail.select(self.folder)
            status, messages = mail.search(None, f'HEADER Message-ID "{message_id}"')

            if status == 'OK' and messages[0]:
                email_id = messages[0].split()[0]
                mail.store(email_id, '+FLAGS', '\\Seen')
                return True

        except Exception as e:
            logger.error(f"Error marking email as read: {e}")
        finally:
            try:
                mail.close()
                mail.logout()
            except Exception:
                pass

        return False


# Convenience functions
def fetch_new_emails(limit: int = 50) -> int:
    """Fetch new emails from inbox."""
    service = EmailInboxService()
    return service.fetch_emails(limit=limit)


def mark_email_read(email: EmailInbox, user=None):
    """Mark email as read in database and on server."""
    email.mark_as_read(user)
    service = EmailInboxService()
    service.mark_as_read_on_server(email.message_id)
