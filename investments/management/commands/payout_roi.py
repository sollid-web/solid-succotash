import logging
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from core.email_service import EmailService
from investments.models import DailyRoiPayout, UserInvestment
from transactions.services import create_transaction
from wolvcapital.rls import rls_admin_context

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = (
        "Stub: Process daily ROI payouts for approved & active investments "
        "(idempotent per day)."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be paid without creating transactions",
        )
        parser.add_argument(
            "--date",
            type=str,
            help="Process for a specific ISO date (YYYY-MM-DD)",
            default=None,
        )

    def handle(self, *args, **options):
        with rls_admin_context():
            process_date = (
                timezone.now().date()
                if not options["date"]
                else timezone.datetime.fromisoformat(options["date"]).date()
            )
            dry = options["dry_run"]
            paid = 0
            total_amount = Decimal("0")
            qs = UserInvestment.objects.filter(status="approved")
            for inv in qs.select_related("plan", "user"):
                # Simple daily payout: amount * (daily_roi / 100)
                daily_roi = (inv.plan.daily_roi or Decimal("0")) / Decimal(
                    "100"
                )
                payout = (inv.amount * daily_roi).quantize(Decimal("0.01"))
                if payout <= 0:
                    continue
                # Idempotency check
                if DailyRoiPayout.objects.filter(
                    investment=inv, payout_date=process_date
                ).exists():
                    continue
                if dry:
                    self.stdout.write(
                        (
                            f"[DRY] Would pay {payout} to user {inv.user_id} "
                            f"for investment {inv.id}"
                        )
                    )
                else:
                    with transaction.atomic():
                        create_transaction(
                            user=inv.user,
                            # Treating ROI as a credit event.
                            tx_type="deposit",
                            amount=float(payout),
                            reference=(
                                f"ROI payout {process_date} "
                                f"for investment {inv.id}"
                            ),
                        )
                        DailyRoiPayout.objects.create(
                            investment=inv,
                            payout_date=process_date,
                            amount=payout,
                        )
                    try:
                        EmailService.send_roi_payout_notification(
                            inv.user,
                            payout,
                            inv,
                            process_date,
                        )
                    except Exception as exc:  # pragma: no cover
                        logger.warning(
                            (
                                "ROI payout email failed for user %s "
                                "investment %s: %s"
                            ),
                            getattr(inv.user, "email", inv.user_id),
                            inv.id,
                            exc,
                        )
                    self.stdout.write(
                        (
                            f"Paid {payout} to user {inv.user_id} "
                            f"(investment {inv.id})"
                        )
                    )
                paid += 1
                total_amount += payout
            self.stdout.write(
                self.style.SUCCESS(
                    (
                        f"Processed {paid} investments. "
                        f"Total payout: {total_amount}"
                    )
                )
            )
            if dry:
                self.stdout.write(
                    self.style.WARNING(
                        "Dry run mode - no transactions created"
                    )
                )
