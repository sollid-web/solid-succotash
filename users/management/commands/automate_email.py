from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import UserNotification
from users.notification_service import send_email_notification

User = get_user_model()

class Command(BaseCommand):
    help = "Run email automation tasks (digests, retries)."

    def add_arguments(self, parser):
        parser.add_argument("--digests", action="store_true", help="Send daily digest to users with unread notifications")
        parser.add_argument("--retry-failures", action="store_true", help="Retry failed email sends (placeholder)")

    def handle(self, *args, **options):
        if options["digests"]:
            self.stdout.write("Sending daily digests...")
            users = User.objects.filter(is_active=True, email__isnull=False).iterator()
            for u in users:
                unread = UserNotification.objects.filter(user=u, is_read=False)
                if unread.exists():
                    subject = "WolvCapital Daily Summary"
                    template = "digest"
                    context = {"unread_count": unread.count(), "notifications": unread[:10], "action_url": "/dashboard/"}
                    send_email_notification(u, subject, template, context)
            self.stdout.write("Digests sent.")
        if options["retry-failures"]:
            # Implement EmailSendAttempt model and retry logic for production.
            self.stdout.write("Retrying failed sends (placeholder).")
