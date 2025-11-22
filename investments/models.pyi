from typing import Optional
from decimal import Decimal
from datetime import datetime
from django.contrib.auth.models import User

class InvestmentPlan(models.Model):
    name: str
    description: str
    daily_roi: Decimal
    duration_days: int
    min_amount: Decimal
    max_amount: Decimal
    created_at: datetime

class UserInvestment(models.Model):
    id: int
    user: User
    plan: InvestmentPlan
    amount: Decimal
    status: str
    started_at: Optional[datetime]
    ends_at: Optional[datetime]
    created_at: datetime

class DailyRoiPayout(models.Model):
    investment: UserInvestment
    payout_date: datetime
    amount: Decimal
    created_at: datetime
