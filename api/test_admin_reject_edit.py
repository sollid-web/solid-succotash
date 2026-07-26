from decimal import Decimal

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

from transactions.admin import TransactionAdmin
from transactions.models import Transaction
from transactions.services import create_transaction
from users.models import UserWallet


class AdminEditAmountRejectionTests(TestCase):
    """Editing amount then rejecting must not mutate wallet balance."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="reject_edit_user",
            email="reject_edit_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="reject_edit_admin",
            email="reject_edit_admin@example.com",
            password="pass12345",
            is_staff=True,
            is_superuser=True,
        )
        self.factory = RequestFactory()

    def test_edit_amount_then_reject_keeps_wallet_unchanged(self):
        # Create pending deposit
        txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("400.00"),
            reference="REJ-EDIT-1",
            payment_method="bank_transfer",
        )
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        self.assertEqual(wallet.balance, Decimal("0.00"))

        # Simulate admin editing amount then rejecting
        admin_instance = TransactionAdmin(Transaction, admin.site)
        edited = Transaction.objects.get(pk=txn.pk)
        edited.amount = Decimal("999.99")  # edited; rejection should ignore for wallet
        edited.reference = "REJ-EDIT-1 updated"
        edited.status = "rejected"
        edited.notes = "Rejected after verification"

        class StubForm:
            cleaned_data = {
                "amount": edited.amount,
                "payment_method": edited.payment_method,
                "reference": edited.reference,
                "status": edited.status,
                "tx_hash": edited.tx_hash,
                "wallet_address_used": edited.wallet_address_used,
                "notes": edited.notes,
            }

        request = self.factory.post("/admin/transactions/transaction/")
        request.user = self.admin
        from django.contrib.messages.storage.fallback import FallbackStorage
        from django.contrib.sessions.middleware import SessionMiddleware
        smw = SessionMiddleware(lambda r: None)
        smw.process_request(request)
        request.session.save()
        request._messages = FallbackStorage(request)

        admin_instance.save_model(request, edited, StubForm(), change=True)

        # Wallet must remain unchanged because rejection never credits
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("0.00"))
        # Status rejected; edited amount persists for audit, wallet unchanged
        edited.refresh_from_db()
        self.assertEqual(edited.status, "rejected")
        self.assertEqual(edited.amount, Decimal("999.99"))
