"""Contact form diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB access during normal test runs.
"""

import os
import unittest

from django.contrib.auth import get_user_model
from django.test import TestCase

from core.forms import ContactForm
from core.models import SupportRequest


RUN_MANUAL_EMAIL_TESTS = os.getenv("RUN_MANUAL_EMAIL_TESTS") == "1"


class ContactFormDiagnosticDisabledTest(unittest.TestCase):
    @unittest.skipIf(RUN_MANUAL_EMAIL_TESTS, "Manual tests enabled")
    def test_contact_form_diagnostic_disabled(self):
        self.assertTrue(True)


@unittest.skipUnless(
    RUN_MANUAL_EMAIL_TESTS,
    "Contact form diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run",
)
class ContactFormDiagnosticTest(TestCase):
    def test_contact_form_smoke(self):
        form_data = {
            "full_name": "Test User",
            "contact_email": "testuser@example.com",
            "topic": "Question about investments",
            "message": "I would like to know more about your investment plans and minimum deposit requirements.",
        }

        form = ContactForm(data=form_data)
        self.assertTrue(form.is_valid())
        instance = form.save(commit=False)
        instance.save()
        self.assertTrue(SupportRequest.objects.filter(pk=instance.pk).exists())

    def test_contact_form_authenticated_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="contact_form_user",
            email="contact_form_user@example.com",
            password="pass12345",
        )

        form_data_user = {
            "full_name": user.get_full_name() or user.email,
            "contact_email": user.email,
            "topic": "Account inquiry",
            "message": "I have a question about my account balance.",
        }

        form_user = ContactForm(data=form_data_user)
        self.assertTrue(form_user.is_valid())
        instance_user = form_user.save(commit=False)
        instance_user.user = user
        instance_user.save()
        self.assertEqual(instance_user.user_id, user.id)
