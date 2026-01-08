from __future__ import annotations

from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Q

from investments.models import UserInvestment
from investments.services import recalculate_investment_end_date
from users.models import User


class Command(BaseCommand):
    help = (
        "Recalculate ends_at for approved investments based on plan.duration_days. "
        "Useful after syncing plan terms (seed_plans)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--user-email",
            dest="user_email",
            default=None,
            help="Only process investments for this user email.",
        )
        parser.add_argument(
            "--admin-email",
            dest="admin_email",
            required=True,
            help="Admin user email used for audit logs.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change without writing.",
        )

    def handle(self, *args, **options):
        user_email: str | None = options["user_email"]
        admin_email: str = options["admin_email"]
        dry_run: bool = bool(options["dry_run"])

        try:
            admin_user = User.objects.get(email=admin_email)
        except User.DoesNotExist as exc:
            raise SystemExit(f"Admin user not found: {admin_email}") from exc

        qs = (
            UserInvestment.objects.select_related("plan", "user")
            .filter(Q(status="approved") | Q(status="completed"))
            .exclude(started_at__isnull=True)
            .order_by("id")
        )
        if user_email:
            qs = qs.filter(user__email=user_email)

        total = qs.count()
        changed = 0

        for inv in qs.iterator():
            expected_end = inv.started_at + timedelta(days=inv.plan.duration_days)

            if inv.ends_at == expected_end:
                continue

            changed += 1

            if dry_run:
                self.stdout.write(
                    f"Investment {inv.id} ({inv.user.email}, {inv.plan.name}): "
                    f"ends_at {inv.ends_at} -> {expected_end}"
                )
                continue

            recalculate_investment_end_date(
                investment=inv,
                admin_user=admin_user,
                notes="Plan terms synced; recalculated ends_at",
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Scanned {total} investment(s). {'Would change' if dry_run else 'Changed'} {changed}."
            )
        )
