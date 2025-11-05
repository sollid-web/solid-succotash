"""
Check email configuration management command
"""

from django.core.management.base import BaseCommand
from django.conf import settings
from django.core import mail


class Command(BaseCommand):
    help = 'Check email configuration and settings'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Checking email configuration...\n")

        # Check email backend
        backend = getattr(settings, 'EMAIL_BACKEND', 'Not set')
        self.stdout.write(f"Email Backend: {backend}")

        # Check SMTP settings if not using console backend
        if 'console' not in backend.lower():
            host = getattr(settings, 'EMAIL_HOST', 'Not set')
            port = getattr(settings, 'EMAIL_PORT', 'Not set')
            use_tls = getattr(settings, 'EMAIL_USE_TLS', 'Not set')
            use_ssl = getattr(settings, 'EMAIL_USE_SSL', 'Not set')
            user = getattr(settings, 'EMAIL_HOST_USER', 'Not set')
            password = '***' if getattr(settings, 'EMAIL_HOST_PASSWORD', '') else 'Not set'

            self.stdout.write(f"SMTP Host: {host}")
            self.stdout.write(f"SMTP Port: {port}")
            self.stdout.write(f"Use TLS: {use_tls}")
            self.stdout.write(f"Use SSL: {use_ssl}")
            self.stdout.write(f"Host User: {user}")
            self.stdout.write(f"Host Password: {password}")

        # Check default from email
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not set')
        self.stdout.write(f"Default From Email: {from_email}")

        # Check site URL for email templates
        site_url = getattr(settings, 'SITE_URL', 'Not set')
        public_site_url = getattr(settings, 'PUBLIC_SITE_URL', 'Not set')
        self.stdout.write(f"Site URL (backend): {site_url}")
        self.stdout.write(f"Public Site URL (emails): {public_site_url}")

        # Test email connection
        self.stdout.write("\n🔗 Testing email connection...")
        try:
            connection = mail.get_connection()
            connection.open()
            self.stdout.write(
                self.style.SUCCESS("✅ Email connection successful")
            )
            connection.close()
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Email connection failed: {str(e)}")
            )

        # Check template directories
        self.stdout.write("\n📧 Checking email templates...")
        try:
            from django.template.loader import get_template
            
            templates_to_check = [
                'emails/base_email.html',
                'emails/welcome.html',
                'emails/transaction_approved.html',
                'emails/investment_approved.html',
                'emails/test_email.html'
            ]
            
            for template_name in templates_to_check:
                try:
                    get_template(template_name)
                    self.stdout.write(f"✅ {template_name}")
                except:
                    self.stdout.write(f"❌ {template_name} (missing)")
                    
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Template check failed: {str(e)}")
            )

        # Summary
        self.stdout.write("\n📋 Configuration Summary:")
        if 'console' in backend.lower():
            self.stdout.write(
                self.style.WARNING(
                    "⚠️  Using console email backend (development mode)"
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    "✅ Using SMTP email backend (production ready)"
                )
            )
        
        self.stdout.write(
            "\n💡 To send a test email, use: python manage.py send_test_email --to your@email.com"
        )