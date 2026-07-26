from django.core.management.base import BaseCommand

from core.services.wolv_token_announcement import (
    get_wolv_token_recipients,
    send_wolv_token_announcement,
)


class Command(BaseCommand):
    help = "Send the WOLV Token announcement email to eligible investors"

    def add_arguments(self, parser):
        parser.add_argument(
            "--test",
            type=str,
            help="Send the announcement to this address only",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show recipient list without sending messages",
        )

    def handle(self, *args, **options):
        test_email = options.get("test")
        dry_run = options.get("dry_run")

        recipients = get_wolv_token_recipients(test_email)

        self.stdout.write(f"📧 Found {len(recipients)} recipient(s)")

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN — no emails sent:"))
            for recipient in recipients:
                self.stdout.write(f"  → {recipient['email']}")
            return

        result = send_wolv_token_announcement(recipients)

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(f"✅ Done! Sent: {result['sent']} | Failed: {result['failed']}")
        )
