from decimal import Decimal

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import RequestFactory, TestCase

from transactions.admin import TransactionAdmin
from transactions.models import Transaction
from transactions.services import create_transaction
from users.models import UserWallet


class AdminEditAmountApprovalTests(TestCase):
    """Editing amount in admin before approval adjusts wallet."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="admin_edit_user",
            email="admin_edit_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="admin_edit_admin",
            email="admin_edit_admin@example.com",
            password="pass12345",
            is_staff=True,
            is_superuser=True,
        )
        self.factory = RequestFactory()

    def test_admin_edit_amount_prior_to_approval_updates_wallet(self):
        # Create pending deposit transaction (original amount 100.00)
        txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("100.00"),
            reference="ADM-EDIT-1",
            payment_method="bank_transfer",
        )

        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        self.assertEqual(wallet.balance, Decimal("0.00"))

        # Simulate admin editing amount and approving in one save
        admin_instance = TransactionAdmin(Transaction, admin.site)
        edited_obj = Transaction.objects.get(pk=txn.pk)
        edited_obj.amount = Decimal("250.00")
        edited_obj.reference = "ADM-EDIT-1 updated"
        edited_obj.status = "approved"
        edited_obj.notes = "Adjusted after verification"

        class StubForm:
            cleaned_data = {
                "amount": edited_obj.amount,
                "payment_method": edited_obj.payment_method,
                "reference": edited_obj.reference,
                "status": edited_obj.status,
                "tx_hash": edited_obj.tx_hash,
                "wallet_address_used": edited_obj.wallet_address_used,
                "notes": edited_obj.notes,
            }

        request = self.factory.post("/admin/transactions/transaction/")
        request.user = self.admin
        # Attach session and messages to request so admin messages API works
        from django.contrib.messages.storage.fallback import FallbackStorage
        from django.contrib.sessions.middleware import SessionMiddleware
        session_mw = SessionMiddleware(lambda r: None)
        session_mw.process_request(request)
        request.session.save()
        request._messages = FallbackStorage(request)
        admin_instance.save_model(request, edited_obj, StubForm(), change=True)

        wallet.refresh_from_db()
        self.assertEqual(
            wallet.balance,
            Decimal("250.00"),
            "Wallet should reflect edited deposit amount upon approval",
        )
