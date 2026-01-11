"""Registration email diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB/email side effects during CI.
"""

import os
import unittest

from django.contrib.auth import get_user_model
from django.test import TestCase

from core.email_service import EmailService


RUN_MANUAL_EMAIL_TESTS = os.getenv("RUN_MANUAL_EMAIL_TESTS") == "1"


class RegistrationEmailDiagnosticDisabledTest(unittest.TestCase):
    @unittest.skipIf(RUN_MANUAL_EMAIL_TESTS, "Manual tests enabled")
    def test_registration_email_diagnostic_disabled(self):
        self.assertTrue(True)


@unittest.skipUnless(
    RUN_MANUAL_EMAIL_TESTS,
    "Registration email diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run",
)
class RegistrationEmailDiagnosticTest(TestCase):
    def test_registration_email_diagnostic(self):
        User = get_user_model()
        test_user = User.objects.create_user(
            username="registration_email_user",
            email="registration_email_user@example.com",
            password="pass12345",
        )

        result = EmailService.send_welcome_email(test_user)
        self.assertIsNotNone(result)
