from django.contrib.auth import get_user_model
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from users.models import KycDocument, KycApplication

User = get_user_model()


@override_settings(STATICFILES_STORAGE='django.contrib.staticfiles.storage.StaticFilesStorage')
class KycAdminTest(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="pass")
        self.user = User.objects.create_user(username="user", email="user@example.com", password="pass")
        self.client = Client()
        self.client.login(email="admin@example.com", password="pass")

        # create pending document
        self.doc = KycDocument.objects.create(
            user=self.user,
            document_type="passport",
            document_file="docs/fake.pdf",
            status="pending",
        )

    def test_approve_action_url(self):
        url = reverse("admin:users_kycdocument_approve", args=[self.doc.pk])
        resp = self.client.get(url)
        # should redirect back
        self.assertEqual(resp.status_code, 302)
        self.doc.refresh_from_db()
        self.assertEqual(self.doc.status, "approved")

    def test_reject_action_form(self):
        url = reverse("admin:users_kycdocument_reject", args=[self.doc.pk])
        resp = self.client.get(url)
        self.assertContains(resp, "Please provide a reason")
        resp2 = self.client.post(url, {"reason": "blurry"})
        self.assertEqual(resp2.status_code, 302)
        self.doc.refresh_from_db()
        self.assertEqual(self.doc.status, "rejected")
        self.assertEqual(self.doc.rejection_reason, "blurry")

    def test_bulk_actions(self):
        # create another pending
        doc2 = KycDocument.objects.create(
            user=self.user,
            document_type="national_id",
            document_file="docs/fake2.pdf",
            status="pending",
        )
        changelist = reverse("admin:users_kycdocument_changelist")
        # approve selected
        resp = self.client.post(changelist, {"action": "approve_selected", "_selected_action": [self.doc.pk, doc2.pk]})
        self.assertEqual(resp.status_code, 302)
        self.doc.refresh_from_db()
        doc2.refresh_from_db()
        self.assertEqual(self.doc.status, "approved")
        self.assertEqual(doc2.status, "approved")

        # reject selected (none pending now, but exercise airflow)
        resp = self.client.post(changelist, {"action": "reject_selected", "_selected_action": [self.doc.pk]})
        self.assertEqual(resp.status_code, 302)

