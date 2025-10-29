"""
Clean email tests without signal interference
"""

from decimal import Decimal
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings
from django.db.models.signals import post_save

from core.email_service import EmailService
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import Profile

User = get_user_model()


class CleanEmailServiceTests(TestCase):
    """Test email service functionality without signal interference"""
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Disconnect welcome email signal during tests
        try:
            from users.signals import send_welcome_email
            post_save.disconnect(send_welcome_email, sender=User)
        except:
            pass  # Signal might not be connected
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.admin = User.objects.create_user(
            username='adminuser',
            email='admin@example.com',
            password='adminpass123'
        )
        self.admin.profile.role = 'admin'
        self.admin.profile.save()
        
        # Create investment plan for testing
        self.plan = InvestmentPlan.objects.create(
            name='Test Plan',
            daily_roi=Decimal('1.5'),
            duration_days=30,
            min_amount=Decimal('100'),
            max_amount=Decimal('10000')
        )
        
        # Clear any emails from setup
        mail.outbox.clear()
        
    def test_send_test_email(self):
        """Test sending a basic test email"""
        result = EmailService.send_test_email('test@example.com')
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Test Email', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, ['test@example.com'])
        
    def test_send_welcome_email(self):
        """Test welcome email sending"""
        result = EmailService.send_welcome_email(self.user)
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Welcome', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn(self.user.email, mail.outbox[0].body)
        
    def test_send_transaction_notification_approved(self):
        """Test transaction approval email"""
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type='deposit',
            amount=Decimal('100.00'),
            payment_method='bank_transfer',
            reference='TEST-REF-001',
            status='approved'
        )
        
        result = EmailService.send_transaction_notification(
            transaction, 'approved', 'Test admin notes'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Transaction Approved', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$100.00', mail.outbox[0].body)
        self.assertIn('Test admin notes', mail.outbox[0].body)
        
    def test_send_transaction_notification_rejected(self):
        """Test transaction rejection email"""
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type='withdrawal',
            amount=Decimal('50.00'),
            payment_method='bank_transfer',
            reference='TEST-REF-002',
            status='rejected'
        )
        
        result = EmailService.send_transaction_notification(
            transaction, 'rejected', 'Insufficient verification'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Transaction Rejected', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$50.00', mail.outbox[0].body)
        self.assertIn('Insufficient verification', mail.outbox[0].body)
        
    def test_send_investment_notification_approved(self):
        """Test investment approval email"""
        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal('500.00'),
            status='approved'
        )
        
        result = EmailService.send_investment_notification(
            investment, 'approved', 'Investment verified'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Investment Approved', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$500.00', mail.outbox[0].body)
        self.assertIn('Investment verified', mail.outbox[0].body)
        
    def test_send_roi_payout_notification(self):
        """Test ROI payout notification email"""
        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal('1000.00'),
            status='approved'
        )
        
        from django.utils import timezone
        result = EmailService.send_roi_payout_notification(
            self.user, Decimal('15.00'), investment, timezone.now().date()
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('ROI Payout', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$15.00', mail.outbox[0].body)
        
    def test_send_wallet_notification_credited(self):
        """Test wallet credit notification"""
        result = EmailService.send_wallet_notification(
            self.user, Decimal('100.00'), 'credited', 'Deposit approved'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Wallet Credited', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$100.00', mail.outbox[0].body)
        
    def test_send_wallet_notification_debited(self):
        """Test wallet debit notification"""
        result = EmailService.send_wallet_notification(
            self.user, Decimal('50.00'), 'debited', 'Withdrawal processed'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Wallet Debited', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('$50.00', mail.outbox[0].body)
        
    def test_send_security_alert(self):
        """Test security alert email"""
        result = EmailService.send_security_alert(
            self.user, 'Password Changed', 'Your password was changed successfully.'
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Security Alert', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertIn('Password Changed', mail.outbox[0].body)
        
    def test_send_admin_alert(self):
        """Test admin alert email"""
        result = EmailService.send_admin_alert(
            'High Value Transaction', 'A transaction requires review.', [self.admin.email]
        )
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('[ADMIN ALERT]', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.admin.email])
        self.assertIn('A transaction requires review', mail.outbox[0].body)
        
    def test_email_preferences_respected(self):
        """Test that email preferences are respected"""
        # Disable all emails for user
        self.user.profile.email_notifications_enabled = False
        self.user.profile.save()
        
        result = EmailService.send_transaction_notification(
            Transaction.objects.create(
                user=self.user,
                tx_type='deposit',
                amount=Decimal('100.00'),
                payment_method='bank_transfer',
                reference='TEST-REF-003'
            ), 
            'approved'
        )
        
        # Should return True but not send email
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 0)
        
    def test_master_email_toggle_disabled(self):
        """Test that master email toggle disables all emails"""
        # Disable master email toggle
        self.user.profile.email_notifications_enabled = False
        self.user.profile.save()
        
        result = EmailService.send_welcome_email(self.user)
        
        # Should return True but not send email
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 0)
        
    def test_invalid_email_type_handling(self):
        """Test handling of invalid email types"""
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type='deposit',
            amount=Decimal('100.00'),
            payment_method='bank_transfer',
            reference='TEST-REF-004'
        )
        
        result = EmailService.send_transaction_notification(
            transaction, 'invalid_status'
        )
        
        # Should handle gracefully and not send email
        self.assertFalse(result)
        self.assertEqual(len(mail.outbox), 0)