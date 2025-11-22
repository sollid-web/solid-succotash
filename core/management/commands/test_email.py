"""Management command to test email sending"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from core.email_service import EmailService

User = get_user_model()


class Command(BaseCommand):
    help = "Test email sending functionality"

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            default='test@example.com',
            help='Email address to send test to'
        )
        parser.add_argument(
            '--type',
            type=str,
            default='config',
            choices=['config', 'welcome', 'transaction', 'all'],
            help='Type of test to run'
        )

    def handle(self, *args, **options):
        email = options['email']
        test_type = options['type']

        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('WOLVCAPITAL EMAIL SERVICE TEST'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))

        if test_type in ['config', 'all']:
            self.test_config()

        if test_type in ['welcome', 'all']:
            self.test_welcome_email(email)

        if test_type in ['transaction', 'all']:
            self.test_transaction_email(email)

        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('TEST COMPLETE'))
        self.stdout.write(self.style.SUCCESS('='*60 + '\n'))

    def test_config(self):
        """Display email configuration"""
        self.stdout.write(self.style.WARNING('\nEMAIL CONFIGURATION:'))
        self.stdout.write(self.style.WARNING('-'*60))
        self.stdout.write(f'EMAIL_BACKEND: {settings.EMAIL_BACKEND}')
        self.stdout.write(f'EMAIL_HOST: {getattr(settings, "EMAIL_HOST", "Not set")}')
        self.stdout.write(f'EMAIL_PORT: {getattr(settings, "EMAIL_PORT", "Not set")}')
        self.stdout.write(f'EMAIL_USE_TLS: {getattr(settings, "EMAIL_USE_TLS", "Not set")}')
        self.stdout.write(f'EMAIL_HOST_USER: {getattr(settings, "EMAIL_HOST_USER", "Not set")}')
        self.stdout.write(f'DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}')

        if 'console' in settings.EMAIL_BACKEND.lower():
            self.stdout.write(self.style.WARNING('\n⚠ Using console backend - emails will print to console'))
        elif 'filebased' in settings.EMAIL_BACKEND.lower():
            self.stdout.write(self.style.WARNING(f'\n⚠ Using file backend - emails saved to: {getattr(settings, "EMAIL_FILE_PATH", "not set")}'))

    def test_welcome_email(self, email):
        """Test welcome email"""
        self.stdout.write(self.style.WARNING('\n\nTESTING WELCOME EMAIL'))
        self.stdout.write(self.style.WARNING('-'*60))
        self.stdout.write(f'Recipient: {email}')

        # Create a mock user for testing
        try:
            # Try to get an actual user
            user = User.objects.filter(email=email).first()
            if not user:
                self.stdout.write(self.style.WARNING(f'No user found with email {email}, creating mock user'))
                # Create mock user object
                class MockUser:
                    def __init__(self, email):
                        self.email = email
                        self.username = email.split('@')[0]

                    def get_full_name(self):
                        return 'Test User'

                    class profile:
                        email_preferences = {}

                user = MockUser(email)

            result = EmailService.send_welcome_email(user)

            if result:
                self.stdout.write(self.style.SUCCESS('✓ Welcome email sent successfully!'))
            else:
                self.stdout.write(self.style.ERROR('✗ Email sending failed'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error: {e}'))
            import traceback
            self.stdout.write(traceback.format_exc())

    def test_transaction_email(self, email):
        """Test transaction notification"""
        self.stdout.write(self.style.WARNING('\n\nTESTING TRANSACTION EMAIL'))
        self.stdout.write(self.style.WARNING('-'*60))
        self.stdout.write(f'Recipient: {email}')

        try:
            # Create mock transaction object
            class MockTransaction:
                def __init__(self, email):
                    self.transaction_type = 'deposit'
                    self.amount = 1000.00
                    self.reference = 'TEST-12345'
                    self.created_at = None

                    class user:
                        def __init__(self, email):
                            self.email = email
                            self.username = email.split('@')[0]

                        def get_full_name(self):
                            return 'Test User'

                        class profile:
                            email_preferences = {}

                    self.user = user(email)

            transaction = MockTransaction(email)
            result = EmailService.send_transaction_notification(
                transaction,
                status='approved',
                admin_notes='Test approval'
            )

            if result:
                self.stdout.write(self.style.SUCCESS('✓ Transaction email sent successfully!'))
            else:
                self.stdout.write(self.style.ERROR('✗ Email sending failed'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error: {e}'))
            import traceback
            self.stdout.write(traceback.format_exc())
