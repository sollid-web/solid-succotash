from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from transactions.services import approve_transaction, create_transaction
from users.models import UserWallet


class WalletBalanceServiceTests(TestCase):
    """Service-layer tests for wallet balance updates on approval."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="wallet_user",
            email="wallet_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="wallet_admin",
            email="wallet_admin@example.com",
            password="pass12345",
            is_staff=True,
        )

    def test_wallet_updates_on_deposit_and_withdrawal_approval(self):
        # Initial wallet state
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        self.assertEqual(wallet.balance, Decimal("0.00"))

        # Create pending deposit
        deposit_txn = create_transaction(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("500.00"),
            reference="DEP-001",
            payment_method="bank_transfer",
        )
        wallet.refresh_from_db()
        self.assertEqual(
            wallet.balance,
            Decimal("0.00"),
            "Pending deposit must not affect balance",
        )

        # Approve deposit -> balance increments
        approve_transaction(
            deposit_txn,
            self.admin,
            notes="Service test approval",
        )
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("500.00"))

        # Create pending withdrawal (amount less than current balance)
        withdrawal_txn = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=Decimal("200.00"),
            reference="WDR-001",
            payment_method="bank_transfer",
        )
        wallet.refresh_from_db()
        self.assertEqual(
            wallet.balance,
            Decimal("500.00"),
            "Pending withdrawal must not affect balance",
        )

        # Approve withdrawal -> balance decrements
        approve_transaction(
            withdrawal_txn,
            self.admin,
            notes="Service test approval withdrawal",
        )
        wallet.refresh_from_db()
        self.assertEqual(wallet.balance, Decimal("300.00"))


class WalletBalanceAPITests(TestCase):
    """API tests ensuring wallet reflects only approved transactions."""

    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="wallet_api_user",
            email="wallet_api_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="wallet_api_admin",
            email="wallet_api_admin@example.com",
            password="pass12345",
            is_staff=True,
            is_superuser=True,
        )
        self.user_client = APIClient()
        self.admin_client = APIClient()
        self.user_client.login(
            username="wallet_api_user", password="pass12345"
        )
        self.admin_client.force_login(self.admin)

    def test_wallet_balance_after_admin_approves_deposit(self):
        # User creates deposit transaction (pending)
        resp_create = self.user_client.post(
            "/api/transactions/",
            {
                "tx_type": "deposit",
                "amount": "750.00",
                "reference": "API-DEP-01",
                "payment_method": "bank_transfer",
            },
            format="json",
        )
        self.assertEqual(resp_create.status_code, 201)
        txn_id = resp_create.json()["id"]

        # Wallet should still be 0
        resp_wallet_pending = self.user_client.get("/api/wallet/")
        self.assertEqual(resp_wallet_pending.status_code, 200)
        self.assertEqual(resp_wallet_pending.json()["balance"], "0.00")

        # Admin approves transaction
        resp_admin_approve = self.admin_client.patch(
            f"/api/admin/transactions/{txn_id}/",
            {"status": "approved"},
            format="json",
        )
        self.assertEqual(resp_admin_approve.status_code, 200)
        self.assertEqual(resp_admin_approve.json()["status"], "approved")

        # User fetches wallet again -> updated balance
        resp_wallet_post = self.user_client.get("/api/wallet/")
        self.assertEqual(resp_wallet_post.status_code, 200)
        self.assertEqual(resp_wallet_post.json()["balance"], "750.00")

    def test_wallet_balance_after_deposit_then_withdrawal(self):
        # Create and approve deposit
        resp_create = self.user_client.post(
            "/api/transactions/",
            {
                "tx_type": "deposit",
                "amount": "600.00",
                "reference": "API-DEP-02",
                "payment_method": "bank_transfer",
            },
            format="json",
        )
        self.assertEqual(resp_create.status_code, 201)
        dep_id = resp_create.json()["id"]
        self.admin_client.patch(
            f"/api/admin/transactions/{dep_id}/",
            {"status": "approved"},
            format="json",
        )

        # Create withdrawal
        resp_withdrawal = self.user_client.post(
            "/api/transactions/",
            {
                "tx_type": "withdrawal",
                "amount": "250.00",
                "reference": "API-WDR-01",
                "payment_method": "bank_transfer",
            },
            format="json",
        )
        self.assertEqual(resp_withdrawal.status_code, 201)
        wdr_id = resp_withdrawal.json()["id"]

        # Withdrawal pending: balance still 600.00
        resp_wallet_pending = self.user_client.get("/api/wallet/")
        self.assertEqual(resp_wallet_pending.json()["balance"], "600.00")

        # Approve withdrawal
        resp_admin_wdr = self.admin_client.patch(
            f"/api/admin/transactions/{wdr_id}/",
            {"status": "approved"},
            format="json",
        )
        self.assertEqual(resp_admin_wdr.status_code, 200)

        # Balance should now be 350.00
        resp_wallet_post = self.user_client.get("/api/wallet/")
        self.assertEqual(resp_wallet_post.json()["balance"], "350.00")
