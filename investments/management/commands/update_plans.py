from django.core.management.base import BaseCommand

from investments.models import InvestmentPlan


class Command(BaseCommand):
    help = "Update existing investment plans with new durations"

    def handle(self, *args, **options):
        # Delete all existing plans
        deleted_count = InvestmentPlan.objects.all().delete()[0]
        self.stdout.write(self.style.WARNING(f"Deleted {deleted_count} existing plan(s)"))

        # Create new plans with updated durations
        plans = [
            {
                "name": "Pioneer",
                "description": "Entry-level investment plan perfect for beginners. Low risk with steady returns over 3 months.",
                "daily_roi": 1.00,
                "duration_days": 90,  # 3 months
                "min_amount": 100,
                "max_amount": 999,
            },
            {
                "name": "Vanguard",
                "description": "Intermediate investment plan for growing portfolios. Balanced risk and reward over 5 months.",
                "daily_roi": 1.25,
                "duration_days": 150,  # 5 months
                "min_amount": 1000,
                "max_amount": 4999,
            },
            {
                "name": "Horizon",
                "description": "Advanced investment plan for serious investors. Higher returns for larger investments over 6 months.",
                "daily_roi": 1.50,
                "duration_days": 180,  # 6 months
                "min_amount": 5000,
                "max_amount": 14999,
            },
            {
                "name": "Summit",
                "description": "Premium investment plan for high-net-worth individuals. Maximum returns for maximum investment over 1 year.",
                "daily_roi": 2.00,
                "duration_days": 365,  # 1 year (annual)
                "min_amount": 15000,
                "max_amount": 100000,
            },
        ]

        created_count = 0
        for plan_data in plans:
            plan = InvestmentPlan.objects.create(**plan_data)
            created_count += 1
            total_roi = plan_data["daily_roi"] * plan_data["duration_days"]
            self.stdout.write(
                self.style.SUCCESS(
                    f"✓ Created: {plan.name} - {plan.daily_roi}% daily for {plan.duration_days} days (Total ROI: {total_roi}%)"
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ Successfully created {created_count} plan(s) with new durations!"
            )
        )
