from __future__ import annotations

from decimal import ROUND_HALF_UP, Decimal
from typing import Optional

from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Sum

Q = Decimal("0.01")


def q2(x: Decimal) -> Decimal:
    return (x or Decimal("0.00")).quantize(Q, rounding=ROUND_HALF_UP)


class Command(BaseCommand):
    """
    Sync UserWallet.balance to represent ONLY *available* (spendable) funds.

    available_balance = deposits_completed - withdrawals_completed - active_principal_locked

    deposits_completed: Transaction(tx_type='deposit', status in approved/completed)
    withdrawals_completed: Transaction(tx_type='withdrawal', status in approved/completed)
    active_principal_locked: UserInvestment(status in active/approved)

    Use cases:
    - After recovery scripts/imports, wallets often drift (e.g., wallet == total deposits).
    - This command recalculates available from the ledger and active investments.
    """

    help = "Sync wallet balances from transactions + active investments (available = deposits - withdrawals - active principal)."

    def add_arguments(self, parser):
        parser.add_argument("--user-email", dest="user_email", help="Sync a single user by email (case-insensitive).")
        parser.add_argument("--all", action="store_true", help="Sync all users with activity.")
        parser.add_argument("--dry-run", action="store_true", help="Do not write changes.")
        parser.add_argument("--statuses", default="approved,completed",
                            help="Comma-separated tx statuses counted as completed (default: approved,completed).")
        parser.add_argument("--min-zero", action="store_true",
                            help="Clamp negative balances to 0.00.")

    def _get_models(self):
        User = apps.get_model("users", "User")
        UserWallet = apps.get_model("users", "UserWallet")
        Transaction = apps.get_model("transactions", "Transaction")
        UserInvestment = apps.get_model("investments", "UserInvestment")
        return User, UserWallet, Transaction, UserInvestment

    def _iter_users(self, User, Transaction, UserInvestment, user_email: str | None, all_users: bool):
        if user_email:
            return User.objects.filter(email__iexact=user_email.strip())
        if not all_users:
            return User.objects.none()

        tx_users = Transaction.objects.values_list("user_id", flat=True).distinct()
        inv_users = UserInvestment.objects.values_list("user_id", flat=True).distinct()
        return User.objects.filter(id__in=tx_users.union(inv_users))

    def handle(self, *args, **options):
        User, UserWallet, Transaction, UserInvestment = self._get_models()

        user_email = options.get("user_email")
        all_users = bool(options.get("all"))
        dry = bool(options.get("dry_run"))
        min_zero = bool(options.get("min_zero"))

        statuses = [s.strip() for s in (options.get("statuses") or "").split(",") if s.strip()]
        if not statuses:
            statuses = ["approved", "completed"]

        users = self._iter_users(User, Transaction, UserInvestment, user_email, all_users)
        if not user_email and not all_users:
            self.stdout.write(self.style.ERROR("Nothing to do. Use --user-email <email> or --all."))
            return

        processed = 0
        changed = 0

        for u in users.iterator():
            processed += 1
            with transaction.atomic():
                wallet, _ = UserWallet.objects.select_for_update().get_or_create(user=u)

                dep = (Transaction.objects
                       .filter(user=u, tx_type="deposit", status__in=statuses)
                       .aggregate(total=Sum("amount"))["total"] or Decimal("0.00"))

                wd = (Transaction.objects
                      .filter(user=u, tx_type="withdrawal", status__in=statuses)
                      .aggregate(total=Sum("amount"))["total"] or Decimal("0.00"))

                locked_principal = (UserInvestment.objects
                                    .filter(user=u, status__in=["active", "approved"])
                                    .aggregate(total=Sum("amount"))["total"] or Decimal("0.00"))

                new_balance = q2(dep) - q2(wd) - q2(locked_principal)
                if min_zero and new_balance < Decimal("0.00"):
                    new_balance = Decimal("0.00")

                old_balance = q2(getattr(wallet, "balance", Decimal("0.00")) or Decimal("0.00"))

                if new_balance != old_balance:
                    changed += 1
                    self.stdout.write(
                        f"{u.email}: deposits={q2(dep)} withdrawals={q2(wd)} "
                        f"active_principal={q2(locked_principal)} wallet {old_balance} -> {new_balance}"
                    )
                    if not dry:
                        wallet.balance = new_balance
                        wallet.save(update_fields=["balance"])
                else:
                    self.stdout.write(f"{u.email}: OK wallet={old_balance}")

        self.stdout.write(self.style.SUCCESS(f"Processed users: {processed}. Changed: {changed}. Dry-run: {dry}."))
