"""Manual email diagnostics.

Skipped by default to keep CI/tests clean. Enable with RUN_MANUAL_EMAIL_TESTS=1.
"""Manual email diagnostics.

These are intentionally skipped in CI to avoid side effects.
Enable with RUN_MANUAL_EMAIL_TESTS=1.

Hard constraint: do not use pytest.skip at import time.
"""

import os
import unittest
from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from core.email_service import EmailService
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction


RUN_MANUAL_EMAIL_TESTS = os.getenv("RUN_MANUAL_EMAIL_TESTS") == "1"


class ManualEmailDiagnosticsDisabledTest(unittest.TestCase):
    @unittest.skipIf(RUN_MANUAL_EMAIL_TESTS, "Manual diagnostics enabled")
    def test_manual_email_diagnostics_disabled(self):
        self.assertTrue(True)


@unittest.skipUnless(
    RUN_MANUAL_EMAIL_TESTS,
    "Manual email diagnostics skipped; set RUN_MANUAL_EMAIL_TESTS=1 to run",
)
class ManualEmailDiagnosticsTest(TestCase):
    def test_manual_email_diagnostics(self):
        User = get_user_model()
        user = User.objects.first()
        self.assertIsNotNone(user, "No users available for email diagnostics")

        EmailService.send_welcome_email(user)

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
            self.skipTest("No investment plans to exercise investment email flows")

        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal("1000.00"),
            status="approved",
            started_at=timezone.now(),
            ends_at=timezone.now() + timedelta(days=plan.duration_days),
        )
        EmailService.send_investment_notification(inv, "approved", "Investment activated")

        inv.status = "rejected"
        EmailService.send_investment_notification(inv, "rejected", "Insufficient funds")

        inv.status = "completed"
        inv.started_at = timezone.now() - timedelta(days=plan.duration_days)
        inv.ends_at = timezone.now()
        EmailService.send_investment_notification(inv, "completed", "")

        payout_amount = Decimal("15.00")
        EmailService.send_roi_payout_notification(
            user,
            payout_amount,
            inv,
            timezone.now().date(),
        )
