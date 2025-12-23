"""
Test registration email delivery
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.conf import settings
from core.email_service import EmailService
from users.models import Profile

User = get_user_model()

print("\n" + "="*60)
print("REGISTRATION EMAIL DIAGNOSTIC")
print("="*60)

print("\n📧 Email Configuration:")
print(f"  EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"  DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print(f"  EMAIL_HOST: {getattr(settings, 'EMAIL_HOST', 'Not set')}")
print(f"  EMAIL_PORT: {getattr(settings, 'EMAIL_PORT', 'Not set')}")
print(f"  EMAIL_USE_TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Not set')}")
print(f"  EMAIL_HOST_USER: {getattr(settings, 'EMAIL_HOST_USER', 'Not set')}")

# Get a test user
test_user = User.objects.first()
if not test_user:
    print("\n❌ No users found in database")
    print("   Create a user first via signup")
else:
    print(f"\n👤 Test User: {test_user.email}")
    
    # Check profile
    if hasattr(test_user, 'profile'):
        print(f"   ✓ Profile exists")
        print(f"   email_notifications_enabled: {test_user.profile.email_notifications_enabled}")
        print(f"   email_welcome: {test_user.profile.email_welcome}")
        print(f"   full_name: {test_user.profile.full_name or '(not set)'}")
    else:
        print(f"   ✗ Profile missing!")
    
    # Test sending welcome email
    print(f"\n📤 Attempting to send welcome email...")
    try:
        result = EmailService.send_welcome_email(test_user)
        if result:
            print("   ✅ Email sent successfully!")
            print("\n   Check console output above for email content")
            print("   (Using console backend - emails print to terminal)")
        else:
            print("   ❌ Email send returned False")
            print("   Check user preferences or email configuration")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()

print("\n" + "="*60)
print("DIAGNOSTIC COMPLETE")
print("="*60 + "\n")
