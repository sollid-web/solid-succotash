from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from transactions.services import create_transaction, approve_transaction
from users.models import UserWallet


class DoubleApprovalPreventionTests(TestCase):
    """Second approval attempt raises ValidationError; wallet unchanged."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="double_approve_user",
            email="double_approve_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="double_approve_admin",
            email="double_approve_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def test_second_approval_fails_and_wallet_static(self):
        txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("400.00"),
            reference="DBL-APP-1",
            payment_method="bank_transfer",
        )
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        self.assertEqual(wallet.balance, Decimal("0.00"))

        approve_transaction(txn, self.admin, notes="First approval")
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("400.00"))

        # Second approval attempt raises ValidationError; balance stays same
        with self.assertRaises(ValidationError):
            approve_transaction(txn, self.admin, notes="Second attempt")
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("400.00"))
