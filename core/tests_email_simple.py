import os
import django

# --- Setup Django environment for standalone execution ---
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
django.setup()
# --------------------------------------------------------

from decimal import Decimal
from django.contrib.auth.models import User

from core.services.email_service import EmailService
from transactions.models import Transaction
from investments.models import InvestmentPlan, UserInvestment


def send_test_email_for_tests(email_type: str, to_email: str) -> bool:
    try:
        if email_type == "test":
            return EmailService.send_test_email(to_email)

        elif email_type == "welcome":
            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )
            return EmailService.send_welcome_email(user)

        elif email_type == "transaction":
            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )

            transaction = Transaction(
                user=user,
                tx_type="deposit",
                amount=Decimal("100.00"),
                payment_method="bank_transfer",
                reference="TEST-REF-001",
                status="approved",
            )
            transaction.id = "test-transaction-id"

            return EmailService.send_transaction_notification(
                transaction, "approved", "Test admin notes"
            )

        elif email_type == "investment":
            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )

            plan, _ = InvestmentPlan.objects.get_or_create(
                name="Test Plan",
                defaults={
                    "daily_roi": Decimal("1.5"),
                    "duration_days": 30,
                    "min_amount": Decimal("100"),
                    "max_amount": Decimal("10000"),
                },
            )

            investment = UserInvestment(
                user=user,
                plan=plan,
                amount=Decimal("500.00"),
                status="approved",
            )
            investment.id = "test-investment-id"

            return EmailService.send_investment_notification(
                investment, "approved", "Test admin notes"
            )

        return False

    except Exception as e:
        print(f"ERROR: {e}")
        return False


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 3:
        print("Usage: python core/tests_email_simple.py <type> <email>")
        sys.exit(1)

    email_type = sys.argv[1]
    email = sys.argv[2]

    ok = send_test_email_for_tests(email_type, email)
    print("Success" if ok else "Failed")
