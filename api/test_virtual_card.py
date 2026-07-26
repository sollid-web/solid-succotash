from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from transactions.services import create_transaction, create_virtual_card_request
from transactions.models import VirtualCard
from users.models import UserWallet


class VirtualCardTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="card_user",
            email="card_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="card_admin",
            email="card_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def test_create_card_request_defaults(self):
        card = create_virtual_card_request(self.user, 1000)
        self.assertIsInstance(card, VirtualCard)
        self.assertEqual(card.user, self.user)
        self.assertEqual(card.purchase_amount, Decimal("1000"))
        self.assertEqual(card.status, "pending")
        self.assertFalse(card.is_active)

    def test_withdrawal_requires_active_card(self):
        # give user some balance so wallet exists
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        wallet.balance = Decimal("500.00")
        wallet.save()

        # attempt withdrawal with no card
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="withdrawal",
                amount=Decimal("50.00"),
                reference="WDR-NOCARD",
            )

        # create card request and keep pending
        card = create_virtual_card_request(self.user, 1000)
        self.assertEqual(card.status, "pending")
        # wrong amount should be rejected
        with self.assertRaises(ValidationError):
            create_virtual_card_request(self.user, 500)
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="withdrawal",
                amount=Decimal("50.00"),
                reference="WDR-PENDING",
            )

        # activate card and retry
        card.status = "active"
        card.is_active = True
        card.save()

        txn = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=Decimal("50.00"),
            reference="WDR-ACTIVE",
        )
        self.assertEqual(txn.tx_type, "withdrawal")
        self.assertEqual(txn.amount, Decimal("50.00"))
