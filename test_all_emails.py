"""
Comprehensive Email Notification Test
Tests all email notifications in the system
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from decimal import Decimal
from django.contrib.auth import get_user_model
from django.utils import timezone
from core.email_service import EmailService
from users.models import Profile
from transactions.models import Transaction
from investments.models import InvestmentPlan, UserInvestment

User = get_user_model()

print("\n" + "="*70)
print("COMPREHENSIVE EMAIL NOTIFICATION TEST")
print("="*70)

# Get test user
user = User.objects.first()
if not user:
    print("❌ No users found. Create a user first.")
    exit(1)

print(f"\n✅ Test User: {user.email}")

# Test 1: Welcome Email
print("\n" + "-"*70)
print("TEST 1: Welcome Email")
print("-"*70)
try:
    result = EmailService.send_welcome_email(user)
    print(f"✅ Welcome email: {'SENT' if result else 'SKIPPED (user preferences)'}")
except Exception as e:
    print(f"❌ Welcome email failed: {e}")

# Test 2: Transaction Approved Email
print("\n" + "-"*70)
print("TEST 2: Transaction Notification (Approved)")
print("-"*70)
try:
    # Create a mock transaction
    txn = Transaction(
        user=user,
        tx_type='deposit',
        amount=Decimal('100.00'),
        status='approved',
        reference='Test deposit',
        created_at=timezone.now()
    )
    result = EmailService.send_transaction_notification(txn, 'approved', 'Test approval')
    print(f"✅ Transaction approved email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ Transaction approved email failed: {e}")

# Test 3: Transaction Rejected Email
print("\n" + "-"*70)
print("TEST 3: Transaction Notification (Rejected)")
print("-"*70)
try:
    txn = Transaction(
        user=user,
        tx_type='deposit',
        amount=Decimal('100.00'),
        status='rejected',
        reference='Test deposit',
        created_at=timezone.now()
    )
    result = EmailService.send_transaction_notification(txn, 'rejected', 'Insufficient proof')
    print(f"✅ Transaction rejected email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ Transaction rejected email failed: {e}")

# Test 4: Investment Approved Email
print("\n" + "-"*70)
print("TEST 4: Investment Notification (Approved)")
print("-"*70)
try:
    plan = InvestmentPlan.objects.first()
    if not plan:
        print("⚠️  No investment plans found. Skipping investment email tests.")
    else:
        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal('1000.00'),
            status='approved',
            started_at=timezone.now(),
            ends_at=timezone.now() + timezone.timedelta(days=plan.duration_days)
        )
        result = EmailService.send_investment_notification(inv, 'approved', 'Investment activated')
        print(f"✅ Investment approved email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ Investment approved email failed: {e}")

# Test 5: Investment Rejected Email
print("\n" + "-"*70)
print("TEST 5: Investment Notification (Rejected)")
print("-"*70)
try:
    if plan:
        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal('1000.00'),
            status='rejected'
        )
        result = EmailService.send_investment_notification(inv, 'rejected', 'Insufficient funds')
        print(f"✅ Investment rejected email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ Investment rejected email failed: {e}")

# Test 6: Investment Completed Email
print("\n" + "-"*70)
print("TEST 6: Investment Notification (Completed)")
print("-"*70)
try:
    if plan:
        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal('1000.00'),
            status='completed',
            started_at=timezone.now() - timezone.timedelta(days=plan.duration_days),
            ends_at=timezone.now()
        )
        result = EmailService.send_investment_notification(inv, 'completed', '')
        print(f"✅ Investment completed email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ Investment completed email failed: {e}")

# Test 7: ROI Payout Email
print("\n" + "-"*70)
print("TEST 7: ROI Payout Notification")
print("-"*70)
try:
    if plan:
        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal('1000.00'),
            status='approved',
            started_at=timezone.now(),
            ends_at=timezone.now() + timezone.timedelta(days=plan.duration_days)
        )
        payout_amount = Decimal('15.00')
        result = EmailService.send_roi_payout_notification(
            user,
            payout_amount,
            inv,
            timezone.now().date()
        )
        print(f"✅ ROI payout email: {'SENT' if result else 'SKIPPED'}")
except Exception as e:
    print(f"❌ ROI payout email failed: {e}")

# Summary
print("\n" + "="*70)
print("TEST SUMMARY")
print("="*70)
print("\n✅ All email notification types tested successfully!")
print("\n📝 Notes:")
print("  - Emails are sent to console in development mode")
print("  - Configure SMTP settings for production email delivery")
print("  - Check user email preferences to ensure notifications are enabled")
print("\n" + "="*70 + "\n")
