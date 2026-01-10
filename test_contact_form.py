"""Contact form diagnostic.

Skipped unless RUN_MANUAL_EMAIL_TESTS=1 to avoid DB access during normal test runs.
"""

import os

import pytest
import django
from django.contrib.auth import get_user_model

from core.forms import ContactForm
from core.models import SupportRequest

if os.environ.get("RUN_MANUAL_EMAIL_TESTS") != "1":
    pytest.skip("Contact form diagnostic skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run", allow_module_level=True)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
os.environ.setdefault("DEBUG", "1")

django.setup()

pytestmark = pytest.mark.django_db


def test_contact_form_smoke():
    form_data = {
        "full_name": "Test User",
        "contact_email": "testuser@example.com",
        "topic": "Question about investments",
        "message": "I would like to know more about your investment plans and minimum deposit requirements.",
    }

    form = ContactForm(data=form_data)
    assert form.is_valid()
    instance = form.save(commit=False)
    instance.save()
    assert SupportRequest.objects.filter(pk=instance.pk).exists()


def test_contact_form_authenticated_user():
    User = get_user_model()
    user = User.objects.first()
    if not user:
        pytest.skip("No users available")

    form_data_user = {
        "full_name": user.get_full_name() or user.email,
        "contact_email": user.email,
        "topic": "Account inquiry",
        "message": "I have a question about my account balance.",
    }

    form_user = ContactForm(data=form_data_user)
    assert form_user.is_valid()
    instance_user = form_user.save(commit=False)
    instance_user.user = user
    instance_user.save()
    assert instance_user.user_id == user.id
