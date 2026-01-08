from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone

from investments.services import create_investment, reject_investment
from users.models import UserWallet

from .models import DailyRoiPayout, InvestmentPlan, UserInvestment


class DailyRoiPayoutTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="roi_user", email="roi_user@example.com", password="testpass123"
        )
        # Create plan inline (avoid relying on seed command)
        self.plan = InvestmentPlan.objects.create(
            name="TempPlan",
            description="Temp",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        # Approved investment
        self.investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal("500"),
            status="approved",
            started_at=timezone.now(),
            ends_at=timezone.now() + timezone.timedelta(days=14),
        )
        # Ensure wallet starts zero (auto-created)
        self.user.wallet.balance = Decimal("0.00")
        self.user.wallet.save(update_fields=["balance"])

    def test_daily_payout_idempotent(self):
        process_date = timezone.now().date().isoformat()
        call_command("payout_roi", date=process_date)
        # Because all financial operations require manual admin approval, the created
        # payout transaction(s) remain pending and wallet should not be auto-credited.
        self.user.wallet.refresh_from_db()
        self.assertEqual(self.user.wallet.balance, Decimal("0.00"))
        self.assertEqual(DailyRoiPayout.objects.filter(investment=self.investment).count(), 1)
        # Capture number of pending deposit transactions referencing ROI payout
        from transactions.models import Transaction

        txns = Transaction.objects.filter(
            user=self.user, tx_type="deposit", reference__contains="ROI payout"
        )
        self.assertGreaterEqual(txns.count(), 1)
        first_txn_ids = list(txns.values_list("id", flat=True))

        # Second run should be idempotent: no new DailyRoiPayout and no new transactions
        call_command("payout_roi", date=process_date)
        self.assertEqual(DailyRoiPayout.objects.filter(investment=self.investment).count(), 1)
        txns_after = Transaction.objects.filter(
            user=self.user, tx_type="deposit", reference__contains="ROI payout"
        )
        self.assertEqual(list(txns_after.values_list("id", flat=True)), first_txn_ids)

    def test_backfill_range_is_idempotent_and_capped_to_investment_window(self):
        # Force a stable window in the past so we can backfill deterministically.
        self.investment.started_at = timezone.datetime(2025, 12, 1, tzinfo=timezone.get_current_timezone())
        self.investment.ends_at = timezone.datetime(2025, 12, 15, tzinfo=timezone.get_current_timezone())
        self.investment.save(update_fields=["started_at", "ends_at"])

        # Backfill beyond the investment's end date; it should cap to 2025-12-14 inclusive.
        call_command(
            "payout_roi",
            start_date="2025-12-04",
            end_date="2025-12-20",
            no_emails=True,
        )

        payouts = DailyRoiPayout.objects.filter(investment=self.investment).order_by("payout_date")
        self.assertEqual(payouts.count(), 11)  # 2025-12-04 .. 2025-12-14 inclusive
        self.assertEqual(payouts.first().payout_date.isoformat(), "2025-12-04")
        self.assertEqual(payouts.last().payout_date.isoformat(), "2025-12-14")

        # Second run should not create duplicates.
        call_command(
            "payout_roi",
            start_date="2025-12-04",
            end_date="2025-12-20",
            no_emails=True,
        )
        self.assertEqual(DailyRoiPayout.objects.filter(investment=self.investment).count(), 11)

    @patch("investments.management.commands.payout_roi.EmailService.send_roi_payout_notification")
    def test_daily_payout_sends_email_notification(self, mock_send):
        process_date = timezone.now().date().isoformat()
        call_command("payout_roi", date=process_date)

        mock_send.assert_called_once()
        args, _ = mock_send.call_args
        self.assertEqual(args[0], self.user)
        self.assertEqual(args[1], Decimal("5.00"))  # 1% of 500
        self.assertEqual(args[2], self.investment)


class InvestmentRejectionTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="inv_reject_user",
            email="inv_reject@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="inv_reject_admin",
            email="inv_reject_admin@example.com",
            password="pass12345",
            is_staff=True,
        )
        self.plan = InvestmentPlan.objects.create(
            name="RejectPlan",
            description="Reject test",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        self.wallet = self.user.wallet
        self.wallet.balance = Decimal("500")
        self.wallet.save(update_fields=["balance"])

    def test_reject_investment(self):
        inv = create_investment(self.user, self.plan, 200)
        self.assertEqual(inv.status, "pending")
        reject_investment(inv, self.admin, "Docs missing")
        inv.refresh_from_db()
        self.assertEqual(inv.status, "rejected")
        self.assertIsNone(inv.started_at)
        self.assertIsNone(inv.ends_at)


from django.test import TestCase

# Create your tests here.
