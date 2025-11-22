from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

User = get_user_model()


class InvestmentPlan(models.Model):
    name=models.CharField(max_length=100, unique=True)
    description: models.TextField = models.TextField()
    daily_roi: models.DecimalField = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00")),
            MaxValueValidator(Decimal("2.00")),
        ],
        help_text="Daily ROI percentage (0.00-2.00)",
    )
    duration_days: models.PositiveIntegerField = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    min_amount: models.DecimalField = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount: models.DecimalField = models.DecimalField(max_digits=12, decimal_places=2)
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.daily_roi}% daily"

    class Meta:
        db_table = "investments_plan"
        constraints = [
            models.CheckConstraint(
                check=models.Q(daily_roi__gte=Decimal("0.00"))
                & models.Q(daily_roi__lte=Decimal("2.00")),
                name="valid_daily_roi",
            ),
            models.CheckConstraint(check=models.Q(duration_days__gt=0), name="positive_duration"),
            models.CheckConstraint(
                check=models.Q(min_amount__lte=models.F("max_amount")),
                name="min_amount_lte_max_amount",
            ),
        ]
        indexes = [
            models.Index(fields=["name"]),
            models.Index(fields=["created_at"]),
        ]


class UserInvestment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
    ]

    user: models.ForeignKey = models.ForeignKey(User, on_delete=models.CASCADE, related_name="investments")
    plan: models.ForeignKey = models.ForeignKey(
        InvestmentPlan, on_delete=models.CASCADE, related_name="user_investments"
    )
    amount: models.DecimalField = models.DecimalField(
        max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))]
    )
    status: models.CharField = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    started_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    ends_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.email} - {self.plan.name} - ${self.amount}"

    @property
    def total_return(self):
        if not self.plan or self.amount is None:
            return Decimal("0.00")

        roi_rate = self.plan.daily_roi or Decimal("0")
        duration = Decimal(self.plan.duration_days or 0)

        projected = self.amount * (Decimal("1") + (roi_rate / Decimal("100")) * duration)
        return projected.quantize(Decimal("0.01"))

    class Meta:
        db_table = "investments_user_investment"
        constraints = [
            models.CheckConstraint(check=models.Q(amount__gt=0), name="positive_investment_amount"),
        ]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]


class DailyRoiPayout(models.Model):
    """Tracks ROI payout calculations on a per-day basis."""

    investment: models.ForeignKey = models.ForeignKey(
        UserInvestment,
        on_delete=models.CASCADE,
        related_name="daily_payouts",
    )
    payout_date: models.DateField = models.DateField()
    amount: models.DecimalField = models.DecimalField(max_digits=12, decimal_places=2)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("investment", "payout_date")
        ordering = ["-payout_date", "-created_at"]
        indexes = [
            models.Index(fields=["payout_date"]),
        ]

    def __str__(self):  # pragma: no cover - trivial representation
        return f"ROI payout {self.payout_date} for investment {self.investment_id}"
