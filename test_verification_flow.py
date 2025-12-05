"""
Test script to verify the email verification flow
"""
import os

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.contrib.auth import get_user_model

from users.verification import EmailVerification, issue_verification_token, verify_token

User = get_user_model()

def test_verification_flow():
    print("=== Email Verification Flow Test ===\n")

    # Clean up any existing test user
    User.objects.filter(email="testverify@example.com").delete()

    # 1. Create test user (like signup does)
    print("1. Creating test user...")
    user = User.objects.create_user(
        username="testverify@example.com",
        email="testverify@example.com",
        password="testpass123",
        is_active=False
    )
    print(f"   ✓ User created: {user.email} (is_active={user.is_active})\n")

    # 2. Issue verification token (like signup does)
    print("2. Issuing verification token...")
    try:
        ev = issue_verification_token(user)
        print(f"   ✓ Token generated: {ev.token[:20]}...")
        print(f"   ✓ Expires at: {ev.expires_at}")
        print(f"   ✓ URL would be: https://wolvcapital.com/accounts/verify-email?token={ev.token}\n")
    except Exception as e:
        print(f"   ✗ Failed to issue token: {e}\n")
        return

    # 3. Check database
    print("3. Checking database...")
    total = EmailVerification.objects.count()
    user_verifications = EmailVerification.objects.filter(user=user)
    print(f"   ✓ Total verifications in DB: {total}")
    print(f"   ✓ Verifications for this user: {user_verifications.count()}\n")

    # 4. Test token verification
    print("4. Testing token verification...")
    result = verify_token(ev.token)
    if result:
        print("   ✓ Token verified successfully!")
        print(f"   ✓ Verification record: {result}")
        user.refresh_from_db()
        print(f"   ✓ User is now active: {user.is_active}\n")
    else:
        print("   ✗ Token verification failed!\n")

    # 5. Test with invalid token
    print("5. Testing with invalid token...")
    result = verify_token("invalid_token_12345")
    if result:
        print("   ✗ Invalid token was accepted (THIS IS BAD!)\n")
    else:
        print("   ✓ Invalid token correctly rejected\n")

    # 6. Test with already-used token
    print("6. Testing with already-used token...")
    result = verify_token(ev.token)
    if result:
        print("   ✗ Already-used token was accepted (THIS IS BAD!)\n")
    else:
        print("   ✓ Already-used token correctly rejected\n")

    print("=== Test Complete ===")
    print("\nTo test in browser:")
    print("1. Start Django server: python manage.py runserver")
    print(f"2. Open: http://localhost:8000/api/auth/verify-email/?token={ev.token}")
    print("   (Note: This will fail because token was already used above)")

if __name__ == "__main__":
    test_verification_flow()
