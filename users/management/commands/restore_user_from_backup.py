import sqlite3
from collections.abc import Iterable
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import IntegrityError, transaction
from django.utils.dateparse import parse_date, parse_datetime

from investments.models import DailyRoiPayout, InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import Profile, UserWallet


@dataclass(frozen=True)
class RestoreSummary:
    created_user: bool
    updated_profile: bool
    updated_wallet: bool
    created_transactions: int
    skipped_transactions: int
    created_investments: int
    skipped_investments: int
    created_roi_payouts: int
    skipped_roi_payouts: int


def _to_decimal(value) -> Decimal:
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    return Decimal(str(value))


def _to_dt(value):
    if value in (None, ""):
        return None
    if hasattr(value, "tzinfo"):
        return value
    parsed = parse_datetime(str(value))
    return parsed


def _to_date(value):
    if value in (None, ""):
        return None
    parsed = parse_date(str(value))
    return parsed


class Command(BaseCommand):
    help = (
        "Restore a single user's investment/transaction data from a SQLite backup "
        "(e.g. db_backup.sqlite3) into the current database."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--backup",
            default="db_backup.sqlite3",
            help="Path to the SQLite backup file (default: db_backup.sqlite3)",
        )
        parser.add_argument(
            "--email",
            required=True,
            help="User email address to restore (looked up in the backup DB)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be restored without writing anything.",
        )

    def handle(self, *args, **options):
        backup_path = Path(options["backup"]).expanduser().resolve()
        email = str(options["email"]).strip()
        dry_run = bool(options["dry_run"])

        if not email:
            raise CommandError("--email is required")
        if not backup_path.exists():
            raise CommandError(f"Backup file not found: {backup_path}")

        summary = self._restore_from_backup(backup_path, email, dry_run=dry_run)

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN: no changes written."))

        self.stdout.write(
            self.style.SUCCESS(
                "Restore complete. "
                f"created_user={summary.created_user} "
                f"updated_profile={summary.updated_profile} "
                f"updated_wallet={summary.updated_wallet} "
                f"created_transactions={summary.created_transactions} "
                f"skipped_transactions={summary.skipped_transactions} "
                f"created_investments={summary.created_investments} "
                f"skipped_investments={summary.skipped_investments} "
                f"created_roi_payouts={summary.created_roi_payouts} "
                f"skipped_roi_payouts={summary.skipped_roi_payouts}"
            )
        )

        if summary.created_user:
            self.stdout.write(
                self.style.WARNING(
                    "Note: user password was not imported. "
                    "Set a new password via Django admin or `python manage.py changepassword <username>` "
                    "(username is usually the email)."
                )
            )

    def _restore_from_backup(self, backup_path: Path, email: str, *, dry_run: bool) -> RestoreSummary:
        User = get_user_model()

        conn = sqlite3.connect(str(backup_path))
        conn.row_factory = sqlite3.Row

        try:
            old_user = conn.execute(
                "SELECT * FROM users_user WHERE lower(email)=lower(?) LIMIT 1",
                (email,),
            ).fetchone()
            if not old_user:
                raise CommandError(f"User not found in backup: {email}")

            old_user_id = int(old_user["id"])

            # Pull related rows from backup
            old_profile = conn.execute(
                "SELECT * FROM users_profile WHERE user_id=? LIMIT 1", (old_user_id,)
            ).fetchone()
            old_wallet = conn.execute(
                "SELECT * FROM users_wallet WHERE user_id=? LIMIT 1", (old_user_id,)
            ).fetchone()

            old_txns = list(
                conn.execute(
                    "SELECT * FROM transactions_transaction WHERE user_id=? ORDER BY created_at ASC",
                    (old_user_id,),
                ).fetchall()
            )

            old_investments = list(
                conn.execute(
                    "SELECT * FROM investments_user_investment WHERE user_id=? ORDER BY created_at ASC",
                    (old_user_id,),
                ).fetchall()
            )

            old_investment_ids = [int(r["id"]) for r in old_investments]
            old_roi_payouts = []
            if old_investment_ids:
                placeholders = ",".join(["?"] * len(old_investment_ids))
                old_roi_payouts = list(
                    conn.execute(
                        f"SELECT * FROM investments_dailyroipayout WHERE investment_id IN ({placeholders})",
                        old_investment_ids,
                    ).fetchall()
                )

            # Plans that these investments reference
            plan_ids = sorted({int(r["plan_id"]) for r in old_investments})
            old_plans = []
            if plan_ids:
                placeholders = ",".join(["?"] * len(plan_ids))
                old_plans = list(
                    conn.execute(
                        f"SELECT * FROM investments_plan WHERE id IN ({placeholders})",
                        plan_ids,
                    ).fetchall()
                )

        finally:
            conn.close()

        # Write into current DB
        created_user = False
        updated_profile = False
        updated_wallet = False
        created_transactions = 0
        skipped_transactions = 0
        created_investments = 0
        skipped_investments = 0
        created_roi_payouts = 0
        skipped_roi_payouts = 0

        # Map old investment_id -> new investment_id (if we can't preserve pk)
        investment_id_map: dict[int, int] = {}

        # Map backup plan_id -> current plan
        plan_map: dict[int, InvestmentPlan] = {}

        with transaction.atomic():
            # 1) Ensure user exists
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                if dry_run:
                    created_user = True
                    # Use a dummy object in dry-run; we'll still need an id for FK mapping,
                    # but we avoid writing, so we just skip FK writes below.
                    user = None
                else:
                    # Create user as active; password is not imported for safety.
                    user = User.objects.create_user(
                        username=email,
                        email=email,
                        password=None,
                        is_active=bool(old_user["is_active"]),
                    )
                    user.set_unusable_password()
                    user.first_name = str(old_user["first_name"] or "")
                    user.last_name = str(old_user["last_name"] or "")
                    user.is_staff = bool(old_user["is_staff"])
                    user.is_superuser = bool(old_user["is_superuser"])
                    user.save(
                        update_fields=[
                            "password",
                            "first_name",
                            "last_name",
                            "is_staff",
                            "is_superuser",
                            "is_active",
                        ]
                    )
                    created_user = True

            if user is None:
                # dry-run; return computed summary only
                return RestoreSummary(
                    created_user=created_user,
                    updated_profile=bool(old_profile),
                    updated_wallet=bool(old_wallet),
                    created_transactions=len(old_txns),
                    skipped_transactions=0,
                    created_investments=len(old_investments),
                    skipped_investments=0,
                    created_roi_payouts=len(old_roi_payouts),
                    skipped_roi_payouts=0,
                )

            # 2) Profile
            if old_profile:
                profile, _ = Profile.objects.get_or_create(user=user)
                profile.role = str(old_profile["role"] or profile.role)
                profile.full_name = str(old_profile["full_name"] or "")
                profile.email_notifications_enabled = bool(old_profile["email_notifications_enabled"])
                profile.email_welcome = bool(old_profile["email_welcome"])
                profile.email_transactions = bool(old_profile["email_transactions"])
                profile.email_investments = bool(old_profile["email_investments"])
                profile.email_roi_payouts = bool(old_profile["email_roi_payouts"])
                profile.email_wallet_updates = bool(old_profile["email_wallet_updates"])
                profile.email_security_alerts = bool(old_profile["email_security_alerts"])
                profile.email_marketing = bool(old_profile["email_marketing"])
                profile.email_verified = bool(old_profile["email_verified"])
                if not dry_run:
                    profile.save()
                updated_profile = True

            # 3) Wallet
            if old_wallet:
                wallet, _ = UserWallet.objects.get_or_create(user=user)
                wallet.balance = _to_decimal(old_wallet["balance"])
                if not dry_run:
                    wallet.save(update_fields=["balance", "updated_at"])
                updated_wallet = True

            # 4) Plans (ensure referenced plans exist)
            for old_plan in old_plans:
                old_plan_id = int(old_plan["id"])
                name = str(old_plan["name"])
                plan = InvestmentPlan.objects.filter(name=name).first()
                if not plan:
                    plan = InvestmentPlan(
                        name=name,
                        description=str(old_plan["description"] or ""),
                        daily_roi=_to_decimal(old_plan["daily_roi"]),
                        duration_days=int(old_plan["duration_days"]),
                        min_amount=_to_decimal(old_plan["min_amount"]),
                        max_amount=_to_decimal(old_plan["max_amount"]),
                    )
                    if not dry_run:
                        plan.save()
                plan_map[old_plan_id] = plan

            # 5) Transactions
            for old_txn in old_txns:
                txn_id = str(old_txn["id"])
                if Transaction.objects.filter(id=txn_id).exists():
                    skipped_transactions += 1
                    continue

                approved_by_id = old_txn["approved_by_id"]
                approved_by = None
                if approved_by_id:
                    approved_by = User.objects.filter(id=int(approved_by_id)).first()

                txn = Transaction(
                    id=txn_id,
                    user=user,
                    tx_type=str(old_txn["tx_type"]),
                    payment_method=str(old_txn["payment_method"]),
                    amount=_to_decimal(old_txn["amount"]),
                    reference=str(old_txn["reference"] or ""),
                    tx_hash=str(old_txn["tx_hash"] or ""),
                    wallet_address_used=str(old_txn["wallet_address_used"] or ""),
                    status=str(old_txn["status"]),
                    notes=str(old_txn["notes"] or ""),
                    approved_by=approved_by,
                    created_at=_to_dt(old_txn["created_at"]),
                    updated_at=_to_dt(old_txn["updated_at"]),
                )

                if not dry_run:
                    txn.save(force_insert=True)
                created_transactions += 1

            # 6) Investments
            for old_inv in old_investments:
                old_inv_id = int(old_inv["id"])

                # Prefer preserving pk if available; if it conflicts, remap.
                preserve_pk = not UserInvestment.objects.filter(id=old_inv_id).exists()

                plan = plan_map.get(int(old_inv["plan_id"]))
                if not plan:
                    raise CommandError(
                        "Backup references an investment plan that does not exist and could not be restored. "
                        f"plan_id={old_inv['plan_id']}"
                    )

                inv = UserInvestment(
                    user=user,
                    plan=plan,
                    amount=_to_decimal(old_inv["amount"]),
                    status=str(old_inv["status"]),
                    started_at=_to_dt(old_inv["started_at"]),
                    ends_at=_to_dt(old_inv["ends_at"]),
                    created_at=_to_dt(old_inv["created_at"]),
                )

                if preserve_pk:
                    inv.id = old_inv_id

                if preserve_pk and UserInvestment.objects.filter(id=old_inv_id).exists():
                    skipped_investments += 1
                    investment_id_map[old_inv_id] = old_inv_id
                    continue

                if not dry_run:
                    try:
                        inv.save(force_insert=preserve_pk)
                    except IntegrityError:
                        # Fallback: create with a new id
                        inv.id = None
                        inv.save()
                created_investments += 1

                investment_id_map[old_inv_id] = int(inv.id)

            # 7) ROI payouts
            for old_payout in old_roi_payouts:
                old_inv_id = int(old_payout["investment_id"])
                new_inv_id = investment_id_map.get(old_inv_id)
                if not new_inv_id:
                    continue

                payout_date = _to_date(old_payout["payout_date"])
                amount = _to_decimal(old_payout["amount"])

                if DailyRoiPayout.objects.filter(
                    investment_id=new_inv_id, payout_date=payout_date
                ).exists():
                    skipped_roi_payouts += 1
                    continue

                payout = DailyRoiPayout(
                    investment_id=new_inv_id,
                    payout_date=payout_date,
                    amount=amount,
                )

                if not dry_run:
                    payout.save()
                created_roi_payouts += 1

        return RestoreSummary(
            created_user=created_user,
            updated_profile=updated_profile,
            updated_wallet=updated_wallet,
            created_transactions=created_transactions,
            skipped_transactions=skipped_transactions,
            created_investments=created_investments,
            skipped_investments=skipped_investments,
            created_roi_payouts=created_roi_payouts,
            skipped_roi_payouts=skipped_roi_payouts,
        )
