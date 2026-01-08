from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from investments.models import InvestmentPlan
from investments.services import create_approved_investment_at
from transactions.services import approve_transaction, create_transaction


def _parse_date(value: str) -> datetime:
    # Accept YYYY-MM-DD; interpret as local midnight.
    try:
        dt = datetime.fromisoformat(value)
    except ValueError as exc:
        raise CommandError(f"Invalid date: {value}. Expected YYYY-MM-DD") from exc

    if dt.tzinfo is None:
        dt = timezone.make_aware(dt)
    return dt


class Command(BaseCommand):
    help = (
        "Create historical (already-approved) investments for a user, "
        "debiting wallet safely and writing audit logs. "
        "Use for controlled restoration when no DB backup exists."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            required=True,
            help="Target username (e.g. placeholder-teddybjorn72)",
        )
        parser.add_argument(
            "--admin-email",
            required=True,
            help="Admin/staff email used for audit logs",
        )
        parser.add_argument(
            "--fund",
            action="append",
            default=[],
            help=(
                "Optional approved funding deposits to credit wallet first. "
                "Repeatable. Format: AMOUNT (e.g. --fund 5000)."
            ),
        )
        parser.add_argument(
            "--investment",
            action="append",
            default=[],
            help=(
                "Repeatable investment spec. Format: PLAN|AMOUNT|START_DATE; "
                "example: --investment 'Vanguard|4999|2025-11-20'"
            ),
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be created without writing.",
        )

    def handle(self, *args, **options):
        User = get_user_model()

        username = (options.get("username") or "").strip()
        admin_email = (options.get("admin_email") or "").strip()
        dry_run = bool(options.get("dry_run"))

        if not username:
            raise CommandError("--username is required")
        if not admin_email:
            raise CommandError("--admin-email is required")

        user = User.objects.filter(username=username).first()
        if not user:
            raise CommandError(f"User not found: {username}")

        admin_user = User.objects.filter(email__iexact=admin_email, is_staff=True).first()
        if not admin_user:
            raise CommandError(f"Admin user not found or not staff: {admin_email}")

        fund_amounts = []
        for raw in options.get("fund") or []:
            try:
                fund_amounts.append(Decimal(str(raw)))
            except Exception as exc:
                raise CommandError(f"Invalid --fund amount: {raw}") from exc

        inv_specs = options.get("investment") or []
        if not inv_specs:
            raise CommandError(
                "No investments provided. Use --investment 'Plan|Amount|YYYY-MM-DD' (repeatable)."
            )

        parsed_investments: list[tuple[InvestmentPlan, Decimal, datetime]] = []
        for spec in inv_specs:
            spec = (spec or "").strip()
            parts = [p.strip() for p in spec.split("|")]
            if len(parts) != 3:
                raise CommandError(
                    "Invalid --investment format. Expected PLAN|AMOUNT|YYYY-MM-DD "
                    f"but got: {spec}"
                )
            plan_name, amount_raw, start_raw = parts
            plan = InvestmentPlan.objects.filter(name__iexact=plan_name).first()
            if not plan:
                raise CommandError(f"Investment plan not found: {plan_name}")
            try:
                amount = Decimal(str(amount_raw))
            except Exception as exc:
                raise CommandError(f"Invalid investment amount: {amount_raw}") from exc
            started_at = _parse_date(start_raw)
            parsed_investments.append((plan, amount, started_at))

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN: no changes written."))

        # 1) Optional funding deposits (approved) so wallet can cover debits
        for amt in fund_amounts:
            if amt <= 0:
                raise CommandError("--fund amounts must be positive")

            reference = f"Historical funding deposit for {user.username}"
            self.stdout.write(f"Funding deposit: ${amt} ({reference})")
            if dry_run:
                continue

            txn = create_transaction(
                user=user,
                tx_type="deposit",
                amount=float(amt),
                reference=reference,
                notify_admin=False,
                notify_user=False,
            )
            approve_transaction(txn, admin_user, notes="Historical funding restoration")

        # 2) Create approved investments at historical dates
        for plan, amount, started_at in parsed_investments:
            self.stdout.write(
                f"Creating approved investment: user={user.username} plan={plan.name} amount=${amount} started_at={started_at.date().isoformat()}"
            )
            if dry_run:
                continue

            create_approved_investment_at(
                user=user,
                plan=plan,
                amount=amount,
                admin_user=admin_user,
                started_at=started_at,
                notes="Historical investment restoration",
                notify_user=False,
                notify_admin=False,
            )

        self.stdout.write(self.style.SUCCESS("Historical investments created."))
