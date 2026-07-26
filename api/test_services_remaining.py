from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from transactions.services import (
    approve_transaction,
    create_transaction,
)
from users.models import UserWallet


class TransactionServiceRemainingTests(TestCase):
    """Remaining branch coverage for transaction service functions."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="remain_user",
            email="remain_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="remain_admin",
            email="remain_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def test_create_transaction_zero_amount(self):
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="deposit",
                amount=Decimal("0.00"),
                reference="ZERO-AMT",
            )

    def test_create_transaction_negative_amount(self):
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="deposit",
                amount=Decimal("-10.00"),
                reference="NEG-AMT",
            )

    def test_approve_with_insufficient_funds_at_time_of_approval(self):
        # User gets deposit approved giving balance 300
        dep = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("300.00"),
            reference="BAL-DEP",
        )
        approve_transaction(dep, self.admin, notes="Seed balance")
        # Create withdrawal that *was* valid when requested (250)
        wdr = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=Decimal("250.00"),
            reference="WDR-PENDING",
        )
        # Simulate balance change: mimic another withdrawal reducing funds
        wallet = UserWallet.objects.get(user=self.user)
        wallet.balance = Decimal("100.00")  # Now insufficient for 250
        wallet.save(update_fields=["balance", "updated_at"])
        with self.assertRaises(ValidationError):
            approve_transaction(
                wdr,
                self.admin,
                notes="Should fail insufficient funds",
            )

    def test_wallet_recreation_on_approval_if_missing(self):
        dep = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("180.00"),
            reference="RECREATE-DEP",
        )
        # Delete wallet to force except path in approve_transaction
        wallet = UserWallet.objects.get(user=self.user)
        wallet.delete()
        self.assertFalse(UserWallet.objects.filter(user=self.user).exists())
        approve_transaction(dep, self.admin, notes="Recreate wallet")
        recreated = UserWallet.objects.get(user=self.user)
        self.assertEqual(recreated.balance, Decimal("180.00"))

    def test_crypto_deposit_without_hash_branch(self):
        txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("50.00"),
            reference="CRYPTO-NOHASH",
            payment_method="BTC",
            tx_hash="",  # no hash triggers alternate formatting branch
        )
        self.assertEqual(txn.payment_method, "BTC")
        self.assertEqual(txn.tx_hash, "")
        # Approve so deposit branch runs
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        pre_balance = wallet.balance
        approve_transaction(txn, self.admin, notes="Approve crypto no hash")
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, pre_balance + Decimal("50.00"))
