from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from transactions.models import AdminAuditLog
from transactions.services import (
    approve_transaction,
    create_transaction,
    reject_transaction,
)
from users.models import UserWallet


class TransactionInvariantsTests(TestCase):
    """High-level financial invariants for transaction workflows."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="inv_user",
            email="inv_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="inv_admin",
            email="inv_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def _wallet_balance(self) -> Decimal:
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        return wallet.balance

    def test_invariant_no_negative_balance(self):
        # Approve deposit -> balance increases
        dep = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("500.00"),
            reference="INV-DEP",
        )
        approve_transaction(dep, self.admin)
        self.assertEqual(self._wallet_balance(), Decimal("500.00"))

        # Create withdrawal less than balance -> approve
        wdr_ok = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=Decimal("200.00"),
            reference="INV-WDR-OK",
        )
        approve_transaction(wdr_ok, self.admin)
        self.assertEqual(self._wallet_balance(), Decimal("300.00"))

        # Attempt withdrawal larger than balance should raise validation error
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="withdrawal",
                amount=Decimal("400.00"),
                reference="INV-WDR-FAIL",
            )
        self.assertEqual(self._wallet_balance(), Decimal("300.00"))

        # Invariant: balance never negative
        self.assertGreaterEqual(self._wallet_balance(), Decimal("0.00"))

    def test_invariant_each_status_change_creates_single_audit_log(self):
        start_count = AdminAuditLog.objects.count()
        dep = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("150.00"),
            reference="INV-AUD-DEP",
        )
        approve_transaction(dep, self.admin, notes="Audit approve")
        after_approve = AdminAuditLog.objects.count()
        self.assertEqual(after_approve, start_count + 1)

        wdr = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=Decimal("50.00"),
            reference="INV-AUD-WDR",
        )
        reject_transaction(wdr, self.admin, notes="Audit reject")
        after_reject = AdminAuditLog.objects.count()
        self.assertEqual(after_reject, after_approve + 1)

        # Ensure audit log entries match actions
        last_two = list(
            AdminAuditLog.objects.order_by("-created_at")[:2]
        )
        actions = {log.action for log in last_two}
        self.assertIn("approve", actions)
        self.assertIn("reject", actions)
