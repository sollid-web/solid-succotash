from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import Client, TestCase
from django.urls import reverse

from transactions.services import (
    approve_transaction,
    create_transaction,
    reject_transaction,
)
from users.models import UserWallet

from .models import AdminAuditLog, Transaction


class TransactionServiceRejectionTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="txrejuser", email="txrej@example.com", password="pass12345"
        )
        self.admin = User.objects.create_user(
            username="txrejadmin",
            email="txrejadmin@example.com",
            password="pass12345",
            is_staff=True,
        )
        # Ensure wallet exists
        self.wallet = self.user.wallet
        self.wallet.balance = Decimal("500")
        self.wallet.save(update_fields=["balance"])

    def test_reject_deposit_no_wallet_change(self):
        txn = create_transaction(self.user, "deposit", 250, "Test deposit")
        bal_before = self.wallet.balance
        reject_transaction(txn, self.admin, "Not valid")
        self.wallet.refresh_from_db()
        txn.refresh_from_db()
        self.assertEqual(self.wallet.balance, bal_before)
        self.assertEqual(txn.status, "rejected")
        self.assertTrue(
            AdminAuditLog.objects.filter(entity_id=str(txn.id), action="reject").exists()
        )

    def test_reject_withdrawal_no_wallet_change(self):
        # Create a withdrawal request
        txn = create_transaction(self.user, "withdrawal", 100, "Test withdrawal")
        bal_before = self.wallet.balance
        reject_transaction(txn, self.admin, "Insufficient docs")
        self.wallet.refresh_from_db()
        txn.refresh_from_db()
        self.assertEqual(self.wallet.balance, bal_before)
        self.assertEqual(txn.status, "rejected")


class TransactionCreationValidationTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="txvaluser", email="txval@example.com", password="pass12345"
        )
        self.wallet = self.user.wallet
        self.wallet.balance = Decimal("300")
        self.wallet.save(update_fields=["balance"])

    def test_create_transaction_invalid_amount(self):
        with self.assertRaises(ValidationError):
            create_transaction(self.user, "deposit", 0, "Zero invalid")
        with self.assertRaises(ValidationError):
            create_transaction(self.user, "deposit", -10, "Negative invalid")

    def test_withdrawal_requires_sufficient_balance(self):
        self.wallet.balance = Decimal("50")
        self.wallet.save(update_fields=["balance"])
        with self.assertRaises(ValidationError):
            create_transaction(self.user, "withdrawal", Decimal("75"), "Too much")

    def test_approve_creates_audit_log(self):
        admin = get_user_model().objects.create_user(
            username="auditadmin",
            email="auditadmin@example.com",
            password="pass12345",
            is_staff=True,
        )
        txn = create_transaction(self.user, "deposit", 50, "Audit deposit")
        approve_transaction(txn, admin, "Looks good")
        self.assertTrue(
            AdminAuditLog.objects.filter(
                entity="transaction", entity_id=str(txn.id), action="approve"
            ).exists()
        )




# Template-based view tests removed - all transaction functionality now available via API
# See api/views.py for TransactionViewSet and api/tests.py for API tests
