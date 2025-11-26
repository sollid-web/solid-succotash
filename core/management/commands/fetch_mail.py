import imaplib
import email
from email.header import decode_header
import os
from django.core.management.base import BaseCommand
from core.models import IncomingEmail, EmailAttachment
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        # IMAP server credentials - try multiple common env var names and fallbacks
        imap_host = (
            os.getenv('IMAP_HOST')
            or os.getenv('INBOX_IMAP_HOST')
            or os.getenv('INBOX_IMAP_HOST'.upper())
            or os.getenv('SMTP_HOST')
        )
        imap_port = (
            os.getenv('IMAP_PORT')
            or os.getenv('INBOX_IMAP_PORT')
            or os.getenv('IMAP_PORT')
        )
        imap_user = (
            os.getenv('IMAP_USER')
            or os.getenv('INBOX_EMAIL_USER')
            or os.getenv('EMAIL_USER')
            or os.getenv('DEFAULT_FROM_EMAIL')
        )
        imap_password = (
            os.getenv('IMAP_PASS')
            or os.getenv('INBOX_EMAIL_PASSWORD')
            or os.getenv('EMAIL_PASS')
            or os.getenv('EMAIL_HOST_PASSWORD')
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
                "Checked IMAP_HOST/INBOX_IMAP_HOST/SMTP_HOST and IMAP_USER/INBOX_EMAIL_USER/EMAIL_USER, "
                "and IMAP_PASS/INBOX_EMAIL_PASSWORD/EMAIL_PASS/EMAIL_HOST_PASSWORD."
            )
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
            status, messages = mail.search(None, 'UNSEEN')

            if status != "OK":
                self.stderr.write("Failed to fetch emails.")
                return

            fetched = 0
            for num in messages[0].split():
                if limit and fetched >= limit:
                    break
                # Fetch the email by ID
                status, msg_data = mail.fetch(num, '(RFC822)')
                if status != "OK":
                    self.stderr.write(f"Failed to fetch email ID {num}.")
                    continue

                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        # Parse the email
                        msg = email.message_from_bytes(response_part[1])

                        # Decode email subject
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8")

                        # Decode sender
                        from_ = msg.get("From")

                        # Decode recipients
                        to = msg.get("To")

                        # Get the email body
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                content_disposition = str(part.get("Content-Disposition"))

                                try:
                                    if content_type == "text/plain" and "attachment" not in content_disposition:
                                        body = part.get_payload(decode=True).decode()
                                        break
                                except Exception as e:
                                    self.stderr.write(f"Error decoding email body: {e}")
                        else:
                            body = msg.get_payload(decode=True).decode()

                        # Show/save the email according to dry-run flag
                        if dry_run:
                            self.stdout.write(f"[DRY] From: {from_} Subject: {subject}")
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
                                content_disposition = str(part.get("Content-Disposition"))
                                if "attachment" in content_disposition:
                                    filename = part.get_filename()
                                    if filename:
                                        # Ensure attachments dir exists
                                        attachments_dir = os.path.join("email_attachments")
                                        os.makedirs(attachments_dir, exist_ok=True)
                                        filepath = os.path.join(attachments_dir, filename)
                                        with open(filepath, "wb") as f:
                                            f.write(part.get_payload(decode=True))

                                        # Save attachment to the database (FileField stores path)
                                        EmailAttachment.objects.create(
                                            email=incoming_email,
                                            filename=filename,
                                            file=filepath,
                                        )

                            self.stdout.write(f"Email from {from_} with subject '{subject}' saved.")
                        fetched += 1

            # Close the connection
            mail.logout()
        except Exception as e:
            self.stderr.write(f"An error occurred: {e}")