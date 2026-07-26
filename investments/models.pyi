from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from django.db import models

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
    started_at: datetime | None
    ends_at: datetime | None
    created_at: datetime

class DailyRoiPayout(models.Model):
    investment: UserInvestment
    payout_date: datetime
    amount: Decimal
    created_at: datetime
