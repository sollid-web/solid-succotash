import uuid
from datetime import datetime
from decimal import Decimal

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Profile(models.Model):
    user: AbstractUser | None
    role: str
    full_name: str
    created_at: datetime
    email_notifications_enabled: bool
    email_welcome: bool
    email_transactions: bool
    email_investments: bool
    email_roi_payouts: bool
    email_wallet_updates: bool
    email_security_alerts: bool
    email_marketing: bool

class UserWallet(models.Model):
    user: AbstractUser | None
    balance: Decimal
    updated_at: datetime

class UserNotification(models.Model):
    id: uuid.UUID
    user: AbstractUser | None
    notification_type: str
    title: str
    message: str
    action_url: str
    entity_type: str
    entity_id: str
    priority: str
    is_read: bool
    read_at: datetime | None
    created_at: datetime
    expires_at: datetime | None
