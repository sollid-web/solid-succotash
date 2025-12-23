"""
Quick diagnostic script to test email and notification system
Run: python check_notifications.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from core.email_service import EmailService

User = get_user_model()

print("="*60)
print("EMAIL CONFIGURATION CHECK")
print("="*60)

print(f"\n📧 Email Settings:")
print(f"  DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print(f"  EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"  EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"  EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"  EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"  EMAIL_BACKEND: {settings.EMAIL_BACKEND}")

print(f"\n📨 EmailService Settings:")
print(f"  DEFAULT_FROM_EMAIL: {EmailService.DEFAULT_FROM_EMAIL}")
print(f"  BRAND_NAME: {EmailService.BRAND_NAME}")

print(f"\n👤 Testing User Email Preferences:")
test_users = User.objects.all()[:3]
for user in test_users:
    print(f"\n  User: {user.email}")
    if hasattr(user, 'profile'):
        print(f"    Has profile: ✓")
        print(f"    Email notifications enabled: {user.profile.email_notifications_enabled}")
        print(f"    Transaction emails: {user.profile.email_transactions}")
        print(f"    Investment emails: {user.profile.email_investments}")
        prefs = user.profile.email_preferences
        print(f"    Preferences keys: {list(prefs.keys())[:5]}...")
    else:
        print(f"    Has profile: ✗ (Profile not created)")

print("\n" + "="*60)
print("✅ Email system check complete!")
print("="*60)
