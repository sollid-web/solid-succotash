from django.core.management.base import BaseCommand

from investments.models import InvestmentPlan


class Command(BaseCommand):
    help = "Seed the database with default investment plans"

    def handle(self, *args, **options):
        # Canonical fixed plans. Keep these aligned with the frontend plan pages
        # and any user-facing terms.
        plans = [
            {
                "name": "Pioneer",
                "description": "Entry-level plan for new investors (90-day term).",
                "daily_roi": 1.00,
                "duration_days": 90,
                "min_amount": 100,
                "max_amount": 999,
            },
            {
                "name": "Vanguard",
                "description": "Balanced growth plan (150-day term).",
                "daily_roi": 1.25,
                "duration_days": 150,
                "min_amount": 1000,
                "max_amount": 4999,
            },
            {
                "name": "Horizon",
                "description": "Advanced plan for experienced investors (180-day term).",
                "daily_roi": 1.50,
                "duration_days": 180,
                "min_amount": 5000,
                "max_amount": 14999,
            },
            {
                "name": "Summit",
                "description": "Premium annual plan for high allocations (365-day term).",
                "daily_roi": 2.00,
                "duration_days": 365,
                "min_amount": 15000,
                "max_amount": 100000,
            },
        ]

        created_count = 0
        updated_count = 0
        for plan_data in plans:
            plan, created = InvestmentPlan.objects.update_or_create(
                name=plan_data["name"], defaults=plan_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created plan: {plan.name}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"Updated plan: {plan.name}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"Plans synced. Created {created_count}, updated {updated_count}."
            )
        )
