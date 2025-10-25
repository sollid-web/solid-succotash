#!/usr/bin/env python
import os
import sys

import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
django.setup()

from django.contrib.auth import get_user_model

from users.models import Profile

User = get_user_model()


def main():
    print("=== WOLVCAPITAL INVEST - Admin User Check ===\n")

    # Check for admin users
    admin_users = User.objects.filter(is_superuser=True)

    if admin_users.exists():
        print("📋 Existing Admin Users:")
        for i, user in enumerate(admin_users, 1):
            profile = getattr(user, "profile", None)
            role = profile.role if profile else "No profile"
            print(f"   {i}. Email: {user.email}")
            print(f"      Username: {user.username}")
            print(f"      Profile Role: {role}")
            print(f"      Active: {'Yes' if user.is_active else 'No'}")
            print(f"      Last Login: {user.last_login or 'Never'}")
            print()
    else:
        print("❌ No admin users found in the database.")

    print("\n🔧 Admin Password Options:")
    print("1. Reset password for existing admin")
    print("2. Create new superuser")
    print("3. Show admin login info")
    print("4. Exit")

    choice = input("\nEnter your choice (1-4): ").strip()

    if choice == "1":
        reset_admin_password()
    elif choice == "2":
        create_new_admin()
    elif choice == "3":
        show_login_info()
    elif choice == "4":
        print("Goodbye!")
    else:
        print("Invalid choice!")


def reset_admin_password():
    print("\n🔄 Reset Admin Password")
    email = input("Enter admin email: ").strip()

    try:
        user = User.objects.get(email=email, is_superuser=True)
        new_password = input("Enter new password: ").strip()
        user.set_password(new_password)
        user.save()
        print(f"✅ Password reset successfully for {email}")
        print(f"🔑 Login URL: http://localhost:8000/admin/")
        print(f"📧 Email: {email}")
        print(f"🔐 Password: {new_password}")
    except User.DoesNotExist:
        print(f"❌ No admin user found with email: {email}")


def create_new_admin():
    print("\n👤 Create New Admin User")
    email = input("Enter email: ").strip()
    password = input("Enter password: ").strip()

    if User.objects.filter(email=email).exists():
        print(f"❌ User with email {email} already exists!")
        return

    user = User.objects.create_superuser(
        username=email,
        email=email,
        password=password,  # Use email as username
    )

    # Create profile
    Profile.objects.create(user=user, role="admin", full_name=f"Admin User ({email})")

    print(f"✅ Admin user created successfully!")
    print(f"🔑 Login URL: http://localhost:8000/admin/")
    print(f"📧 Email: {email}")
    print(f"🔐 Password: {password}")


def show_login_info():
    print("\n🔑 Admin Login Information")
    print("🌐 Django Admin URL: http://localhost:8000/admin/")
    print("🌐 Main Site URL: http://localhost:8000/")
    print("📱 Dashboard URL: http://localhost:8000/dashboard/")

    admin_users = User.objects.filter(is_superuser=True, is_active=True)
    if admin_users.exists():
        print("\n📋 Available Admin Accounts:")
        for user in admin_users:
            print(f"   📧 Email: {user.email}")
            print(f"   👤 Username: {user.username}")
    else:
        print("\n❌ No active admin users found!")


if __name__ == "__main__":
    main()
