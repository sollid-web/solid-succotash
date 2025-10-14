from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from django.core.management import call_command
from django.utils import timezone
from .models import InvestmentPlan, UserInvestment, DailyRoiPayout
from users.models import UserWallet
from investments.services import create_investment, reject_investment
from django.core.exceptions import ValidationError


class DailyRoiPayoutTests(TestCase):
	def setUp(self):
		User = get_user_model()
		self.user = User.objects.create_user(
			username='roi_user',
			email='roi_user@example.com',
			password='testpass123'
		)
		# Create plan inline (avoid relying on seed command)
		self.plan = InvestmentPlan.objects.create(
			name='TempPlan',
			description='Temp',
			daily_roi=Decimal('1.00'),
			duration_days=14,
			min_amount=Decimal('100'),
			max_amount=Decimal('1000')
		)
		# Approved investment
		self.investment = UserInvestment.objects.create(
			user=self.user,
			plan=self.plan,
			amount=Decimal('500'),
			status='approved',
			started_at=timezone.now(),
			ends_at=timezone.now() + timezone.timedelta(days=14)
		)
		# Ensure wallet starts zero (auto-created)
		self.user.wallet.balance = Decimal('0.00')
		self.user.wallet.save(update_fields=['balance'])

	def test_daily_payout_idempotent(self):
		process_date = timezone.now().date().isoformat()
		call_command('payout_roi', date=process_date)
		# Because all financial operations require manual admin approval, the created
		# payout transaction(s) remain pending and wallet should not be auto-credited.
		self.user.wallet.refresh_from_db()
		self.assertEqual(self.user.wallet.balance, Decimal('0.00'))
		self.assertEqual(DailyRoiPayout.objects.filter(investment=self.investment).count(), 1)
		# Capture number of pending deposit transactions referencing ROI payout
		from transactions.models import Transaction
		txns = Transaction.objects.filter(user=self.user, tx_type='deposit', reference__contains='ROI payout')
		self.assertGreaterEqual(txns.count(), 1)
		first_txn_ids = list(txns.values_list('id', flat=True))

		# Second run should be idempotent: no new DailyRoiPayout and no new transactions
		call_command('payout_roi', date=process_date)
		self.assertEqual(DailyRoiPayout.objects.filter(investment=self.investment).count(), 1)
		txns_after = Transaction.objects.filter(user=self.user, tx_type='deposit', reference__contains='ROI payout')
		self.assertEqual(list(txns_after.values_list('id', flat=True)), first_txn_ids)


class InvestmentRejectionTests(TestCase):
	def setUp(self):
		User = get_user_model()
		self.user = User.objects.create_user(username='inv_reject_user', email='inv_reject@example.com', password='pass12345')
		self.admin = User.objects.create_user(username='inv_reject_admin', email='inv_reject_admin@example.com', password='pass12345', is_staff=True)
		self.plan = InvestmentPlan.objects.create(
			name='RejectPlan',
			description='Reject test',
			daily_roi=Decimal('1.00'),
			duration_days=14,
			min_amount=Decimal('100'),
			max_amount=Decimal('1000')
		)
		self.wallet = self.user.wallet
		self.wallet.balance = Decimal('500')
		self.wallet.save(update_fields=['balance'])

	def test_reject_investment(self):
		inv = create_investment(self.user, self.plan, 200)
		self.assertEqual(inv.status, 'pending')
		reject_investment(inv, self.admin, 'Docs missing')
		inv.refresh_from_db()
		self.assertEqual(inv.status, 'rejected')
		self.assertIsNone(inv.started_at)
		self.assertIsNone(inv.ends_at)

from django.test import TestCase

# Create your tests here.
