"""Manual contact-form/email script.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB and SMTP side effects in CI.
"""

import os

import pytest
import django
from django.conf import settings
from django.core.mail import send_mail

from core.forms import ContactForm
from core.models import SupportRequest

if os.environ.get("RUN_MANUAL_EMAIL_TESTS") != "1":
    pytest.skip("Manual contact email script skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run", allow_module_level=True)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")

django.setup()

pytestmark = pytest.mark.django_db


def test_contact_form_manual_flow():
    form_data = {
        "full_name": "Test User",
        "contact_email": "testuser@example.com",
        "topic": "Test Support Request",
        "message": "This is a test message to verify the contact form functionality.",
    }

    form = ContactForm(data=form_data)
    assert form.is_valid()

    support_request = form.save_and_notify()
    assert support_request.contact_email == "testuser@example.com"

    send_mail(
        subject="[WolvCapital Test] Direct Email Test",
        message="This is a direct test email to verify SMTP configuration.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=settings.ADMIN_EMAIL_RECIPIENTS,
        fail_silently=False,
    )

    assert SupportRequest.objects.filter(pk=support_request.pk).exists()
