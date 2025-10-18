"""
Test login functionality
"""

from django.contrib.auth import authenticate, get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Test user authentication"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="User email")
        parser.add_argument("password", type=str, help="User password")

    def handle(self, *args, **options):
        email = options["email"]
        password = options["password"]

        self.stdout.write(self.style.SUCCESS(f"\n🔍 Testing login for: {email}\n"))

        # Check if user exists
        try:
            user = User.objects.get(email=email)
            self.stdout.write(self.style.SUCCESS(f"✓ User found in database"))
            self.stdout.write(f"  - Username: {user.username}")
            self.stdout.write(f"  - Email: {user.email}")
            self.stdout.write(f"  - Is active: {user.is_active}")
            self.stdout.write(f"  - Is staff: {user.is_staff}")
            self.stdout.write(f'  - Has profile: {hasattr(user, "profile")}')
            self.stdout.write(f'  - Has wallet: {hasattr(user, "wallet")}')
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"✗ User not found in database"))
            return

        # Test authentication
        self.stdout.write("\n🔐 Testing authentication...")
        auth_user = authenticate(username=email, password=password)

        if auth_user is not None:
            self.stdout.write(self.style.SUCCESS("✓ Authentication SUCCESSFUL"))
            self.stdout.write(self.style.SUCCESS(f"  User: {auth_user.email}"))
        else:
            self.stdout.write(self.style.ERROR("✗ Authentication FAILED"))
            self.stdout.write(self.style.ERROR("  Password is incorrect or user is not active"))

        self.stdout.write("")
