from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone

from .models import Agreement


class AgreementModelTests(TestCase):
    def test_paragraph_splitting(self):
        body = "First paragraph.\n\nSecond paragraph after blank.\n\nThird."
        ag = Agreement.objects.create(
            title="Test Agreement",
            slug="test-agreement",
            version="1.0.0",
            body=body,
            effective_date=timezone.now().date(),
            is_active=True,
        )
        self.assertEqual(
            ag.paragraphs(),
            [
                "First paragraph.",
                "Second paragraph after blank.",
                "Third.",
            ],
        )


class AgreementPDFViewTests(TestCase):
    def setUp(self):
        User = get_user_model()
        # Custom user model still uses username for authentication
        self.user = User.objects.create_user(
            username="agreementuser", email="user@example.com", password="pass12345"
        )
        self.agreement = Agreement.objects.create(
            title="Terms",
            slug="terms-of-service",
            version="1.0.0",
            body="Para1.\n\nPara2.",
            effective_date=timezone.now().date(),
            is_active=True,
        )
        self.client = Client()

    def test_pdf_requires_auth(self):
        url = reverse("agreement_pdf", args=[self.agreement.pk])
        # Expect redirect to login since LoginRequiredMixin pattern not applied; we raise 404 manually
        resp = self.client.get(url, follow=True)
        # Since view raises Http404 for unauthenticated, final status should be 404
        self.assertEqual(resp.status_code, 404)


class AgreementAcceptanceViewTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="accuser", email="acc@example.com", password="pass12345"
        )
        self.agreement = Agreement.objects.create(
            title="Privacy Policy",
            slug="privacy-policy",
            version="1.0.0",
            body="A.\n\nB.",
            effective_date=timezone.now().date(),
            is_active=True,
        )
        self.client = Client()

    def test_view_requires_login(self):
        url = reverse("agreement_view", args=[self.agreement.pk])
        # Normalize expected redirect (could be 302 to login). Follow = False to capture initial.
        resp = self.client.get(url, follow=False)
        self.assertIn(resp.status_code, (301, 302))

    def test_accept_once(self):
        self.client.force_login(self.user)
        url = reverse("agreement_view", args=[self.agreement.pk])
        # Initial GET (no acceptance yet)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "I Agree")
        from .models import UserAgreementAcceptance

        self.assertFalse(
            UserAgreementAcceptance.objects.filter(
                user=self.user, agreement=self.agreement
            ).exists()
        )

        # POST to accept (idempotent creation)
        resp = self.client.post(url)
        self.assertIn(resp.status_code, (302, 301))  # redirect after acceptance
        self.assertTrue(
            UserAgreementAcceptance.objects.filter(
                user=self.user, agreement=self.agreement
            ).exists()
        )

        # GET again should show accepted notice and no button
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "You accepted this agreement")
        self.assertNotContains(resp, "I Agree")

        # Second POST should not create duplicate
        resp2 = self.client.post(url)
        self.assertIn(resp2.status_code, (302, 301))
        self.assertEqual(
            UserAgreementAcceptance.objects.filter(
                user=self.user, agreement=self.agreement
            ).count(),
            1,
        )

    def test_pdf_success(self):
        self.client.force_login(self.user)
        url = reverse("agreement_pdf", args=[self.agreement.pk])
        resp = self.client.get(url, follow=True)
        self.assertEqual(resp.status_code, 200)
        # Accept either real PDF or graceful text fallback if ReportLab not available
        self.assertIn(resp["Content-Type"], ["application/pdf", "text/plain"])

    def test_inactive_agreement_404(self):
        self.client.force_login(self.user)
        self.agreement.is_active = False
        self.agreement.save()
        url = reverse("agreement_pdf", args=[self.agreement.pk])
        resp = self.client.get(url, follow=True)
        self.assertEqual(resp.status_code, 404)


from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import Client, TestCase
from django.urls import reverse

from investments.models import InvestmentPlan, UserInvestment
from investments.services import (
    approve_investment,
    create_investment,
    reject_investment,
)
from transactions.models import AdminAuditLog, Transaction
from transactions.services import (
    approve_transaction,
    create_transaction,
    reject_transaction,
)
from users.models import Profile, UserWallet

User = get_user_model()


class UserModelTests(TestCase):
    def setUp(self):
        # Use distinct username per class to avoid any cross-test leakage assumptions
        self.user = User.objects.create_user(
            username="user_model_test",
            email="user_model@example.com",
            password="testpass123",
        )

    def test_profile_creation(self):
        """Profile should be auto-created by post_save signal"""
        self.assertTrue(hasattr(self.user, "profile"))
        self.assertEqual(self.user.profile.role, "user")

    def test_wallet_creation(self):
        """Wallet should be auto-created by post_save signal"""
        self.assertTrue(hasattr(self.user, "wallet"))
        self.assertEqual(self.user.wallet.balance, Decimal("0"))


class InvestmentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.plan = InvestmentPlan.objects.create(
            name="Test Plan",
            description="Test Description",
            daily_roi=Decimal("1.50"),
            duration_days=30,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        self.wallet = self.user.wallet
        self.wallet.balance = Decimal("1000")
        self.wallet.save(update_fields=["balance"])

    def test_investment_creation(self):
        """Test investment creation"""
        investment = UserInvestment.objects.create(
            user=self.user, plan=self.plan, amount=Decimal("500")
        )
        self.assertEqual(investment.user, self.user)
        self.assertEqual(investment.plan, self.plan)
        self.assertEqual(investment.amount, Decimal("500"))
        self.assertEqual(investment.status, "pending")

    def test_total_return_calculation(self):
        """Test total return calculation for approved investment"""
        investment = UserInvestment.objects.create(
            user=self.user, plan=self.plan, amount=Decimal("500")
        )
        roi_rate = self.plan.daily_roi / Decimal("100")
        expected_return = Decimal("500") * (
            Decimal("1") + roi_rate * Decimal(self.plan.duration_days)
        )
        self.assertEqual(investment.total_return, expected_return.quantize(Decimal("0.01")))


class TransactionModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            is_staff=True,
        )

    def test_transaction_creation(self):
        """Test transaction creation"""
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type="deposit",
            amount=Decimal("100"),
            reference="Test deposit",
        )
        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.tx_type, "deposit")
        self.assertEqual(transaction.amount, Decimal("100"))
        self.assertEqual(transaction.status, "pending")


class TransactionServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="tx_user", email="tx_user@example.com", password="testpass123"
        )
        self.admin_user = User.objects.create_user(
            username="tx_admin",
            email="tx_admin@example.com",
            password="adminpass123",
            is_staff=True,
        )
        # Wallet auto-created; set initial balance
        self.user.wallet.balance = Decimal("1000")
        self.user.wallet.save(update_fields=["balance"])
        self.wallet = self.user.wallet

    def test_approve_deposit(self):
        """Test deposit approval credits wallet"""
        transaction = create_transaction(
            user=self.user, tx_type="deposit", amount=100, reference="Test deposit"
        )

        initial_balance = self.wallet.balance
        approve_transaction(transaction, self.admin_user, "Approved test")

        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance, initial_balance + Decimal("100"))
        self.assertEqual(transaction.status, "approved")
        self.assertEqual(transaction.approved_by, self.admin_user)

    def test_approve_withdrawal_with_sufficient_funds(self):
        """Test withdrawal approval with sufficient funds"""
        transaction = create_transaction(
            user=self.user,
            tx_type="withdrawal",
            amount=500,
            reference="Test withdrawal",
        )

        initial_balance = self.wallet.balance
        approve_transaction(transaction, self.admin_user, "Approved test")

        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance, initial_balance - Decimal("500"))
        self.assertEqual(transaction.status, "approved")

    def test_approve_withdrawal_with_insufficient_funds(self):
        """Test withdrawal approval fails with insufficient funds"""
        with self.assertRaises(ValidationError):
            create_transaction(
                user=self.user,
                tx_type="withdrawal",
                amount=2000,  # More than wallet balance
                reference="Test withdrawal",
            )


class InvestmentServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            is_staff=True,
        )
        self.plan = InvestmentPlan.objects.create(
            name="Test Plan",
            description="Test Description",
            daily_roi=Decimal("1.50"),
            duration_days=30,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        self.wallet = self.user.wallet
        self.wallet.balance = Decimal("1000")
        self.wallet.save(update_fields=["balance"])

    def test_create_investment_within_limits(self):
        """Test investment creation within plan limits"""
        investment = create_investment(user=self.user, plan=self.plan, amount=500)
        self.assertEqual(investment.user, self.user)
        self.assertEqual(investment.plan, self.plan)
        self.assertEqual(investment.amount, Decimal("500"))
        self.assertEqual(investment.status, "pending")

    def test_create_investment_below_minimum(self):
        """Test investment creation fails below minimum"""
        with self.assertRaises(Exception):
            create_investment(
                user=self.user,
                plan=self.plan,
                amount=50,  # Below minimum of 100
            )

    def test_create_investment_above_maximum(self):
        """Test investment creation fails above maximum"""
        with self.assertRaises(Exception):
            create_investment(
                user=self.user,
                plan=self.plan,
                amount=1500,  # Above maximum of 1000
            )

    def test_approve_investment_sets_dates(self):
        """Test investment approval sets start and end dates"""
        investment = create_investment(user=self.user, plan=self.plan, amount=500)

        approve_investment(investment, self.admin_user, "Approved test")

        investment.refresh_from_db()
        self.assertEqual(investment.status, "approved")
        self.assertIsNotNone(investment.started_at)
        self.assertIsNotNone(investment.ends_at)
        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance, Decimal("500"))

    def test_approve_investment_requires_sufficient_wallet_balance(self):
        """Approval should fail if wallet funds drop before review"""
        # Create investment while funds are available
        self.wallet.balance = Decimal("200")
        self.wallet.save(update_fields=["balance"])
        investment = create_investment(user=self.user, plan=self.plan, amount=Decimal("150"))

        # Simulate other withdrawals reducing wallet prior to admin review
        self.wallet.balance = Decimal("50")
        self.wallet.save(update_fields=["balance"])

        with self.assertRaises(ValidationError):
            approve_investment(investment, self.admin_user, "Should fail due to balance")


class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def assertBaseStylesPresent(self, response):
        self.assertContains(response, 'href="/static/css/base.css"')
        self.assertContains(response, 'href="/static/css/brand.css"')

    def assertChatWidgetPresent(self, response, *, authenticated: bool):
        flag = "true" if authenticated else "false"
        self.assertContains(response, 'id="chat-widget"')
        self.assertContains(response, f'data-user-authenticated="{flag}"')

    def test_home_page(self):
        """Test home page loads"""
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "WolvCapital")
        self.assertBaseStylesPresent(response)


class DashboardTotalsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username="dashuser", email="dash@example.com", password="pass12345"
        )
        self.admin = get_user_model().objects.create_user(
            username="dashadmin",
            email="dashadmin@example.com",
            password="adminpass",
            is_staff=True,
        )

    def test_dashboard_totals_only_approved(self):
        # Create and approve a deposit (credits wallet)
        dep1 = create_transaction(user=self.user, tx_type="deposit", amount=200, reference="dep1")
        approve_transaction(dep1, self.admin, notes="ok")

        # Create and approve a withdrawal (debited from credited funds)
        wd1 = create_transaction(user=self.user, tx_type="withdrawal", amount=50, reference="wd1")
        approve_transaction(wd1, self.admin, notes="ok")

        # Create a pending deposit (should NOT count)
        create_transaction(user=self.user, tx_type="deposit", amount=75, reference="dep2")

        # Create and reject a withdrawal (should NOT count)
        wd2 = create_transaction(user=self.user, tx_type="withdrawal", amount=25, reference="wd2")
        from transactions.services import reject_transaction

        reject_transaction(wd2, self.admin, notes="no")

        # Login and load dashboard
        self.client.login(username="dashuser", password="pass12345")
        resp = self.client.get(reverse("dashboard"))
        self.assertEqual(resp.status_code, 200)

        # Validate context totals reflect only approved transactions
        self.assertIn("total_deposits", resp.context)
        self.assertIn("total_withdrawals", resp.context)
        self.assertEqual(resp.context["total_deposits"], Decimal("200"))
        self.assertEqual(resp.context["total_withdrawals"], Decimal("50"))


class ManagementCommandTests(TestCase):
    def test_seed_plans_command(self):
        """Test that seed_plans command creates plans"""
        from django.core.management import call_command

        # Ensure no plans exist initially
        InvestmentPlan.objects.all().delete()

        call_command("seed_plans")

        # Check that plans were created
        plans = InvestmentPlan.objects.all()
        self.assertEqual(plans.count(), 4)

        # Check specific plans
        pioneer = InvestmentPlan.objects.get(name="Pioneer")
        self.assertEqual(pioneer.daily_roi, Decimal("1.00"))
        self.assertEqual(pioneer.duration_days, 14)

        summit = InvestmentPlan.objects.get(name="Summit")
        self.assertEqual(summit.daily_roi, Decimal("2.00"))
        self.assertEqual(summit.duration_days, 45)

    def test_seed_agreements_command(self):
        from django.core.management import call_command

        from core.models import Agreement

        Agreement.objects.all().delete()
        call_command("seed_agreements")
        self.assertTrue(Agreement.objects.filter(slug="terms-of-service", is_active=True).exists())
        self.assertTrue(Agreement.objects.filter(slug="privacy-policy", is_active=True).exists())
        count_before = Agreement.objects.count()
        call_command("seed_agreements")
        self.assertEqual(Agreement.objects.count(), count_before)


class AgreementIntegrityTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(
            username="agreement_integrity",
            email="agreement_integrity@example.com",
            password="pass12345",
        )
        self.agreement = Agreement.objects.create(
            title="Integrity Terms",
            slug="integrity-terms",
            version="2.1.0",
            body="Line A.\n\nLine B.",
            effective_date=timezone.now().date(),
            is_active=True,
        )
        self.client = Client()
        self.client.force_login(self.user)

    def test_acceptance_hash_and_version(self):
        url = reverse("agreement_view", args=[self.agreement.pk])
        # Trigger acceptance
        resp = self.client.post(url)
        self.assertIn(resp.status_code, (301, 302))
        from .models import UserAgreementAcceptance

        acc = UserAgreementAcceptance.objects.get(user=self.user, agreement=self.agreement)
        import hashlib

        expected_hash = hashlib.sha256(self.agreement.body.encode("utf-8")).hexdigest()
        self.assertEqual(acc.agreement_hash, expected_hash)
        self.assertEqual(acc.agreement_version, self.agreement.version)


class HealthAndLoggingTests(TestCase):
    def test_health_endpoint(self):
        client = Client()
        resp = client.get(reverse("healthz"))
        self.assertEqual(resp.status_code, 200)
        self.assertJSONEqual(resp.content.decode(), {"status": "ok"})

    def test_request_id_header(self):
        # Ensure middleware assigns X-Request-ID header on any request
        client = Client()
        resp = client.get(reverse("home"))
        self.assertEqual(resp.status_code, 200)
        self.assertIn("X-Request-ID", resp.headers)
        self.assertTrue(len(resp.headers["X-Request-ID"]) > 10)


class PublicPagesSmokeTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_virtual_card_page_renders(self):
        resp = self.client.get(reverse("virtual_card"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "WolvCapital Virtual Visa")

    def test_plans_page_renders_with_plan(self):
        # Ensure at least one plan exists
        from decimal import Decimal

        from investments.models import InvestmentPlan

        plan = InvestmentPlan.objects.create(
            name="Smoke Pioneer",
            description="Smoke test plan",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("999"),
        )
        resp = self.client.get(reverse("plans"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, plan.name)
