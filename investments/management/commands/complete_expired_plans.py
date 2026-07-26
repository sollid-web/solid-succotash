import logging

from django.core.management.base import BaseCommand
from django.db import connection, transaction
from django.utils import timezone

from core.email_service import EmailService
from investments.models import UserInvestment
from wolvcapital.rls import rls_admin_context

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = (
        "Find expired active/approved investments, mark completed, "
        "subtract principal from user total_amount_invested and notify users."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be done without saving changes",
        )

    def handle(self, *args, **options):
        with rls_admin_context():
            lock_id = 987654322
            with connection.cursor() as cursor:
                locked = False
                try:
                    # Attempt to acquire advisory lock; some test DBs (sqlite) don't support it
                    try:
                        cursor.execute("SELECT pg_advisory_lock(%s);", [lock_id])
                        locked = True
                    except Exception:
                        logger.warning("pg_advisory_lock not available; continuing without DB-level lock")

                    dry = options.get("dry_run", False)

                    qs = UserInvestment.objects.filter(status__in=["active", "approved"], ends_at__lte=timezone.now())

                    completed = 0
                    balances_updated = 0
                    emails_sent = 0

                    for inv in qs.select_related("user"):
                        if dry:
                            self.stdout.write(
                                f"[DRY] Would process investment {inv.id} for {getattr(inv.user, 'email', inv.user_id)}: call save(), expect status -> completed, subtract {inv.amount} from user's total_amount_invested, send email"
                            )
                            completed += 1
                            balances_updated += 1
                            emails_sent += 1
                            continue

                        try:
                            with transaction.atomic():
                                # Call save() to trigger model auto-complete
                                inv.save()
                                inv.refresh_from_db()

                                if inv.status != UserInvestment.STATUS_COMPLETED:
                                    logger.warning(
                                        "Investment %s did not transition to completed (status=%s); skipping",
                                        inv.id,
                                        inv.status,
                                    )
                                    continue

                                completed += 1

                                # Attempt to locate profile/field holding total_amount_invested
                                user = inv.user
                                updated_balance = False

                                # Prefer direct attribute on user
                                if hasattr(user, "total_amount_invested"):
                                    current = getattr(user, "total_amount_invested") or 0
                                    new = max(0, current - inv.amount)
                                    setattr(user, "total_amount_invested", new)
                                    user.save()
                                    updated_balance = True
                                else:
                                    # Try profile
                                    profile = getattr(user, "profile", None)
                                    if profile and hasattr(profile, "total_amount_invested"):
                                        current = getattr(profile, "total_amount_invested") or 0
                                        new = max(0, current - inv.amount)
                                        setattr(profile, "total_amount_invested", new)
                                        profile.save()
                                        updated_balance = True

                                if updated_balance:
                                    balances_updated += 1

                                # Send completion email; errors should not break transaction
                                try:
                                    EmailService.send_investment_notification(inv, "completed")
                                    emails_sent += 1
                                except Exception as exc:  # pragma: no cover
                                    logger.warning(
                                        "Failed to send investment completed email for %s: %s",
                                        getattr(inv.user, "email", inv.user_id),
                                        exc,
                                    )

                                logger.info(
                                    "Completed investment %s for %s, principal %s removed from total_amount_invested",
                                    inv.id,
                                    getattr(inv.user, "email", inv.user_id),
                                    inv.amount,
                                )
                        except Exception:
                            # Any unexpected error in processing this investment should not stop others
                            logger.exception("Error processing investment %s", inv.id)
                            continue

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Completed {completed} plans, updated {balances_updated} user balances, sent {emails_sent} emails"
                        )
                    )
                    if dry:
                        self.stdout.write(self.style.WARNING("Dry run mode - no changes were saved"))
                finally:
                    if locked:
                        try:
                            cursor.execute("SELECT pg_advisory_unlock(%s);", [lock_id])
                        except Exception:
                            logger.warning("pg_advisory_unlock failed or not available")
