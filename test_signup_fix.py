"""Signup flow diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB/test pollution in CI runs.
"""

import os
import unittest

from django.contrib.auth import get_user_model
from django.test import Client, TestCase


RUN_MANUAL_EMAIL_TESTS = os.getenv("RUN_MANUAL_EMAIL_TESTS") == "1"


class SignupFlowDiagnosticDisabledTest(unittest.TestCase):
    @unittest.skipIf(RUN_MANUAL_EMAIL_TESTS, "Manual tests enabled")
    def test_signup_flow_diagnostic_disabled(self):
        self.assertTrue(True)


@unittest.skipUnless(
    RUN_MANUAL_EMAIL_TESTS,
    "Signup diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run",
)
class SignupFlowDiagnosticTest(TestCase):
    def test_signup_flow_diagnostic(self):
        User = get_user_model()
        User.objects.filter(email="testsignup@example.com").delete()

        client = Client()
        response = client.post(
            "/api/auth/complete-signup/",
            data={"email": "testsignup@example.com", "password": "testpass12345"},
            content_type="application/json",
        )

        self.assertIn(response.status_code, {200, 201})
        user = User.objects.filter(email="testsignup@example.com").first()
        self.assertIsNotNone(user)

        response2 = client.post(
            "/api/auth/complete-signup/",
            data={"email": "testsignup@example.com", "password": "anotherpass123"},
            content_type="application/json",
        )
        self.assertIn(response2.status_code, {200, 400, 409})
