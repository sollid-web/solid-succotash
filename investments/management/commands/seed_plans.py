from django.core.management.base import BaseCommand

from investments.models import InvestmentPlan


class Command(BaseCommand):
    help = "Seed the database with default investment plans"

    def handle(self, *args, **options):
        # Canonical fixed plans (see README) - do NOT change without migration & communication
        plans = [
            {
                "name": "Pioneer",
                "description": "Entry-level plan: 14-day cycle for new investors.",
                "daily_roi": 1.00,
                "duration_days": 14,
                "min_amount": 100,
                "max_amount": 999,
            },
            {
                "name": "Vanguard",
                "description": "Growth plan: 21-day cycle balanced risk/reward.",
                "daily_roi": 1.25,
                "duration_days": 21,
                "min_amount": 1000,
                "max_amount": 4999,
            },
            {
                "name": "Horizon",
                "description": "Advanced plan: 30-day cycle for larger positions.",
                "daily_roi": 1.50,
                "duration_days": 30,
                "min_amount": 5000,
                "max_amount": 14999,
            },
            {
                "name": "Summit",
                "description": "Premium plan: 45-day cycle, highest bracket returns.",
                "daily_roi": 2.00,
                "duration_days": 45,
                "min_amount": 15000,
                "max_amount": 100000,
            },
        ]

        created_count = 0
        for plan_data in plans:
            plan, created = InvestmentPlan.objects.get_or_create(
                name=plan_data["name"], defaults=plan_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created plan: {plan.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Plan already exists: {plan.name}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully created {created_count} new plan(s)"))
