from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from users.models import Profile


class Command(BaseCommand):
    help = "Promote a user to admin role"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="Email address of the user to promote")

    def handle(self, *args, **options):
        email = options["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise CommandError(f'User with email "{email}" does not exist')

        profile, created = Profile.objects.get_or_create(user=user)

        if profile.role == "admin":
            self.stdout.write(self.style.WARNING(f"User {email} is already an admin"))
        else:
            profile.role = "admin"
            profile.save()

            # Also make them Django staff
            user.is_staff = True
            user.save()

            self.stdout.write(self.style.SUCCESS(f"Successfully promoted {email} to admin"))
