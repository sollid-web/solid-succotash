"""
Management command to send emails manually from the command line.

Usage:
    python manage.py send_email --to user@example.com --subject "Test" --message "Hello"
    python manage.py send_email --to-all-users --subject "Announcement" --message "Important update"
    python manage.py send_email --to-file emails.txt --subject "News" --message "Newsletter"
"""

from django.core.mail import send_mail
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
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    recipient_list=[email],
                    fail_silently=False,
                )
                success_count += 1
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
