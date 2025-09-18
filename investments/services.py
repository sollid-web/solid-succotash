from django.db import transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from .models import UserInvestment, InvestmentPlan
from transactions.models import AdminAuditLog


@transaction.atomic
def approve_investment(investment: UserInvestment, admin_user: User, notes: str = "") -> UserInvestment:
    """
    Approve an investment and set start/end dates.
    """
    if investment.status != 'pending':
        raise ValidationError("Can only approve pending investments")
    
    # Set investment dates
    investment.status = 'approved'
    investment.started_at = timezone.now()
    investment.ends_at = investment.started_at + timedelta(days=investment.plan.duration_days)
    investment.save()
    
    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity='investment',
        entity_id=str(investment.id),
        action='approve',
        notes=notes
    )
    
    return investment


@transaction.atomic
def reject_investment(investment: UserInvestment, admin_user: User, notes: str = "") -> UserInvestment:
    """
    Reject an investment.
    """
    if investment.status != 'pending':
        raise ValidationError("Can only reject pending investments")
    
    # Update investment
    investment.status = 'rejected'
    investment.save()
    
    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity='investment',
        entity_id=str(investment.id),
        action='reject',
        notes=notes
    )
    
    return investment


def create_investment(user: User, plan: InvestmentPlan, amount: float) -> UserInvestment:
    """
    Create a new investment request.
    """
    # Validate amount within plan limits
    if amount < plan.min_amount:
        raise ValidationError(f"Minimum investment amount is ${plan.min_amount}")
    
    if amount > plan.max_amount:
        raise ValidationError(f"Maximum investment amount is ${plan.max_amount}")
    
    if amount <= 0:
        raise ValidationError("Investment amount must be positive")
    
    return UserInvestment.objects.create(
        user=user,
        plan=plan,
        amount=amount
    )