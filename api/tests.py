from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from investments.models import InvestmentPlan, UserInvestment


class PublicPlansAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        InvestmentPlan.objects.create(
            name="APIPlan",
            description="API",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )

    def test_list_plans_public(self):
        resp = self.client.get("/api/plans/")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)


class UserInvestmentsAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="api_user", email="api_user@example.com", password="pass12345"
        )
        self.other = User.objects.create_user(
            username="api_other", email="api_other@example.com", password="pass12345"
        )
        self.client = APIClient()
        self.plan = InvestmentPlan.objects.create(
            name="UserPlan",
            description="User",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        UserInvestment.objects.create(user=self.user, plan=self.plan, amount=Decimal("200"))
        UserInvestment.objects.create(user=self.other, plan=self.plan, amount=Decimal("300"))

    def test_user_sees_only_own_investments(self):
        self.client.login(username="api_user", password="pass12345")
        resp = self.client.get("/api/investments/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.json()), 1)


class AdminInvestmentsAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.admin = User.objects.create_user(
            username="api_admin",
            email="api_admin@example.com",
            password="pass12345",
            is_staff=True,
        )
        self.user = User.objects.create_user(
            username="api_norm", email="api_norm@example.com", password="pass12345"
        )
        self.client = APIClient()
        plan = InvestmentPlan.objects.create(
            name="AdminPlan",
            description="Admin",
            daily_roi=Decimal("1.00"),
            duration_days=14,
            min_amount=Decimal("100"),
            max_amount=Decimal("1000"),
        )
        UserInvestment.objects.create(user=self.user, plan=plan, amount=Decimal("150"))

    def test_admin_access(self):
        self.client.login(username="api_admin", password="pass12345")
        resp = self.client.get("/api/admin/investments/")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)

    def test_non_admin_forbidden(self):
        self.client.login(username="api_norm", password="pass12345")
        resp = self.client.get("/api/admin/investments/")
        self.assertNotEqual(resp.status_code, 200)


from django.test import TestCase

# Create your tests here.
