from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from users.models import UserNotification
from django.utils import timezone


class NotificationViewsTests(TestCase):
	def setUp(self):
		User = get_user_model()
		self.user = User.objects.create_user(username='notifuser', email='notifuser@example.com', password='pass12345')
		# A welcome notification may have been created by signals; capture baseline
		self.initial_unread = UserNotification.objects.filter(user=self.user, is_read=False).count()
		# Create sample notifications
		self.n1 = UserNotification.objects.create(
			user=self.user,
			notification_type='system_alert',
			title='Alert 1',
			message='Message 1'
		)
		self.n2 = UserNotification.objects.create(
			user=self.user,
			notification_type='system_alert',
			title='Alert 2',
			message='Message 2'
		)
		self.client.login(username='notifuser', password='pass12345')

	def test_mark_notification_read(self):
		url = reverse('mark_notification_read', args=[self.n1.id])
		resp = self.client.post(url)
		self.assertEqual(resp.status_code, 200)
		self.n1.refresh_from_db()
		self.assertTrue(self.n1.is_read)

	def test_mark_all_read(self):
		url = reverse('mark_all_read')
		resp = self.client.post(url)
		self.assertEqual(resp.status_code, 200)
		self.n1.refresh_from_db(); self.n2.refresh_from_db()
		self.assertTrue(self.n1.is_read and self.n2.is_read)

	def test_unread_count(self):
		url = reverse('unread_count')
		resp = self.client.get(url)
		self.assertEqual(resp.status_code, 200)
		data = resp.json()
		# Expect initial welcome (if any) plus the two we added
		self.assertEqual(data['count'], self.initial_unread + 2)
from django.test import TestCase

# Create your tests here.
