"""Manual contact-form/email script.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB and SMTP side effects in CI.
"""

import os
import unittest

from django.conf import settings
from django.core.mail import send_mail
from django.test import TestCase

from core.forms import ContactForm
from core.models import SupportRequest


RUN_MANUAL_EMAIL_TESTS = os.getenv("RUN_MANUAL_EMAIL_TESTS") == "1"


class ContactFormManualFlowDisabledTest(unittest.TestCase):
    @unittest.skipIf(RUN_MANUAL_EMAIL_TESTS, "Manual tests enabled")
    def test_contact_form_manual_flow_disabled(self):
        self.assertTrue(True)


@unittest.skipUnless(
    RUN_MANUAL_EMAIL_TESTS,
    "Manual contact email script skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run",
)
class ContactFormManualFlowTest(TestCase):
    def test_contact_form_manual_flow(self):
        form_data = {
            "full_name": "Test User",
            "contact_email": "testuser@example.com",
            "topic": "Test Support Request",
            "message": "This is a test message to verify the contact form functionality.",
        }

        form = ContactForm(data=form_data)
        self.assertTrue(form.is_valid())

        support_request = form.save_and_notify()
        self.assertEqual(support_request.contact_email, "testuser@example.com")

        send_mail(
            subject="[WolvCapital Test] Direct Email Test",
            message="This is a direct test email to verify SMTP configuration.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=getattr(settings, "ADMIN_EMAIL_RECIPIENTS", []) or ["admin@example.com"],
            fail_silently=False,
        )

        self.assertTrue(SupportRequest.objects.filter(pk=support_request.pk).exists())
