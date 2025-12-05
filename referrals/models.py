import uuid
from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

User = settings.AUTH_USER_MODEL


def gen_code():
    return uuid.uuid4().hex[:8].upper()


class ReferralCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='referral_code')
    code = models.CharField(max_length=32, unique=True, default=gen_code)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'referral_codes'
        verbose_name = 'Referral Code'
        verbose_name_plural = 'Referral Codes'

    def __str__(self):
        return f"{self.user} → {self.code}"


class Referral(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_CREDITED = 'credited'
    STATUS_REJECTED = 'rejected'
    STATUS_FLAGGED = 'flagged'
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_CREDITED, 'Credited'),
        (STATUS_REJECTED, 'Rejected'),
        (STATUS_FLAGGED, 'Flagged'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referred_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referred_referrals')
    referrer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='referrals_made')
    code = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    reward_processed = models.BooleanField(default=False)
    reward_processed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'referrals'
        indexes = [
            models.Index(fields=['referred_user']),
            models.Index(fields=['referrer']),
            models.Index(fields=['code']),
            models.Index(fields=['status']),
        ]
        verbose_name = 'Referral'
        verbose_name_plural = 'Referrals'

    def __str__(self):
        return f"{self.referrer} → {self.referred_user} ({self.status})"

    def mark_credited(self):
        self.reward_processed = True
        self.reward_processed_at = timezone.now()
        self.status = self.STATUS_CREDITED
        self.save(update_fields=['reward_processed', 'reward_processed_at', 'status'])


class ReferralReward(models.Model):
    TYPE_SIGNUP = 'signup_bonus'
    TYPE_DEPOSIT = 'deposit_pct'
    TYPE_MANUAL = 'manual'
    TYPE_CHOICES = [
        (TYPE_SIGNUP, 'Signup Bonus'),
        (TYPE_DEPOSIT, 'Deposit Percentage'),
        (TYPE_MANUAL, 'Manual Grant'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='rewards', null=True, blank=True)
    reward_type = models.CharField(max_length=32, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=20, decimal_places=8, validators=[MinValueValidator(Decimal('0'))])
    currency = models.CharField(max_length=8, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    approved_at = models.DateTimeField(null=True, blank=True)
    meta = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'referral_rewards'
        verbose_name = 'Referral Reward'
        verbose_name_plural = 'Referral Rewards'

    def __str__(self):
        return f"{self.reward_type} - {self.amount} {self.currency}"

    def approve(self, approver=None):
        self.approved = True
        self.approved_by = approver
        self.approved_at = timezone.now()
        self.save(update_fields=['approved', 'approved_by', 'approved_at'])


class ReferralSetting(models.Model):
    key = models.CharField(max_length=64, unique=True)
    value = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'referral_settings'
        verbose_name = 'Referral Setting'
        verbose_name_plural = 'Referral Settings'

    def __str__(self):
        return self.key

    @staticmethod
    def get(key, default=None):
        try:
            return ReferralSetting.objects.get(key=key).value
        except ReferralSetting.DoesNotExist:
            return default
