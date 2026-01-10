"""Registration email diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB/email side effects during CI.
"""

import os

import pytest
import django
from django.contrib.auth import get_user_model

from core.email_service import EmailService

if os.environ.get("RUN_MANUAL_EMAIL_TESTS") != "1":
    pytest.skip("Registration email diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run", allow_module_level=True)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")

django.setup()

pytestmark = pytest.mark.django_db


def test_registration_email_diagnostic():
    User = get_user_model()
    test_user = User.objects.first()
    if not test_user:
        pytest.skip("No users available for registration email diagnostic")

    result = EmailService.send_welcome_email(test_user)
    assert result is not None
