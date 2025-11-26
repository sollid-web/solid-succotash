from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from core.models import SupportRequest
from investments.models import InvestmentPlan, UserInvestment
from users.models import UserNotification


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


class SupportRequestAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_support_request_requires_contact_email(self):
        resp = self.client.post("/api/support/", {"message": "Need assistance"}, format="json")
        self.assertEqual(resp.status_code, 400)

    def test_support_request_success(self):
        payload = {
            "message": "Unable to locate payout report",
            "contact_email": "investor@example.com",
            "topic": "reports",
        }
        resp = self.client.post("/api/support/", payload, format="json")
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertIn("reference", data)
        self.assertTrue(SupportRequest.objects.filter(pk=data["reference"]).exists())


class NotificationAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="notif_api_user", email="notif@example.com", password="pass12345"
        )
        self.other = User.objects.create_user(
            username="notif_api_other", email="notif_other@example.com", password="pass12345"
        )
        self.client = APIClient()
        UserNotification.objects.create(
            user=self.user,
            notification_type="system_alert",
            title="Alert",
            message="System upgraded",
        )
        self.notification = UserNotification.objects.create(
            user=self.user,
            notification_type="welcome",
            title="Welcome",
            message="Hello",
        )
        UserNotification.objects.create(
            user=self.other,
            notification_type="system_alert",
            title="Other",
            message="Hidden",
        )

    def test_list_notifications_scoped_to_user(self):
        self.client.login(username="notif_api_user", password="pass12345")
        resp = self.client.get("/api/notifications/")
        self.assertEqual(resp.status_code, 200)
        payload = resp.json()
        # User has 2 manually created notifications + 1 auto-created welcome notification
        self.assertEqual(len(payload), 3)
        # Verify only this user's notifications are returned (not 'other' user's)
        titles = [n["title"] for n in payload]
        self.assertIn("Alert", titles)
        self.assertIn("Welcome", titles)
        self.assertNotIn("Other", titles)

    def test_mark_read_via_api(self):
        self.client.login(username="notif_api_user", password="pass12345")
        resp = self.client.post(f"/api/notifications/{self.notification.pk}/mark-read/")
        self.assertEqual(resp.status_code, 200)
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.is_read)


class EmailPreferencesAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="prefs_user", email="prefs@example.com", password="pass12345"
        )
        self.client = APIClient()
        self.client.login(username="prefs_user", password="pass12345")

    def test_get_preferences(self):
        resp = self.client.get("/api/profile/email-preferences/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("email_notifications_enabled", data)

    def test_update_preferences(self):
        resp = self.client.patch(
            "/api/profile/email-preferences/",
            {"email_notifications_enabled": False, "email_security_alerts": False},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertFalse(data["email_notifications_enabled"])
        self.assertFalse(data["email_security_alerts"])


class KycPersonalInfoAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="kyc_user", email="kyc_user@example.com", password="pass12345"
        )
        self.client = APIClient()
        self.client.login(username="kyc_user", password="pass12345")

    def test_submit_personal_info_success(self):
        payload = {
            "first_name": "Jane",
            "last_name": "Doe",
            "date_of_birth": "1990-01-01",
            "nationality": "US",
            "address": "123 Main Street",
        }
        resp = self.client.post("/api/kyc/personal-info/", payload, format="json")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "pending")
        self.assertIn("personal_info_submitted_at", data)

    def test_submit_personal_info_missing_fields_returns_400(self):
        # Missing required fields should now yield a 400 (serializer validation) not a 500
        payload = {"first_name": "Only"}
        resp = self.client.post("/api/kyc/personal-info/", payload, format="json")
        self.assertEqual(resp.status_code, 400)
