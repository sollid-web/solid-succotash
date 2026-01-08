from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from core.email_service import EmailService

User = get_user_model()


class Command(BaseCommand):
    help = "Send a branded 'account ready' email to a user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-email",
            required=True,
            help="Recipient user email address.",
        )
        parser.add_argument(
            "--dashboard-url",
            default="/dashboard/",
            help="Dashboard path (default: /dashboard/).",
        )
        parser.add_argument(
            "--login-url",
            default="/accounts/login/",
            help="Login path (default: /accounts/login/).",
        )
        parser.add_argument(
            "--password-reset-url",
            default="/accounts/password/reset/",
            help="Password reset path (default: /accounts/password/reset/).",
        )

    def handle(self, *args, **options):
        user_email: str = options["user_email"]
        dashboard_url: str = options["dashboard_url"]
        login_url: str = options["login_url"]
        password_reset_url: str = options["password_reset_url"]

        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist as exc:
            raise SystemExit(f"User not found: {user_email}") from exc

        ok = EmailService.send_account_ready_email(
            user,
            dashboard_url=dashboard_url,
            login_url=login_url,
            password_reset_url=password_reset_url,
        )

        if ok:
            self.stdout.write(self.style.SUCCESS(f"Account-ready email sent to {user_email}"))
        else:
            raise SystemExit("Failed to send account-ready email")
