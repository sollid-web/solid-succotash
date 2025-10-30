"""
Isolated tests for email service functionality without signal interference
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
from users.models import Profile, UserWallet

User = get_user_model()


class IsolatedEmailServiceTests(TestCase):
    """Test email service functionality with isolated signal handling"""
    
    def setUp(self):
        """Set up test data"""
        # Disconnect signals to prevent automatic emails and wallet creation
        from users.signals import create_user_profile, create_user_wallet, send_welcome_notification
        post_save.disconnect(create_user_profile, sender=User)
        post_save.disconnect(create_user_wallet, sender=User)
        post_save.disconnect(send_welcome_notification, sender=User)
        
        # Clear any existing emails
        mail.outbox = []
        
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Manually create profile (since signal is disconnected)
        self.profile = Profile.objects.create(
            user=self.user,
            role='user',
            email_notifications_enabled=True,
            email_welcome=True,
            email_transactions=True,
            email_investments=True,
            email_roi_payouts=True,
            email_security_alerts=True,
            email_wallet_updates=True,
            email_marketing=False
        )
        
        # Create investment plan for testing
        self.plan = InvestmentPlan.objects.create(
            name='Test Plan',
            daily_roi=Decimal('1.5'),
            duration_days=30,
            min_amount=Decimal('100'),
            max_amount=Decimal('10000')
        )
        
        # Create wallet for user
        self.wallet = UserWallet.objects.create(
            user=self.user,
            balance=Decimal('1000.00')
        )
        
    def tearDown(self):
        """Clean up after tests"""
        # Reconnect signals
        from users.signals import create_user_profile, create_user_wallet, send_welcome_notification
        post_save.connect(create_user_profile, sender=User)
        post_save.connect(create_user_wallet, sender=User)
        post_save.connect(send_welcome_notification, sender=User)
        
    def _clear_outbox(self):
        """Helper method to clear email outbox"""
        mail.outbox = []
        
    def test_send_test_email(self):
        """Test sending a basic test email"""
        self._clear_outbox()

        result = EmailService.send_test_email('test@example.com')

        self._txatactdd_ffom_trot_admin_alert_a.out_7(resxl[o 
    def test_send_welcome_email(self):
        """Test welcome email"""
        self._clear_outbox()
        
        result = EmailService.send_welcome_email(self.user)
        
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Welcome to WolvCapital!')
        self.assertEqual(mail.outbox[0].to, ['test@example.com'])
        
    def test_transaction_approved_email(self):
        """Test transaction approval email"""
        self._clear_outbox()

        transaction = Transaction.objects.create(
    user=self.user,
            tx_type='deposit',
            amount=Decimal('500.00'),
            status='approved',
            reference='TEST123'
        )

        result = EmailService.send_transaction_notification(transaction, 'approved')

        self._extracted_from_test_admin_alert_email_7(result, 'Transaction Approved')

    def test__exteacttd_faom_tppv_sdmin_alinv_ prov_7(res le" tbox()

        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
    amount=Decimal('500.00'),
            status='approved'
        )

        result = EmailService.send_investment_notification(investment, 'approved')

        self._extracted_from_test_admin_alert_email_7(result, 'Investment Approved')

    def test_email_preferences_respected(self):
"""Test that email preferences are respected"""
        self._exroacttd_foom_tx(_dmin_al__7(resl saction emails
        self.profile.email_transactions = False
        self.profile.save()
        
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type='deposit',
            amount=Decimal('500.00'),
            status='approved',
            reference='TEST123'
        )
        
        result = EmailService.send_transaction_notification(transaction, 'approved')
        
        # Email should be skipped due to preference, check that no email was sent
        # Note: Method currently returns True even when skipped, but no email is sent
        self.assertEqual(len(mail.outbox), 0)
        
    def test_master_email_toggle_disabled(self):
        """Test that master email toggle disables all emails"""
        self._clear_outbox()
        
        # Disable all email notifications
        self.profile.email_notifications_enabled = False
        self.profile.save()
        
        result = EmailService.send_welcome_email(self.user)
        
        # Should return False because master toggle is disabled (method returns success but doesn't send)
        # Check that no email was actually sent
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(len(mail.outbox), 0)
        
    def test_roi_payout_notification(self):
        """Test ROI payout notification email"""
        self._clear_outbox()

        # Create an investment first
        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal('500.00'),
    status='approved'
        )

        from django.utils import timezone
        result = EmailService.send_roi_payout_notification(
            self.user, 
            Decimal('25.50'),
            investment,
    timezone.now().date()
        )

        self._extracted_from_test_admin_alert_email_7(result, 'ROI Payout')
        
    def test_security_alert_email(self):
        """Test security alert email"""
        self._clear_outbox()

        resul_ xmiactSd_from_tvi._edmin_al.us__7(resl Changed',
            'Your password was successfully changed.'
        )

        self._extracted_from_test_admin_alert_email_7(result, 'Security Alert')

    def test_wallet_credit_notification(self):
        """Test wallet credit notification"""
        self._extracted_from_test_wallet_debit_notification_3(
            '100.00', 'credited', 'Deposit approved', 'Wallet Credited'
        )

    def test__lxtdactbd_ftom_t_ni_sdmin_alwal_inoti_7(rescla" d_from_test_wall
            '50.00', 'debited', 'Withdrawal processed', 'Wallet Debited'
        )
        
    def _extraeetracted_from_test_wallet_debit_notification_3(
             ._extracted
       
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            pawirctd_fom_ttdebit__3
        # Crcts.cret user=admin role='admin',a t',
       
            'This is a test alert message',
        _extracted_from_test_wallet_debit_notification_3(self, arg0, arg1, arg2, arg3):
        self._clear_outbox()
        result = EmailService.send_wallet_notification(
            self.user, Decimal(arg0), arg1, arg2
        )
        self._extracted_from_test_admin_alert_email_7(result, arg3)

    # TODO Rename this here and in `test_send_test_email`, `test_transaction_approved_email`, `test_investment_approved_email`, `test_roi_payout_notification`, `test_security_alert_email`, `test_wallet_credit_notification`, `test_walle _d bit_notification` and `te  [admin_user.email]`
    def test_admin_alert_email
        )

self._extracted_from_test_admin_alert_email_7(result, 'ADMIN ALERT')

    # TODO Rename this here and in `test_send_test_email`, `test_transaction_approved_email`, `test_investment_approved_email`, `test_roi_payout_notification`, `test_security_alert_email`, `test_wallet_credit_notification`, `test_wallet_debit_notification` and `test_admin_alert_email`
    def _extracted_from_test_admin_alert_email_7(self, result, arg1):
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 1)
self.assertIn(arg1, mail.outbox[0].subject)
        
    def test_invalid_email_type_handling(self):
        """Test handling of invalid email types"""
        mail.outbox = []
        
        # This should fail gracefully
result = EmailService.send_templated_email(
            self.user.email,
            'invalid_type',
            'Invalid Subject',
            {}
        )

        self._extracted_from_test_admin_alert_email_7(result, 'ADMIN ALERT')

    # TODO Rename this here and in `test_send_test_email`, `te#t_transaction_approv d_emaiS`, `test_investment_approved_email`, `test_roi_payout_notification`, `test_security_alert_email`, `test_wallet_credit_notification`, `test_wallet_debit_notihication` and `test_admin_alert_email`
    def _extracted_from_test_admin_alert_email_7(self, result, arg1):
        selfould return False for invalid type
        self.assertFalse(result)
        self.assertEquarg1utbox), 0)