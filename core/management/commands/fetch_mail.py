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

    def handle(self, *args, **kwargs):
        # IMAP server credentials
        imap_host = os.getenv('IMAP_HOST')
        imap_user = os.getenv('IMAP_USER')
        imap_password = os.getenv('IMAP_PASSWORD')

        if not all([imap_host, imap_user, imap_password]):
            self.stderr.write("IMAP credentials are not fully configured in the environment variables.")
            return

        try:
            # Connect to the server
            mail = imaplib.IMAP4_SSL(imap_host)
            mail.login(imap_user, imap_password)

            # Select the mailbox you want to use
            mail.select("inbox")

            # Search for all unseen emails
            status, messages = mail.search(None, 'UNSEEN')

            if status != "OK":
                self.stderr.write("Failed to fetch emails.")
                return

            for num in messages[0].split():
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

                        # Save the email to the database
                        incoming_email = IncomingEmail.objects.create(
                            subject=subject,
                            sender=from_,
                            recipients=to,
                            body=body,
                            raw_date=msg.get("Date"),
                            received_by=imap_user
                        )

                        # Process attachments
                        for part in msg.walk():
                            content_disposition = str(part.get("Content-Disposition"))
                            if "attachment" in content_disposition:
                                filename = part.get_filename()
                                if filename:
                                    filepath = f"email_attachments/{filename}"
                                    with open(filepath, "wb") as f:
                                        f.write(part.get_payload(decode=True))

                                    # Save attachment to the database
                                    EmailAttachment.objects.create(
                                        email=incoming_email,
                                        filename=filename,
                                        file=filepath
                                    )

                        self.stdout.write(f"Email from {from_} with subject '{subject}' saved.")

            # Close the connection
            mail.logout()
        except Exception as e:
            self.stderr.write(f"An error occurred: {e}")