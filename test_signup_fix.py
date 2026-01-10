"""Signup flow diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB/test pollution in CI runs.
"""

import os
import json

import pytest
import django
from django.contrib.auth import get_user_model
from django.test import Client

if os.environ.get("RUN_MANUAL_EMAIL_TESTS") != "1":
    pytest.skip("Signup diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run", allow_module_level=True)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")

django.setup()

pytestmark = pytest.mark.django_db


def test_signup_flow_diagnostic():
    User = get_user_model()
    User.objects.filter(email="testsignup@example.com").delete()

    client = Client()
    response = client.post(
        "/api/auth/complete-signup/",
        data=json.dumps({"email": "testsignup@example.com", "password": "testpass12345"}),
        content_type="application/json",
    )

    assert response.status_code in {200, 201}, response.json()
    user = User.objects.filter(email="testsignup@example.com").first()
    assert user is not None

    response2 = client.post(
        "/api/auth/complete-signup/",
        data=json.dumps({"email": "testsignup@example.com", "password": "anotherpass123"}),
        content_type="application/json",
    )
    assert response2.status_code in {200, 400, 409}

    User.objects.filter(email="testsignup@example.com").delete()
