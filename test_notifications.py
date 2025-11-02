"""
Test script to demonstrate the notification system
Run this from Django shell: python manage.py shell < test_notifications.py
"""


from django.contrib.auth import get_user_model

from users.notification_service import *  # noqa: F401,F403 (script-style usage)

User = get_user_model()

# Wrap script execution so Django's test discovery importing this module does not run side-effects.
if __name__ == "__main__":
    print("=" * 60)
    print("WOLVCAPITAL NOTIFICATION SYSTEM TEST")
    print("=" * 60)

    # Get or create a test user
    user, created = User.objects.get_or_create(
        email="testuser@example.com",
        defaults={"username": "testuser", "first_name": "Test", "last_name": "User"},
    )

    if created:
        user.set_password("testpass123")
        user.save()
        print(f"\n✅ Created test user: {user.email}")
    else:
        print(f"\n✅ Using existing user: {user.email}")

    # Test 1: Welcome Notification
    print("\n" + "=" * 60)
    print("TEST 1: Welcome Notification")
    print("=" * 60)
    notify_welcome(user)
    print("✅ Welcome notification sent!")

    # Test 2: Wallet Credit Notification
    print("\n" + "=" * 60)
    print("TEST 2: Wallet Credit Notification")
    print("=" * 60)
    notify_wallet_credited(user, 1000.00, "Bonus credit for testing")
    print("✅ Wallet credit notification sent for $1,000.00")

    # Test 3: System Alert
    print("\n" + "=" * 60)
    print("TEST 3: System Alert Notification")
    print("=" * 60)
    create_user_notification(
        user=user,
        notification_type="system_alert",
        title="Platform Upgrade",
        message="We are upgrading our servers tonight. Expect improved performance!",
        priority="high",
        expires_in_days=3,
    )
    print("✅ System alert notification sent!")

    # Get notifications
    print("\n" + "=" * 60)
    print("USER NOTIFICATIONS")
    print("=" * 60)
    notifications = get_user_notifications(user, limit=10)
    print(f"\nTotal notifications: {notifications.count()}")
    print(f"Unread notifications: {get_unread_count(user)}")

    print("\n📬 Recent Notifications:")
    print("-" * 60)
    for notif in notifications[:5]:
        status = "✅ READ" if notif.is_read else "🔴 UNREAD"
        print(f"\n{status} | {notif.priority.upper()} Priority")
        print(f"Title: {notif.title}")
        print(f"Type: {notif.get_notification_type_display()}")
        print(f"Created: {notif.created_at.strftime('%Y-%m-%d %H:%M')}")
        print(f"Message: {notif.message[:100]}...")

    # Test marking as read (avoid filtering after slicing by using base queryset again)
    base_qs = get_user_notifications(user)
    if first_unread := base_qs.filter(is_read=False).first():
        print("\n" + "=" * 60)
        print("TEST: Mark Notification as Read")
        print("=" * 60)
        mark_notification_read(first_unread.id, user)
        print(f"✅ Marked notification '{first_unread.title}' as read")
        print(f"Unread count now: {get_unread_count(user)}")

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print("\n📍 Next Steps:")
    print("1. Visit the Next.js frontend (default http://localhost:3000) to review notifications")
    print("2. Login with testuser@example.com / testpass123")
    print("3. Use the dashboard view in Next.js to confirm notification rendering")
    print("4. Test deposit/withdrawal approvals for automatic notifications via the API")
    print("\n" + "=" * 60)
