from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from users.models import Profile


class Command(BaseCommand):
    help = (
        "Create a placeholder user account (no email required), with optional password, "
        "and email notifications disabled. Useful when staging an account before importing figures."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            required=True,
            help="Username for the new user (required)",
        )
        parser.add_argument(
            "--email",
            default="",
            help="Email for the user (optional; default blank)",
        )
        parser.add_argument(
            "--password",
            default=None,
            help="Password for the user (optional). If omitted, sets an unusable password.",
        )
        parser.add_argument(
            "--active",
            action="store_true",
            help="Create the user as active (default: inactive)",
        )

    def handle(self, *args, **options):
        User = get_user_model()

        username = (options.get("username") or "").strip()
        email = (options.get("email") or "").strip()
        password = options.get("password")
        is_active = bool(options.get("active"))

        if not username:
            raise CommandError("--username is required")

        if User.objects.filter(username=username).exists():
            raise CommandError(f"User already exists with username: {username}")

        if email and User.objects.filter(email__iexact=email).exists():
            raise CommandError(f"User already exists with email: {email}")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password if password else None,
            is_active=is_active,
        )

        if not password:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        # Signals create Profile + Wallet automatically. Disable emails until ready.
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.email_notifications_enabled = False
        profile.email_verified = False
        profile.save(update_fields=["email_notifications_enabled", "email_verified"])

        self.stdout.write(
            self.style.SUCCESS(
                "Placeholder user created. "
                f"id={user.id} username={user.username} email={user.email or '(blank)'} active={user.is_active}"
            )
        )
        if not password:
            self.stdout.write(
                self.style.WARNING(
                    "Password is unusable. Set one later with `python manage.py changepassword <username>` "
                    "or re-run with --password."
                )
            )
