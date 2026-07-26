"""
One-time trust email blast to all users.
USAGE: python manage.py send_trust_blast [--dry-run]
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from core.email_service import EmailService

User = get_user_model()

SUBJECT = "If you've been burned before, this is written for you."
TEMPLATE = "wolv_trust_email"

class Command(BaseCommand):
    help = "One-time trust email blast to all users"

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Preview without sending")

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False)
        users = User.objects.filter(is_active=True).order_by("date_joined")
        total = users.count()
        self.stdout.write(f"📧 Found {total} active user(s)")

        sent = failed = 0

        for user in users:
            if dry_run:
                self.stdout.write(f"  [DRY RUN] → {user.email}")
                sent += 1
                continue
            try:
                EmailService._send(
                    template_name=TEMPLATE,
                    to_emails=user.email,
                    context={"first_name": user.first_name or "Valued Investor"},
                    subject=SUBJECT,
                )
                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  ✅ {user.email}"))
            except Exception as e:
                failed += 1
                self.stderr.write(self.style.ERROR(f"  ❌ {user.email}: {e}"))

        self.stdout.write(f"\nDone — Sent: {sent} | Failed: {failed}")
