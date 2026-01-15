import logging
from datetime import date, datetime
from decimal import Decimal


from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction, connection

from core.email_service import EmailService
from investments.models import DailyRoiPayout, UserInvestment
from investments.services import credit_roi_payout
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
        parser.add_argument(
            "--start-date",
            type=str,
            help=(
                "Backfill starting from this ISO date (YYYY-MM-DD), inclusive. "
                "If provided, processes each day from start-date to end-date (or today)."
            ),
            default=None,
        )
        parser.add_argument(
            "--end-date",
            type=str,
            help="Backfill ending at this ISO date (YYYY-MM-DD), inclusive. Defaults to today.",
            default=None,
        )
        parser.add_argument(
            "--user-email",
            type=str,
            help="Only process investments for a specific user email",
            default=None,
        )
        parser.add_argument(
            "--investment-id",
            type=str,
            help="Only process a specific investment id",
            default=None,
        )
        parser.add_argument(
            "--no-emails",
            action="store_true",
            help="Do not send ROI or transaction emails (recommended for backfills)",
        )

    def _parse_date(self, value: str) -> date:
        return datetime.fromisoformat(value).date()

    def _iter_dates(self, start, end):
        cur = start
        while cur <= end:
            yield cur
            cur += timezone.timedelta(days=1)

    def handle(self, *args, **options):
        with rls_admin_context():
            # Postgres advisory lock to prevent concurrent payout runs
            lock_id = 987654321  # Arbitrary unique int for this job
            with connection.cursor() as cursor:
                cursor.execute("SELECT pg_advisory_lock(%s);", [lock_id])
                try:
                    dry = options["dry_run"]
                    no_emails = bool(options.get("no_emails"))

                    start_date_raw = options.get("start_date")
                    end_date_raw = options.get("end_date")

                    if start_date_raw and options.get("date"):
                        raise ValueError("Use either --date or --start-date/--end-date, not both")

                    if end_date_raw and not start_date_raw:
                        raise ValueError("--end-date requires --start-date")

                    if start_date_raw:
                        start_date = self._parse_date(start_date_raw)
                        end_date = (
                            timezone.now().date() if not end_date_raw else self._parse_date(end_date_raw)
                        )
                        if end_date < start_date:
                            raise ValueError("--end-date must be >= --start-date")
                        date_mode = "range"
                    else:
                        process_date = (
                            timezone.now().date()
                            if not options["date"]
                            else self._parse_date(options["date"])
                        )
                        start_date = end_date = process_date
                        date_mode = "single"

                    paid = 0
                    synced = 0
                    total_amount = Decimal("0")
                    qs = UserInvestment.objects.filter(status__in=["active", "approved"])
                    if options.get("user_email"):
                        qs = qs.filter(user__email__iexact=options["user_email"].strip())
                    if options.get("investment_id"):
                        qs = qs.filter(id=options["investment_id"].strip())

                    for inv in qs.select_related("plan", "user"):
                        # Only process investments that have an active window
                        if not inv.started_at or not inv.ends_at:
                            continue

                        inv_start = inv.started_at.date()
                        inv_end_exclusive = inv.ends_at.date()

                        effective_start = max(start_date, inv_start)
                        effective_end = min(end_date, inv_end_exclusive - timezone.timedelta(days=1))
                        if effective_end < effective_start:
                            continue

                        # Simple daily payout: amount * (daily_roi / 100)
                        daily_roi = (inv.plan.daily_roi or Decimal("0")) / Decimal("100")
                        payout = (inv.amount * daily_roi).quantize(Decimal("0.01"))
                        if payout <= 0:
                            continue

                        for day in self._iter_dates(effective_start, effective_end):
                            # Check if payout already exists for this date (prevent duplicates)
                            existing_payout = DailyRoiPayout.objects.filter(
                                investment=inv,
                                payout_date=day,
                            ).first()

                            if existing_payout:
                                # Payout record exists - skip to avoid duplicates
                                synced += 1
                                total_amount += existing_payout.amount
                                continue

                            if dry:
                                self.stdout.write(
                                    f"[DRY] Would pay {payout} to user {inv.user_id} "
                                    f"for investment {inv.id} on {day}"
                                )
                                paid += 1
                                total_amount += payout
                                continue

                            # Wrap each payout in a DB transaction for atomicity
                            from django.db import IntegrityError
                            for day in self._iter_dates(effective_start, effective_end):
                                if dry:
                                    self.stdout.write(
                                        f"[DRY] Would pay {payout} to user {inv.user_id} "
                                        f"for investment {inv.id} on {day}"
                                    )
                                    continue

                                try:
                                    with transaction.atomic():
                                        payout_obj, created = DailyRoiPayout.objects.get_or_create(
                                            investment=inv,
                                            payout_date=day,
                                            defaults={"amount": payout},
                                        )

                                        if not created:
                                            # Already paid (or already recorded)
                                            synced += 1
                                            total_amount += payout_obj.amount
                                            continue

                                        credit_roi_payout(payout_obj)

                                        if not no_emails:
                                            try:
                                                EmailService.send_roi_payout_notification(
                                                    inv.user,
                                                    payout,
                                                    inv,
                                                    day,
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

                                        paid += 1
                                        total_amount += payout
                                except IntegrityError:
                                    # In case of rare race conditions, treat as already paid
                                    continue

                        if date_mode == "single" and not dry and paid:
                            self.stdout.write(
                                f"Paid {payout} to user {inv.user_id} (investment {inv.id})"
                            )

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Processed payouts: {paid}. Synced payout records: {synced}. "
                            f"Total payout: {total_amount}"
                        )
                    )
                    if dry:
                        self.stdout.write(
                            self.style.WARNING(
                                "Dry run mode - no transactions created"
                            )
                        )
                finally:
                    cursor.execute("SELECT pg_advisory_unlock(%s);", [lock_id])
