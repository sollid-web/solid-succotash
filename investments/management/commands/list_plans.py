from django.core.management.base import BaseCommand

from investments.models import InvestmentPlan


class Command(BaseCommand):
    help = "List current investment plans in the database"

    def handle(self, *args, **options):
        qs = InvestmentPlan.objects.all().order_by("min_amount")
        if not qs.exists():
            self.stdout.write(self.style.WARNING("No investment plans found."))
            return
        self.stdout.write(self.style.SUCCESS(f"Total plans: {qs.count()}"))
        for p in qs:
            self.stdout.write(
                f" - {p.name}: {p.daily_roi}% daily | {p.duration_days} days | ${p.min_amount}-${p.max_amount}"
            )
