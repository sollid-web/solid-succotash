import os
from django.test import TestCase
from core.models import IncomingEmail, EmailAttachment
from core.management.commands.fetch_mail import _scan_attachment


class AttachmentIntegrationTests(TestCase):
    def test_scan_attachment_accepts_small_allowed_extension(self):
        payload = b"hello world" * 100
        ok = _scan_attachment(payload, "note.txt")
        self.assertTrue(ok)

    def test_scan_attachment_rejects_large_file(self):
        payload = b"a" * (11 * 1024 * 1024)  # 11 MB
        ok = _scan_attachment(payload, "big.pdf")
        self.assertFalse(ok)

    def test_scan_attachment_rejects_blocked_extension(self):
        payload = b"malicious"
        ok = _scan_attachment(payload, "runme.exe")
        self.assertFalse(ok)

    def test_create_email_and_attachment_records(self):
        # Create IncomingEmail
        email = IncomingEmail.objects.create(
            subject="Integration Test",
            sender="tester@example.com",
            recipients="dev@example.com",
            body="Test body",
            raw_date="now",
            received_by="local",
        )
        # Create a small attachment file
        attachments_dir = os.path.join("email_attachments")
        os.makedirs(attachments_dir, exist_ok=True)
        filepath = os.path.join(attachments_dir, "test.txt")
        with open(filepath, "wb") as f:
            f.write(b"attachment content")

        att = EmailAttachment.objects.create(email=email, filename="test.txt", file=filepath)
        self.assertEqual(att.email.id, email.id)
        self.assertTrue(os.path.exists(att.file.path if hasattr(att.file, 'path') else att.file))
