"""
Management command to send emails manually from the command line.

Usage:
    python manage.py send_email --to user@example.com --subject "Test" --message "Hello"
    python manage.py send_email --to-all-users --subject "Announcement" --message "Important update"
    python manage.py send_email --to-file emails.txt --subject "News" --message "Newsletter"
"""

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand

from users.models import User


class Command(BaseCommand):
    help = 'Send emails manually to users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--to',
            type=str,
            help='Single email address to send to'
        )
        parser.add_argument(
            '--to-all-users',
            action='store_true',
            help='Send to all active users'
        )
        parser.add_argument(
            '--to-file',
            type=str,
            help='Path to file containing email addresses (one per line)'
        )
        parser.add_argument(
            '--subject',
            type=str,
            required=True,
            help='Email subject'
        )
        parser.add_argument(
            '--message',
            type=str,
            required=True,
            help='Email message body'
        )
        parser.add_argument(
            '--from-email',
            type=str,
            default=None,
            help='From email address (optional, uses DEFAULT_FROM_EMAIL if not set)'
        )

    def handle(self, *args, **options):
        subject = options['subject']
        message = options['message']
        from_email = options['from_email']

        recipients = []

        # Determine recipients
        if options['to']:
            recipients = [options['to']]
            self.stdout.write(f"Sending to single recipient: {options['to']}")

        elif options['to_all_users']:
            recipients = list(User.objects.filter(is_active=True).values_list('email', flat=True))
            self.stdout.write(f"Sending to all {len(recipients)} active users")

        elif options['to_file']:
            try:
                with open(options['to_file']) as f:
                    recipients = [line.strip() for line in f if line.strip()]
                self.stdout.write(f"Loaded {len(recipients)} email(s) from {options['to_file']}")
            except FileNotFoundError:
                self.stdout.write(self.style.ERROR(f"File not found: {options['to_file']}"))
                return

        else:
            self.stdout.write(self.style.ERROR("Please specify recipients using --to, --to-all-users, or --to-file"))
            return

        if not recipients:
            self.stdout.write(self.style.WARNING("No recipients found"))
            return

        self.stdout.write("\nEmail configuration:")
        self.stdout.write(f"  EMAIL_BACKEND: {getattr(settings, 'EMAIL_BACKEND', '(not set)')}")
        self.stdout.write(f"  DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', '(not set)')}")

        if "console" in str(getattr(settings, "EMAIL_BACKEND", "")).lower():
            self.stdout.write(
                self.style.WARNING(
                    "⚠️ Console backend is active: emails will print to the terminal, not be delivered."
                )
            )

        # Confirm before sending
        self.stdout.write(self.style.WARNING(f"\nAbout to send email to {len(recipients)} recipient(s):"))
        self.stdout.write(f"Subject: {subject}")
        self.stdout.write(f"Message: {message[:100]}...")

        confirm = input("\nProceed? (yes/no): ")
        if confirm.lower() != 'yes':
            self.stdout.write(self.style.WARNING("Email sending cancelled"))
            return

        # Send emails
        success_count = 0
        failed = []

        for email in recipients:
            try:
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=message,
                    from_email=from_email or getattr(settings, 'DEFAULT_FROM_EMAIL', None),
                    to=[email],
                )
                msg.send(fail_silently=False)

                anymail_id = None
                anymail_status = getattr(msg, "anymail_status", None)
                if anymail_status is not None:
                    anymail_id = getattr(anymail_status, "message_id", None) or getattr(
                        anymail_status, "id", None
                    )
                    if not anymail_id:
                        recipients_status = getattr(anymail_status, "recipients", None)
                        if isinstance(recipients_status, dict):
                            rec = recipients_status.get(email)
                            if rec is not None:
                                anymail_id = getattr(rec, "message_id", None) or getattr(rec, "id", None)

                resend_id = getattr(msg, 'resend_id', None)
                if not resend_id:
                    headers = getattr(msg, 'extra_headers', None) or {}
                    if isinstance(headers, dict):
                        resend_id = headers.get('X-Resend-Id')

                success_count += 1
                if resend_id:
                    self.stdout.write(f"✓ Sent to {email} (Resend id: {resend_id})")
                elif anymail_id:
                    self.stdout.write(f"✓ Sent to {email} (Anymail message id: {anymail_id})")
                else:
                    self.stdout.write(f"✓ Sent to {email}")
            except Exception as e:
                failed.append((email, str(e)))
                self.stdout.write(self.style.ERROR(f"✗ Failed to send to {email}: {e}"))

        # Summary
        self.stdout.write(self.style.SUCCESS(f"\n✅ Successfully sent {success_count} email(s)"))

        if failed:
            self.stdout.write(self.style.ERROR(f"❌ Failed to send {len(failed)} email(s):"))
            for email, error in failed:
                self.stdout.write(f"  - {email}: {error}")
