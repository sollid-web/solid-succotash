from datetime import timedelta
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from transactions.models import AdminAuditLog
from transactions.notifications import create_admin_notification
from users.models import UserWallet

from .models import InvestmentPlan, UserInvestment


@transaction.atomic
def approve_investment(
    investment: UserInvestment, admin_user: User, notes: str = ""
) -> UserInvestment:
    """
    Approve an investment, set dates, and debit the user's wallet.
    """
    if investment.status != "pending":
        raise ValidationError("Can only approve pending investments")

    # Lock the user's wallet row to keep balances consistent during approval
    try:
        wallet = UserWallet.objects.select_for_update().get(user=investment.user)
    except UserWallet.DoesNotExist:
        wallet = UserWallet.objects.create(user=investment.user)

    investment_amount = (
        investment.amount
        if isinstance(investment.amount, Decimal)
        else Decimal(str(investment.amount))
    )

    if wallet.balance < investment_amount:
        raise ValidationError(
            f"Insufficient wallet balance for approval. Balance ${wallet.balance}, required ${investment_amount}"
        )
    wallet.balance -= investment_amount
    wallet.save(update_fields=["balance", "updated_at"])

    # Set investment dates
    investment.status = "approved"
    investment.started_at = timezone.now()
    investment.ends_at = investment.started_at + timedelta(days=investment.plan.duration_days)
    investment.save()

    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="investment",
        entity_id=str(investment.id),
        action="approve",
        notes=notes,
    )

    # Mark related admin notifications as resolved
    from transactions.models import AdminNotification

    AdminNotification.objects.filter(
        entity_type="investment", entity_id=str(investment.id), is_resolved=False
    ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())

    # Send user notification
    from users.notification_service import notify_investment_approved

    notify_investment_approved(investment.user, investment, notes)

    from users.notification_service import notify_wallet_debited

    notify_wallet_debited(
        investment.user,
        investment_amount,
        reason=f"Investment approved for {investment.plan.name}",
    )

    return investment


@transaction.atomic
def reject_investment(
    investment: UserInvestment, admin_user: User, notes: str = ""
) -> UserInvestment:
    """
    Reject an investment.
    """
    if investment.status != "pending":
        raise ValidationError("Can only reject pending investments")

    # Update investment
    investment.status = "rejected"
    investment.save()

    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="investment",
        entity_id=str(investment.id),
        action="reject",
        notes=notes,
    )

    # Mark related admin notifications as resolved
    from transactions.models import AdminNotification

    AdminNotification.objects.filter(
        entity_type="investment", entity_id=str(investment.id), is_resolved=False
    ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())

    # Send user notification
    from users.notification_service import notify_investment_rejected

    notify_investment_rejected(investment.user, investment, notes)

    return investment


def create_investment(user: User, plan: InvestmentPlan, amount: float) -> UserInvestment:
    """
    Create a new investment request and notify admins.
    """
    amount_decimal = amount if isinstance(amount, Decimal) else Decimal(str(amount))
    amount_display = amount_decimal.quantize(Decimal("0.01"))

    # Validate amount within plan limits
    if amount_decimal < plan.min_amount:
        raise ValidationError(f"Minimum investment amount is ${plan.min_amount}")

    if amount_decimal > plan.max_amount:
        raise ValidationError(f"Maximum investment amount is ${plan.max_amount}")

    if amount_decimal <= 0:
        raise ValidationError("Investment amount must be positive")

    wallet, _ = UserWallet.objects.get_or_create(user=user)
    if wallet.balance < amount_decimal:
        raise ValidationError(
            f"Insufficient balance. Wallet balance is ${wallet.balance}; investment requires ${amount_decimal}"
        )

    investment = UserInvestment.objects.create(user=user, plan=plan, amount=amount_decimal)

    # Create admin notification
    priority = "high" if amount_decimal >= Decimal("15000") else "medium"
    title = f"New Investment Request: ${amount_display}"
    message = (
        f"User {user.email} has submitted an investment request for ${amount_display} "
        f"in the {plan.name} plan ({plan.daily_roi}% daily for {plan.duration_days} days)."
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

    return investment
