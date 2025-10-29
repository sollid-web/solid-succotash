"""
Simple email functionality tests for WolvCapital
"""

from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase

from core.email_service import EmailService

User = get_user_model()


class SimpleEmailTests(TestCase):
    """Simple tests for email functionality without complex setup"""
    
    def test_send_test_email_works(self):
        """Test that test email can be sent"""
        result = EmailService.send_test_email('test@example.com')

        self.assertTrue(result)
        # Check that email was queued
        self.assertGreater(len(mail.outbox), 0)

        test_email = next(
            (email for email in mail.outbox if 'Test Email' in email.subject), None
        )
        self.assertIsNotNone(test_email)
        self.assertEqual(test_email.to, ['test@example.com'])
        
    def test_email_template_rendering(self):
        """Test that email templates render without errors"""
        # Create user without triggering signals
        user = User(username='testuser', email='test@example.com')
        
        # Test welcome email template rendering
        result = EmailService.send_welcome_email(user)
        self.assertTrue(result)
        
    def test_email_preferences_checking(self):
        """Test email preference checking logic"""
        # Create user with email preferences disabled
        user = User.objects.create_user(
            username='testuser', 
            email='test@example.com',
            password='testpass123'
        )

        # Disable transaction emails
        profile = user.profile
        profile.email_transactions = False
        profile.save()

        # Clear welcome email from user creation
        mail.outbox = []

        result = self._extracted_from_test_invalid_email_handling_19(user, 'approved')
        # Should return True (not an error) but no email sent
        self.assertTrue(result)
        self.assertEqual(len(mail.outbox), 0)
        
    def test_invalid_email_handling(self):
        """Test handling of invalid email operations"""
        user = User(username='testuser', email='test@example.com')

        result = self._extracted_from_test_invalid_email_handling_19(
            user, 'invalid_status'
        )
        self.assertFalse(result)

    # TODO Rename this here and in `test_email_preferences_checking` and `test_invalid_email_handling`
    def _extracted_from_test_invalid_email_handling_19(self, user, arg1):
        from transactions.models import Transaction
        transaction = Transaction(
            user=user,
            tx_type='deposit',
            amount=Decimal('100.00'),
            payment_method='bank_transfer',
            reference='TEST-REF-001',
            status='approved',
        )
        transaction.id = 'test-transaction-id'
        return EmailService.send_transaction_notification(transaction, arg1)


class EmailManagementCommandTests(TestCase):
    """Test email management commands"""
    
    def test_check_email_config_command(self):
        """Test that check_email_config command runs without errors"""
        from django.core.management import call_command
        from io import StringIO
        
        out = StringIO()
        call_command('check_email_config', stdout=out)
        
        output = out.getvalue()
        self.assertIn('Email Backend:', output)
        self.assertIn('Default From Email:', output)
        
    def test_send_test_email_command(self):
        """Test send_test_email command"""
        from django.core.management import call_command
        from io import StringIO
        
        out = StringIO()
        call_command('send_test_email', '--to', 'test@example.com', stdout=out)
        
        output = out.getvalue()
        self.assertIn('test email', output.lower())


class EmailTemplateTests(TestCase):
    """Test email template functionality"""
    
    def test_all_email_templates_exist(self):
        """Test that all required email templates exist"""
        from django.template.loader import get_template
        
        required_templates = [
            'emails/base_email.html',
            'emails/welcome.html',
            'emails/transaction_approved.html',
            'emails/transaction_rejected.html',
            'emails/transaction_created.html',
            'emails/investment_approved.html',
            'emails/investment_created.html',
            'emails/roi_payout.html',
            'emails/wallet_credited.html',
            'emails/wallet_debited.html',
            'emails/security_alert.html',
            'emails/admin_alert.html',
            'emails/test_email.html',
        ]
        
# sourcery skip: no-loop-in-tests
        for template_name in required_templates:
            try:
                template = get_template(template_name)
                self.assertIsNotNone(template)
            except Exception as e:
                self.fail(f"Template {template_name} failed to load: {str(e)}")
                
    def test_email_context_variables(self):
        """Test that email templates render with proper context"""
        from django.template.loader import render_to_string
        
        context = {
            'brand_name': 'WolvCapital',
            'current_year': 2025,
            'brand_config': {
                'name': 'WolvCapital',
                'tagline': 'Invest Smart, Grow Fast',
                'primary': '#2196F3',
            },
            'site_url': 'https://wolvcapital.com',
            'user': User(username='testuser', email='test@example.com'),
        }
        
        # Test welcome template rendering
        html_content = render_to_string('emails/welcome.html', context)
        self.assertIn('WolvCapital', html_content)
        self.assertIn('test@example.com', html_content)
        
        # Test that no template variables are unrendered
        self.assertNotIn('{{', html_content)
        self.assertNotIn('}}', html_content)