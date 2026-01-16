from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from typing import cast

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from transactions.models import AdminAuditLog
from transactions.notifications import create_admin_notification
from users.models import UserWallet

from .models import DailyRoiPayout, InvestmentPlan, UserInvestment

User = get_user_model()


@transaction.atomic
def approve_investment(
    investment: UserInvestment,
    admin_user,
    notes: str = "",
) -> UserInvestment:
    """Approve a *pending* investment and debit the user's AVAILABLE wallet balance.

    Money model:
    - Wallet = AVAILABLE (spendable)
    - Principal becomes LOCKED once investment is approved
    """

    if investment.status != "pending":
        raise ValidationError("Can only approve pending investments")

    investment_user = cast(User, investment.user)

    # Lock wallet row to prevent race conditions.
    wallet, _ = UserWallet.objects.select_for_update().get_or_create(user=investment_user)

    investment_amount = (
        investment.amount
        if isinstance(investment.amount, Decimal)
        else Decimal(str(investment.amount))
    )

    if wallet.balance < investment_amount:
        raise ValidationError(
            f"Insufficient wallet balance for approval. "
            f"Balance ${wallet.balance}, required ${investment_amount}"
        )

    # Debit AVAILABLE wallet (principal becomes locked in investment)
    wallet.balance = (wallet.balance - investment_amount).quantize(Decimal("0.01"))
    wallet.save(update_fields=["balance", "updated_at"])

    # Set dates and mark approved
    investment.status = "approved"
    investment.started_at = timezone.now()
    investment.ends_at = investment.started_at + timedelta(days=investment.plan.duration_days)
    investment.save(update_fields=["status", "started_at", "ends_at"])

    # Audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="investment",
        entity_id=str(investment.id),
        action="approve",
        notes=notes,
    )

    # Resolve admin notifications (if present)
    try:
        from transactions.models import AdminNotification

        AdminNotification.objects.filter(
            entity_type="investment",
            entity_id=str(investment.id),
            is_resolved=False,
        ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())
    except Exception:
        pass

    # In-app notifications
    try:
        from users.notification_service import notify_investment_approved, notify_wallet_debited

        notify_investment_approved(investment_user, investment, notes)
        notify_wallet_debited(
            investment_user,
            investment_amount,
            reason=f"Investment approved for {investment.plan.name}",
        )
    except Exception:
        pass

    # Email notification (do not break flow if email fails)
    try:
        from core.email_service import EmailService

        EmailService.send_investment_notification(investment, "approved", notes)
        EmailService.send_admin_alert(
            subject="Investment Approved",
            message=(
                f"Investment {investment.id} for user {investment_user.email} was approved. "
                f"Amount: ${investment_amount}. Plan: {investment.plan.name}."
            ),
        )
    except Exception:
        pass

    return investment


@transaction.atomic
def reject_investment(
    investment: UserInvestment,
    admin_user,
    notes: str = "",
) -> UserInvestment:
    """Reject a *pending* investment."""

    if investment.status != "pending":
        raise ValidationError("Can only reject pending investments")

    investment_user = cast(User, investment.user)

    investment.status = "rejected"
    investment.save(update_fields=["status"])

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="investment",
        entity_id=str(investment.id),
        action="reject",
        notes=notes,
    )

    try:
        from transactions.models import AdminNotification

        AdminNotification.objects.filter(
            entity_type="investment",
            entity_id=str(investment.id),
            is_resolved=False,
        ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())
    except Exception:
        pass

    try:
        from users.notification_service import notify_investment_rejected

        notify_investment_rejected(investment_user, investment, notes)
    except Exception:
        pass

    try:
        from core.email_service import EmailService

        EmailService.send_investment_notification(investment, "rejected", notes)
        EmailService.send_admin_alert(
            subject="Investment Rejected",
            message=(
                f"Investment {investment.id} for user {investment_user.email} was rejected. "
                f"Amount: ${investment.amount}. Plan: {investment.plan.name}. Notes: {notes or 'N/A'}."
            ),
        )
    except Exception:
        pass

    return investment


def create_investment(
    user,
    plan: InvestmentPlan,
    amount: float | Decimal,
) -> UserInvestment:
    """Create a new *pending* investment request.

    IMPORTANT:
    - This does NOT debit the wallet.
    - Wallet is debited ONLY on approve_investment() (admin workflow).
    """

    amount_decimal = amount if isinstance(amount, Decimal) else Decimal(str(amount))
    amount_decimal = amount_decimal.quantize(Decimal("0.01"))

    if amount_decimal <= 0:
        raise ValidationError("Investment amount must be positive")

    if amount_decimal < plan.min_amount:
        raise ValidationError(f"Minimum investment amount is ${plan.min_amount}")

    if amount_decimal > plan.max_amount:
        raise ValidationError(f"Maximum investment amount is ${plan.max_amount}")

    wallet, _ = UserWallet.objects.get_or_create(user=user)
    if wallet.balance < amount_decimal:
        raise ValidationError(
            "Insufficient balance. Wallet balance is "
            f"${wallet.balance}; investment requires ${amount_decimal}"
        )

    investment = UserInvestment.objects.create(
        user=user,
        plan=plan,
        amount=amount_decimal,
        status="pending",
    )

    # Admin notification
    priority = "high" if amount_decimal >= Decimal("15000") else "medium"
    title = f"New Investment Request: ${amount_decimal}"
    message = (
        f"User {getattr(user, 'email', None) or getattr(user, 'username', '')} submitted an investment request for "
        f"${amount_decimal} in the {plan.name} plan ({plan.daily_roi}% daily for {plan.duration_days} days)."
    )

    create_admin_notification(
        notification_type="new_investment",
        title=title,
        message=message,
        user=user,
        entity_type="investment",
        entity_id=str(investment.id),
        priority=priority,
    )

    # User email (optional)
    try:
        from core.email_service import EmailService

        EmailService.send_investment_notification(investment, "created")
    except Exception:
        pass

    return investment


@transaction.atomic
def recalculate_investment_end_date(
    *,
    investment: UserInvestment,
    admin_user,
    notes: str = "",
) -> UserInvestment:
    """Recalculate ends_at from started_at + duration_days.

    This does NOT change wallet balances.
    """

    if investment.started_at is None:
        raise ValidationError("Cannot recalculate end date without started_at")

    expected_end = investment.started_at + timedelta(days=investment.plan.duration_days)

    if investment.ends_at == expected_end:
        return investment

    investment.ends_at = expected_end
    investment.save(update_fields=["ends_at"])

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="investment",
        entity_id=str(investment.id),
        action="recalculate_end_date",
        notes=notes or "Recalculated investment end date",
    )

    return investment


@transaction.atomic
def credit_roi_payout(payout: DailyRoiPayout, actor=None):
    """Record daily ROI profit for an investment WITHOUT crediting wallet.

    Profit stays LOCKED while the plan is active.
    Wallet release should be handled separately when the investment expires.
    """

    from transactions.models import Transaction

    payout = DailyRoiPayout.objects.select_for_update().select_related(
        "investment", "investment__user"
    ).get(pk=payout.pk)

    # Idempotent exit
    if payout.credited_at and payout.credited_tx:
        return payout.credited_tx

    inv = payout.investment
    investment_user = inv.user

    # Unique per payout
    ref = f"ROI:{payout.id}"

    txn = Transaction.objects.create(
        user=investment_user,
        investment=inv,
        tx_type="profit",
        payment_method="bank_transfer",
        amount=payout.amount,
        status="completed",
        reference=ref,
        notes=f"Daily profit locked until plan expires (payout_date={payout.payout_date})",
    )

    payout.credited_at = timezone.now()
    payout.credited_tx = txn.id
    payout.save(update_fields=["credited_at", "credited_tx"])

    if actor:
        AdminAuditLog.objects.create(
            admin=actor,
            entity="roi_payout",
            entity_id=str(payout.id),
            action="profit_recorded",
            notes=f"ROI payout recorded: {payout.amount} for investment {inv.id} on {payout.payout_date}",
        )

    return txn.id
