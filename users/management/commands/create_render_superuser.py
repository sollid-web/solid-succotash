import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from users.models import Profile


class Command(BaseCommand):
    help = (
        "Create or update a Django superuser using provided credentials and "
        "ensure the associated profile is marked as an admin. Designed for "
        "Render one-click setup workflows."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            dest="email",
            default=os.getenv("RENDER_SUPERUSER_EMAIL"),
            help="Email address for the superuser (default: RENDER_SUPERUSER_EMAIL)",
        )
        parser.add_argument(
            "--password",
            dest="password",
            default=os.getenv("RENDER_SUPERUSER_PASSWORD"),
            help="Password for the superuser (default: RENDER_SUPERUSER_PASSWORD)",
        )
        parser.add_argument(
            "--full-name",
            dest="full_name",
            default=os.getenv("RENDER_SUPERUSER_NAME", "Render Admin"),
            help="Full name to store on the profile (default: Render Admin)",
        )

    def handle(self, *args, **options):
        email = options.get("email")
        password = options.get("password")
        full_name = options.get("full_name")

        if not email:
            raise CommandError("No email supplied. Pass --email or set RENDER_SUPERUSER_EMAIL.")

        if not password:
            raise CommandError(
                "No password supplied. Pass --password or set RENDER_SUPERUSER_PASSWORD."
            )

        user_model = get_user_model()

        try:
            user, created = user_model.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "is_superuser": True,
                    "is_staff": True,
                },
            )

            if created:
                user.set_password(password)
                user.save()
                action = "created"
            else:
                # Only update existing users if they're not already superusers
                # or if we're in a clear bootstrap scenario
                if user.is_superuser and user.is_staff:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Superuser {email} already exists and has admin privileges. "
                            "Skipping password update to avoid overwriting existing account."
                        )
                    )
                    action = "skipped (already admin)"
                else:
                    user.set_password(password)
                    user.is_superuser = True
                    user.is_staff = True
                    user.save(update_fields=["password", "is_superuser", "is_staff"])
                    action = "promoted to admin"

            profile, profile_created = Profile.objects.get_or_create(
                user=user,
                defaults={
                    "role": "admin",
                    "full_name": full_name,
                },
            )

            if not profile_created:
                # ensure role and name are up to date without overwriting user customisations unnecessarily
                updates = {}
                if profile.role != "admin":
                    profile.role = "admin"
                    updates["role"] = "admin"
                if full_name and profile.full_name != full_name:
                    profile.full_name = full_name
                    updates["full_name"] = full_name
                if updates:
                    profile.save(update_fields=list(updates.keys()))

            self.stdout.write(self.style.SUCCESS(f"Superuser {action}: {email}"))
            self.stdout.write("\n🔐 Login details")
            self.stdout.write(f"  Email: {email}")
            self.stdout.write(f"  Password: {password}")
            self.stdout.write("\nUseful URLs")
            self.stdout.write("  Django Admin : /admin/")
            self.stdout.write("  Dashboard    : /dashboard/")
            self.stdout.write(
                "\nIf this command was executed on Render, share the credentials securely "
                "with the intended operators and rotate the password after first login."
            )

        except Exception as exc:  # pragma: no cover - defensive handling for deployment scripts
            raise CommandError(str(exc)) from exc
