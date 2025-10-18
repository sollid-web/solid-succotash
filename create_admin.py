import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
django.setup()

from django.contrib.auth import get_user_model

from users.models import Profile

User = get_user_model()

# Admin credentials
email = "admin@wolvcapital.com"
password = "WolvCapital2025!"

try:
    # Check if user exists
    if User.objects.filter(email=email).exists():
        user = User.objects.get(email=email)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"✅ Updated existing user: {email}")
    else:
        # Create new superuser
        user = User.objects.create_superuser(username=email, email=email, password=password)
        print(f"✅ Created new admin user: {email}")

    # Ensure profile exists
    profile, created = Profile.objects.get_or_create(
        user=user, defaults={"role": "admin", "full_name": "WOLVCAPITAL Admin"}
    )

    if not created:
        profile.role = "admin"
        profile.save()

    print("\n🔑 Your Admin Login Details:")
    print(f"📧 Email: {email}")
    print(f"🔐 Password: {password}")
    print(f"🌐 Django Admin URL: http://localhost:8000/admin/")
    print(f"🌐 Dashboard URL: http://localhost:8000/dashboard/")

except Exception as e:
    print(f"❌ Error: {e}")
