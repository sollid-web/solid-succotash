import uuid
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

User = get_user_model()


class CryptocurrencyWallet(models.Model):
    CRYPTO_CHOICES = [
        ("BTC", "Bitcoin"),
        ("USDT", "Tether USD"),
        ("USDC", "USD Coin"),
        ("ETH", "Ethereum"),
    ]

    currency: models.CharField = models.CharField(
        max_length=10,
        choices=CRYPTO_CHOICES,
        unique=True,
    )
    wallet_address: models.CharField = models.CharField(
        max_length=255,
        help_text="Wallet address for receiving deposits",
    )
    network: models.CharField = models.CharField(
        max_length=50,
        blank=True,
        help_text="Network (e.g., ERC-20, TRC-20, BEP-20)",
    )
    is_active: models.BooleanField = models.BooleanField(
        default=True,
        help_text="Whether this wallet is accepting deposits",
    )
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.currency} - {self.wallet_address[:10]}..."

    class Meta:
        db_table = "transactions_crypto_wallet"
        verbose_name = "Cryptocurrency Wallet"
        verbose_name_plural = "Cryptocurrency Wallets"
        ordering = ["currency"]


class Transaction(models.Model):
    investment = models.ForeignKey(
        "investments.UserInvestment",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    TYPE_CHOICES = [
        ("deposit", "Deposit"),
        ("withdrawal", "Withdrawal"),
        ("profit", "Profit"),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("bank_transfer", "Bank Transfer"),
        ("BTC", "Bitcoin"),
        ("USDT", "Tether USD"),
        ("USDC", "USD Coin"),
        ("ETH", "Ethereum"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("completed", "Completed"),
    ]

    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    tx_type: models.CharField = models.CharField(max_length=20, choices=TYPE_CHOICES)
    payment_method: models.CharField = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default="bank_transfer",
    )
    amount: models.DecimalField = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    reference: models.TextField = models.TextField(
        help_text="Reference number, notes, or proof of payment",
    )
    tx_hash: models.CharField = models.CharField(
        max_length=255,
        blank=True,
        help_text="Cryptocurrency transaction hash",
    )
    wallet_address_used: models.CharField = models.CharField(
        max_length=255,
        blank=True,
        help_text="Wallet address used for crypto deposit",
    )
    status: models.CharField = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )
    notes: models.TextField = models.TextField(blank=True, help_text="Admin notes")
    approved_by: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_transactions",
    )
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.tx_type} - ${self.amount} - {self.status}"

    def is_crypto(self):
        return self.payment_method in ["BTC", "USDT", "USDC", "ETH"]

    class Meta:
        db_table = "transactions_transaction"
        constraints = [
            models.CheckConstraint(
                check=models.Q(amount__gt=Decimal("0.00")),
                name="positive_transaction_amount",
            ),
            models.UniqueConstraint(
                fields=["reference"],
                name="uniq_transaction_reference",
            ),
        ]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["tx_type", "status"]),
            models.Index(fields=["payment_method"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["status"]),
        ]
        ordering = ["-created_at"]


class VirtualCard(models.Model):
    CARD_TYPE_CHOICES = [
        ("visa", "Visa Virtual Card"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("expired", "Expired"),
    ]

    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="virtual_cards",
    )
    card_type: models.CharField = models.CharField(
        max_length=20,
        choices=CARD_TYPE_CHOICES,
        default="visa",
    )
    card_number: models.CharField = models.CharField(
        max_length=16,
        blank=True,
        help_text="Generated card number",
    )
    cardholder_name: models.CharField = models.CharField(max_length=100, blank=True)
    expiry_month: models.CharField = models.CharField(max_length=2, blank=True)
    expiry_year: models.CharField = models.CharField(max_length=2, blank=True)
    cvv: models.CharField = models.CharField(max_length=3, blank=True)
    balance: models.DecimalField = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    purchase_amount: models.DecimalField = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("1000.00"),
    )
    status: models.CharField = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )
    is_active: models.BooleanField = models.BooleanField(default=False)
    approved_by: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_cards",
    )
    notes: models.TextField = models.TextField(blank=True, help_text="Admin notes")
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    expires_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.card_type} - {self.card_number[-4:] if self.card_number else 'Pending'}"

    def generate_card_details(self):
        """Generate card number, CVV, and expiry date"""
        import random
        from datetime import datetime, timedelta

        # Generate card number (starts with 4 for Visa)
        self.card_number = "4" + "".join([str(random.randint(0, 9)) for _ in range(15)])

        # Generate CVV
        self.cvv = "".join([str(random.randint(0, 9)) for _ in range(3)])

        # Set cardholder name
        self.cardholder_name = self.user.get_full_name() or self.user.email.split("@")[0].upper()

        # Set expiry date (3 years from now)
        expiry_date = datetime.now() + timedelta(days=365 * 3)
        self.expiry_month = f"{expiry_date.month:02d}"
        self.expiry_year = f"{expiry_date.year % 100:02d}"
        self.expires_at = expiry_date

        self.save()

    def get_masked_number(self):
        """Return masked card number for display"""
        if self.card_number:
            return f"****-****-****-{self.card_number[-4:]}"
        return "****-****-****-****"

    class Meta:
        db_table = "transactions_virtual_card"
        verbose_name = "Virtual Card"
        verbose_name_plural = "Virtual Cards"
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(balance__gte=Decimal("0.00")),
                name="positive_card_balance",
            ),
            models.CheckConstraint(
                check=models.Q(purchase_amount__gt=Decimal("0.00")),
                name="positive_purchase_amount",
            ),
        ]


class AdminNotification(models.Model):
    NOTIFICATION_TYPES = [
        ("new_deposit", "New Deposit Request"),
        ("new_withdrawal", "New Withdrawal Request"),
        ("new_investment", "New Investment Request"),
        ("new_card_request", "New Virtual Card Request"),
        ("user_registration", "New User Registration"),
        ("new_kyc", "New KYC Submission"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    ]

    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    notification_type: models.CharField = models.CharField(
        max_length=30,
        choices=NOTIFICATION_TYPES,
    )
    title: models.CharField = models.CharField(max_length=200)
    message: models.TextField = models.TextField()
    user: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="admin_notifications",
        null=True,
        blank=True,
    )
    entity_type: models.CharField = models.CharField(max_length=20, null=True, blank=True)
    entity_id: models.CharField = models.CharField(max_length=100, null=True, blank=True)
    priority: models.CharField = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default="medium",
    )
    is_read: models.BooleanField = models.BooleanField(default=False)
    is_resolved: models.BooleanField = models.BooleanField(default=False)
    resolved_by: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resolved_notifications",
    )
    resolved_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} - {self.priority} priority"

    def mark_as_read(self):
        self.is_read = True
        self.save()

    def mark_as_resolved(self, resolved_by=None):
        self.is_resolved = True
        self.resolved_by = resolved_by
        self.resolved_at = timezone.now()
        self.save()

    class Meta:
        db_table = "transactions_admin_notification"
        verbose_name = "Admin Notification"
        verbose_name_plural = "Admin Notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["notification_type"]),
            models.Index(fields=["is_read"]),
            models.Index(fields=["is_resolved"]),
            models.Index(fields=["priority"]),
            models.Index(fields=["created_at"]),
            models.Index(fields=["user"]),
        ]


class AdminAuditLog(models.Model):
    ENTITY_CHOICES = [
        ("transaction", "Transaction"),
        ("investment", "Investment"),
        ("plan", "Plan"),
        ("user", "User"),
        ("kyc", "KYC Application"),
        ("roi_payout", "ROI Payout"),
    ]

    ACTION_CHOICES = [
        ("approve", "Approve"),
        ("reject", "Reject"),
        ("update", "Update"),
        ("create", "Create"),
        ("auto_credit", "Auto Credit"),
        ("recalculate_end_date", "Recalculate End Date"),
    ]

    id: models.UUIDField = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    admin: models.ForeignKey = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="audit_logs",
    )
    entity: models.CharField = models.CharField(max_length=20, choices=ENTITY_CHOICES)
    entity_id: models.CharField = models.CharField(max_length=100)
    action: models.CharField = models.CharField(max_length=20, choices=ACTION_CHOICES)
    notes: models.TextField = models.TextField(blank=True)
    created_at: models.DateTimeField = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.admin.email} - {self.action} {self.entity} {self.entity_id}"

    class Meta:
        db_table = "transactions_audit_log"
        indexes = [
            models.Index(fields=["admin"]),
            models.Index(fields=["entity", "entity_id"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]
