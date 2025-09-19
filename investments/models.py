from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()


class InvestmentPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    daily_roi = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(2.00)],
        help_text="Daily ROI percentage (0.00-2.00)"
    )
    duration_days = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.name} - {self.daily_roi}% daily"
    
    class Meta:
        db_table = 'investments_plan'
        constraints = [
            models.CheckConstraint(
                check=models.Q(daily_roi__gte=0) & models.Q(daily_roi__lte=2.00),
                name='valid_daily_roi'
            ),
            models.CheckConstraint(
                check=models.Q(duration_days__gt=0),
                name='positive_duration'
            ),
            models.CheckConstraint(
                check=models.Q(min_amount__lte=models.F('max_amount')),
                name='min_amount_lte_max_amount'
            ),
        ]
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['created_at']),
        ]


class UserInvestment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    plan = models.ForeignKey(InvestmentPlan, on_delete=models.CASCADE, related_name='user_investments')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} - ${self.amount}"
    
    @property
    def total_return(self):
        if self.started_at and self.ends_at and self.status == 'approved':
            days = (self.ends_at - self.started_at).days
            return self.amount * (1 + (self.plan.daily_roi / 100) * days)
        return self.amount
    
    class Meta:
        db_table = 'investments_user_investment'
        constraints = [
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='positive_investment_amount'
            ),
        ]
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
