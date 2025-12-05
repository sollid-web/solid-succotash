from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from transactions.services import approve_transaction, create_transaction
from users.models import UserWallet


class TransactionServiceEdgeCaseTests(TestCase):
    """Edge case coverage for create/approve paths."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="edge_user",
            email="edge_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="edge_admin",
            email="edge_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def test_insufficient_withdrawal_funds(self):
        # Wallet empty -> withdrawal should fail
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="withdrawal",
                amount=Decimal("50.00"),
                reference="WDR-FAIL-1",
            )

    def test_invalid_transaction_type(self):
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="bonus",  # invalid type
                amount=Decimal("10.00"),
                reference="INV-TYPE-1",
            )

    def test_crypto_deposit_includes_hash_path(self):
        txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("123.45"),
            reference="CRYPTO-1",
            payment_method="BTC",
            tx_hash="abcdef1234567890",
        )
        self.assertEqual(txn.payment_method, "BTC")
        self.assertTrue(txn.tx_hash.startswith("abcdef"))
        # Approve to exercise approval branch for deposit
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        self.assertEqual(wallet.balance, Decimal("0.00"))
        approve_transaction(txn, self.admin, notes="Crypto approve")
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("123.45"))
