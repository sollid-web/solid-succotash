from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase

from investments.models import InvestmentPlan
from investments.services import (
    approve_investment,
    create_investment,
    reject_investment,
)
from referrals.models import Referral, ReferralCode, ReferralReward
from referrals.services import create_referral_if_code
from transactions.services import approve_transaction, create_transaction
from users.models import UserWallet

User = get_user_model()


class TestInvestmentAdminAlerts(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="investor",
            email="investor@example.com",
            password="pass123",
        )
        self.admin = User.objects.create_user(
            username="admin", email="admin@example.com", password="adminpass"
        )
        # Mark admin role
        self.admin.is_staff = True
        self.admin.save()
        self.admin.profile.role = "admin"
        self.admin.profile.save()

        # Ensure wallet exists and set sufficient balance
        wallet, _ = UserWallet.objects.get_or_create(user=self.user)
        wallet.balance = Decimal("5000")
        wallet.save(update_fields=["balance"])

        self.plan = InvestmentPlan.objects.create(
            name="Edge Plan",
            daily_roi=Decimal("1.25"),
            duration_days=21,
            min_amount=Decimal("100"),
            max_amount=Decimal("10000"),
        )
        mail.outbox.clear()

    def test_investment_approval_triggers_admin_alert_email(self):
        investment = create_investment(self.user, self.plan, 1000)
        approve_investment(investment, self.admin, notes="Reviewed docs")
        subjects = [m.subject for m in mail.outbox]
        assert any(
            "[ADMIN ALERT]" in s and "Investment Approved" in s
            for s in subjects
        ), subjects

    def test_investment_rejection_triggers_admin_alert_email(self):
        investment = create_investment(self.user, self.plan, 1000)
        reject_investment(investment, self.admin, notes="Mismatch info")
        subjects = [m.subject for m in mail.outbox]
        assert any(
            "[ADMIN ALERT]" in s and "Investment Rejected" in s
            for s in subjects
        ), subjects

    def test_high_value_investment_completion_triggers_admin_alert(self):
        # Amount above completion threshold (default 10000)
        high_amt = Decimal("10000")  # at threshold boundary
        # Fund wallet
        wallet = UserWallet.objects.get(user=self.user)
        wallet.balance = high_amt
        wallet.save()
        inv = create_investment(self.user, self.plan, float(high_amt))
        approve_investment(inv, self.admin, notes="Approved for test")

        # Simulate completion: directly send completion notification
        from core.email_service import EmailService
        EmailService.send_investment_notification(inv, "completed")

        subjects = [m.subject for m in mail.outbox]
        assert any(
            "[ADMIN ALERT]" in s and "High-Value Investment Completed" in s
            for s in subjects
        ), subjects

    def test_high_value_roi_payout_triggers_admin_alert(self):
        # Create large approved investment and simulate a large ROI payout
        wallet = UserWallet.objects.get(user=self.user)
        wallet.balance = Decimal("20000")
        wallet.save()
        inv = create_investment(self.user, self.plan, 8000)
        approve_investment(inv, self.admin, notes="Approved for ROI test")
        from core.email_service import EmailService
        EmailService.send_roi_payout_notification(
            self.user,
            Decimal("6000"),  # above default high_roi_payout threshold 5000
            inv,
            payout_date=None,
        )
        subjects = [m.subject for m in mail.outbox]
        assert any(
            "[ADMIN ALERT]" in s and "High ROI Payout" in s
            for s in subjects
        ), subjects


class TestReferralRewardEdgeCases(TestCase):
    def setUp(self):
        self.referrer = User.objects.create_user(
            username="referrer",
            email="referrer@example.com",
            password="refpass",
        )
        self.referred = User.objects.create_user(
            username="referred",
            email="referred@example.com",
            password="refdpass",
        )
        self.admin = User.objects.create_user(
            username="admin2",
            email="admin2@example.com",
            password="adminpass2",
        )
        self.admin.is_staff = True
        self.admin.save()
        self.admin.profile.role = "admin"
        self.admin.profile.save()

        # Create referral code and attach referral
        code = ReferralCode.objects.create(user=self.referrer)
        create_referral_if_code(self.referred, code.code)

        mail.outbox.clear()

    def test_referral_reward_below_threshold_no_admin_alert(self):
        # High deposit threshold defaults to 10000; use 9999 to stay below
        deposit_txn = create_transaction(
            user=self.referred,
            tx_type="deposit",
            amount=Decimal("9999"),
            reference="REF-DEPOSIT-EDGE",
            payment_method="bank_transfer",
        )
        approve_transaction(deposit_txn, self.admin, notes="Edge approval")

        # Referral reward should have been created
        referral = Referral.objects.filter(referred_user=self.referred).first()
        assert referral is not None, "Referral record missing"
        assert referral.reward_processed, "Referral not marked processed"
        assert ReferralReward.objects.filter(
            referral=referral
        ).exists(), "Reward not created"

        # No admin alert emails expected (below threshold)
        subjects = [m.subject for m in mail.outbox]
        assert not any("[ADMIN ALERT]" in s for s in subjects), subjects

        # Ensure user-level transaction creation emails exist (>=2)
        assert sum(
            "Transaction Submitted" in s for s in subjects
        ) >= 2, subjects


