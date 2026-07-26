from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from core.services.email_service import EmailService
from investments.models import InvestmentPlan, UserInvestment


class Command(BaseCommand):
    help = "Send a test ROI payout email notification"

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email address to send test email to',
            required=True,
        )

    def handle(self, *args, **options):
        User = get_user_model()
        user_email = options['email'].lower()
        
        # Get or create user
        user, created = User.objects.get_or_create(
            email=user_email,
            defaults={'username': user_email.split('@')[0] + '_test'}
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'✅ Created user: {user.email}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✅ Found existing user: {user.email}'))

        # Get or create investment plan
        plan = InvestmentPlan.objects.first()
        if not plan:
            plan = InvestmentPlan.objects.create(
                name='Test Plan',
                min_investment=Decimal('100'),
                max_investment=Decimal('100000'),
                daily_roi=Decimal('0.5'),
                duration_days=365
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created investment plan: {plan.name}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✅ Using investment plan: {plan.name}'))

        # Get or create investment
        investment = UserInvestment.objects.filter(user=user).first()
        if not investment:
            investment = UserInvestment.objects.create(
                user=user,
                plan=plan,
                amount=Decimal('5000.00'),
                status='active',
                started_at=timezone.now() - timedelta(days=10),
                ends_at=timezone.now() + timedelta(days=355)
            )
            self.stdout.write(self.style.SUCCESS(f'✅ Created investment: {investment.id} for amount ${investment.amount}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✅ Using existing investment: {investment.id}'))

        # Send ROI payout email
        payout_amount = Decimal('25.00')
        today = timezone.now().date()

        self.stdout.write('\n📧 Sending ROI payout notification...')
        self.stdout.write(f'   User: {user.email}')
        self.stdout.write(f'   Amount: ${payout_amount}')
        self.stdout.write(f'   Plan: {plan.name}')
        self.stdout.write(f'   Daily ROI: {plan.daily_roi}%')
        self.stdout.write(f'   Payout Date: {today}')

        try:
            result = EmailService.send_roi_payout_notification(
                user,
                payout_amount,
                investment,
                today
            )

            if result:
                self.stdout.write(self.style.SUCCESS('\n✅ ROI payout email sent successfully!'))
                self.stdout.write(f'\n📬 Email sent to: {user.email}')
                self.stdout.write('Check your email inbox for the notification.')
            else:
                self.stdout.write(self.style.ERROR('\n❌ Failed to send ROI payout email'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\n❌ Error sending email: {str(e)}'))
