from django.contrib.auth.models import User
from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
import uuid


class Transaction(models.Model):
    TYPE_CHOICES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    tx_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    reference = models.TextField(help_text="Reference number, notes, or proof of payment")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True, help_text="Admin notes")
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_transactions'
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.tx_type} - ${self.amount} - {self.status}"
    
    class Meta:
        db_table = 'transactions_transaction'
        constraints = [
            models.CheckConstraint(
                check=models.Q(amount__gt=0),
                name='positive_transaction_amount'
            ),
        ]
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['tx_type', 'status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['status']),
        ]
        ordering = ['-created_at']


class AdminAuditLog(models.Model):
    ENTITY_CHOICES = [
        ('transaction', 'Transaction'),
        ('investment', 'Investment'),
        ('plan', 'Plan'),
        ('user', 'User'),
    ]
    
    ACTION_CHOICES = [
        ('approve', 'Approve'),
        ('reject', 'Reject'),
        ('update', 'Update'),
        ('create', 'Create'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    entity = models.CharField(max_length=20, choices=ENTITY_CHOICES)
    entity_id = models.CharField(max_length=100)  # Can store UUID or int
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.admin.email} - {self.action} {self.entity} {self.entity_id}"
    
    class Meta:
        db_table = 'transactions_audit_log'
        indexes = [
            models.Index(fields=['admin']),
            models.Index(fields=['entity', 'entity_id']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
