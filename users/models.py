import uuid
from decimal import Decimal

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    # Custom User model extending AbstractUser
    # Add any custom fields here if needed
    pass


class Profile(models.Model):
    ROLE_CHOICES = [
        ("user", "User"),
        ("admin", "Admin"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")
    full_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.email} - {self.role}"

    class Meta:
        db_table = "users_profile"


class UserWallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet"
    )
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - ${self.balance}"

    class Meta:
        db_table = "users_wallet"


class UserNotification(models.Model):
    """Notifications for regular users"""

    NOTIFICATION_TYPES = [
        ("deposit_approved", "Deposit Approved"),
        ("deposit_rejected", "Deposit Rejected"),
        ("withdrawal_approved", "Withdrawal Approved"),
        ("withdrawal_rejected", "Withdrawal Rejected"),
        ("investment_approved", "Investment Approved"),
        ("investment_rejected", "Investment Rejected"),
        ("investment_completed", "Investment Completed"),
        ("card_approved", "Virtual Card Approved"),
        ("card_rejected", "Virtual Card Rejected"),
        ("wallet_credited", "Wallet Credited"),
        ("wallet_debited", "Wallet Debited"),
        ("roi_payout", "ROI Payout"),
        ("system_alert", "System Alert"),
        ("welcome", "Welcome Message"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications"
    )
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    action_url = models.CharField(
        max_length=255, blank=True, help_text="URL for user to take action"
    )
    entity_type = models.CharField(
        max_length=20, blank=True, help_text="e.g., 'transaction', 'investment'"
    )
    entity_id = models.CharField(
        max_length=100, blank=True, help_text="UUID or ID of related entity"
    )
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text="Auto-delete after this date"
    )

    def __str__(self):
        return f"{self.user.email} - {self.title}"

    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()

    class Meta:
        db_table = "users_notification"
        verbose_name = "User Notification"
        verbose_name_plural = "User Notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_read"]),
            models.Index(fields=["notification_type"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["is_read"]),
            models.Index(fields=["priority"]),
        ]
