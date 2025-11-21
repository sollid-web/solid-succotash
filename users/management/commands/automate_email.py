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
            from django.core.validators import validate_email
            from django.core.exceptions import ValidationError

            batch_size = 1000
            seen_emails = set()
            qs = User.objects.filter(is_active=True, email__isnull=False).order_by('id')
            last_id = None
            while True:
                batch = qs
                if last_id is not None:
                    batch = batch.filter(id__gt=last_id)
                users = list(batch[:batch_size])
                if not users:
                    break
                for u in users:
                    last_id = u.id
                    email = u.email
                    if not email or email in seen_emails:
                        continue
                    try:
                        validate_email(email)
                    except ValidationError:
                        continue
                    seen_emails.add(email)
                    unread_list = list(UserNotification.objects.filter(user=u, is_read=False)[:10])
                    if unread_list:
                        subject = "WolvCapital Daily Summary"
                        template = "digest"
                        context = {"unread_count": len(unread_list), "notifications": unread_list, "action_url": "/dashboard/"}
                        send_email_notification(u, subject, template, context)
            self.stdout.write("Digests sent.")
        if options["retry-failures"]:
            # Implement EmailSendAttempt model and retry logic for production.
            self.stdout.write("Retrying failed sends (placeholder).")
