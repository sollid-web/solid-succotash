def add_arguments(self, parser):
    parser.add_argument(
        "--to",
        type=str,
        required=True,
        help="Email address to send test email to",
    )
    parser.add_argument(
        "--type",
        type=str,
        default="test",
        choices=["test", "welcome", "transaction", "investment"],
        help="Type of test email to send",
    )

def handle(self, *args, **options):
    to_email = options["to"]
    email_type = options["type"]

    self.stdout.write(f"Sending {email_type} test email to {to_email}...")

    try:
        if email_type == "test":
            success = EmailService.send_test_email(to_email)

        elif email_type == "welcome":
            # Create or get a test user
            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )
            success = EmailService.send_welcome_email(user)

        elif email_type == "transaction":
            # Mock transaction for testing
            from transactions.models import Transaction

            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )

            # Create a mock transaction (not saved to DB)
            transaction = Transaction(
                user=user,
                tx_type="deposit",
                amount=Decimal("100.00"),
                payment_method="bank_transfer",
                reference="TEST-REF-001",
                status="approved",
            )
            transaction.id = "test-transaction-id"

            success = EmailService.send_transaction_notification(
                transaction, "approved", "Test admin notes"
            )

        elif email_type == "investment":
            # Mock investment for testing
            from investments.models import InvestmentPlan, UserInvestment

            user, _ = User.objects.get_or_create(
                email=to_email, defaults={"username": to_email}
            )

            # Get or create a test plan
            plan, _ = InvestmentPlan.objects.get_or_create(
                name="Test Plan",
                defaults={
                    "daily_roi": Decimal("1.5"),
                    "duration_days": 30,
                    "min_amount": Decimal("100"),
                    "max_amount": Decimal("10000"),
                },
            )

            # Create a mock investment (not saved to DB)
            investment = UserInvestment(
                user=user,
                plan=plan,
                amount=Decimal("500.00"),
                status="approved",
            )
            investment.id = "test-investment-id"

            success = EmailService.send_investment_notification(
                investment, "approved", "Test admin notes"
            )

        else:
            success = False

        if success:
            self.stdout.write(
                self.style.SUCCESS(f"✅ Test email sent successfully to {to_email}")
            )
        else:
            self.stdout.write(
                self.style.ERROR(f"❌ Failed to send test email to {to_email}")
            )

    except Exception as e:
        self.stdout.write(
            self.style.ERROR(f"❌ Error sending test email: {str(e)}")
        )
