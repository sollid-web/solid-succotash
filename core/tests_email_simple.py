#!/usr/bin/env python3
"""
Standalone helper to exercise EmailService for manual testing.

Usage:
  python .\\core\tests_email_simple.py --to someone@example.com --type test
  python .\\core\tests_email_simple.py --to someone@example.com --type welcome
  python .\\core\tests_email_simple.py --to someone@example.com --type transaction
  python .\\core\tests_email_simple.py --to someone@example.com --type investment
"""
from __future__ import annotations

import argparse
import os
import sys
import uuid
from decimal import Decimal

from core.services.email_service import EmailService

# Import models for mock objects
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import User

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
import django  # noqa: E402

django.setup()


def run_email_test(to_email: str, email_type: str) -> bool:
    if email_type == "test":
        return EmailService.send_test_email(to_email)

    user, _ = User.objects.get_or_create(email=to_email, defaults={"username": to_email})

    if email_type == "welcome":
        return EmailService.send_welcome_email(user)

    if email_type == "transaction":
        # Build a mock transaction instance (not saved)
        tx = Transaction(
            user=user,
            tx_type="deposit",
            amount=Decimal("100.00"),
            payment_method="bank_transfer",
            reference="TEST-REF-001",
            status="approved",
        )
        tx.id = uuid.uuid4()
        return EmailService.send_transaction_notification(tx, "approved", "Test admin notes")

    if email_type == "investment":
        plan, _ = InvestmentPlan.objects.get_or_create(
            name="Test Plan",
            defaults={
                "daily_roi": Decimal("1.5"),
                "duration_days": 30,
                "min_amount": Decimal("100"),
                "max_amount": Decimal("10000"),
            },
        )
        inv = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal("500.00"),
            status="approved",
        )
        inv.id = 0
        return EmailService.send_investment_notification(inv, "approved", "Test admin notes")

    print(f"Unknown email type: {email_type}")
    return False


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Send test emails using EmailService (standalone).")
    parser.add_argument("--to", required=True, help="Recipient email address")
    parser.add_argument(
        "--type",
        choices=["test", "welcome", "transaction", "investment"],
        default="test",
        help="Test email type",
    )
    args = parser.parse_args(argv)

    try:
        ok = run_email_test(args.to, args.type)
        if ok:
            print(f"✅ Test email sent successfully to {args.to}")
            return 0
        else:
            print(f"❌ Failed to send test email to {args.to}")
            return 2
    except Exception as e:
        print(f"❌ Error sending test email: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
