"""Manual email diagnostics.

Skipped by default to keep CI/tests clean. Enable with RUN_MANUAL_EMAIL_TESTS=1.
"""

import os
import datetime
from decimal import Decimal

import pytest
import django
from django.contrib.auth import get_user_model
from django.utils import timezone

from core.email_service import EmailService
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction

if os.environ.get("RUN_MANUAL_EMAIL_TESTS") != "1":
    pytest.skip("Manual email diagnostics skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run", allow_module_level=True)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")

django.setup()

pytestmark = pytest.mark.django_db


def test_manual_email_diagnostics():
    User = get_user_model()
    user = User.objects.first()
    assert user, "No users available for email diagnostics"

    # Welcome email
    EmailService.send_welcome_email(user)

    # Transaction emails
    txn = Transaction(
        user=user,
        tx_type="deposit",
        amount=Decimal("100.00"),
        status="approved",
        reference="Test deposit",
        created_at=timezone.now(),
    )
    EmailService.send_transaction_notification(txn, "approved", "Test approval")

    txn.status = "rejected"
    EmailService.send_transaction_notification(txn, "rejected", "Insufficient proof")

    plan = InvestmentPlan.objects.first()
    if not plan:
        pytest.skip("No investment plans to exercise investment email flows")

    inv = UserInvestment(
        user=user,
        plan=plan,
        amount=Decimal("1000.00"),
        status="approved",
        started_at=timezone.now(),
        ends_at=timezone.now() + datetime.timedelta(days=plan.duration_days),
    )
    EmailService.send_investment_notification(inv, "approved", "Investment activated")

    inv.status = "rejected"
    EmailService.send_investment_notification(inv, "rejected", "Insufficient funds")

    inv.status = "completed"
    inv.started_at = timezone.now() - datetime.timedelta(days=plan.duration_days)
    inv.ends_at = timezone.now()
    EmailService.send_investment_notification(inv, "completed", "")

    payout_amount = Decimal("15.00")
    EmailService.send_roi_payout_notification(user, payout_amount, inv, timezone.now().date())
