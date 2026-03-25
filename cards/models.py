from django.conf import settings
from django.db import models


class VirtualCard(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("cancelled", "Cancelled"),
    ]

    # ── Link to your existing User ─────────────────
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="virtual_card"
    )

    # ── Stripe IDs (stored safely) ─────────────────
    stripe_cardholder_id = models.CharField(
        max_length=255, blank=True, null=True, help_text="Stripe cardholder ID: ich_xxx"
    )
    stripe_card_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Stripe card ID: ic_xxx — use this to fetch card details",
    )

    # ── Safe Card Info (NO full number/CVV stored!) ─
    last4 = models.CharField(max_length=4, blank=True, null=True)
    exp_month = models.IntegerField(blank=True, null=True)
    exp_year = models.IntegerField(blank=True, null=True)
    brand = models.CharField(max_length=20, default="visa")
    card_type = models.CharField(max_length=20, default="virtual")

    # ── Business Logic ─────────────────────────────
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # ── Timestamps ─────────────────────────────────
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    activated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Virtual Card"

    def __str__(self):
        return f"{self.user.email} — {self.brand.upper()} •••• {self.last4} [{self.status}]"


class CardTransaction(models.Model):
    """Track every payment made with the card"""

    card = models.ForeignKey(VirtualCard, on_delete=models.CASCADE, related_name="transactions")
    stripe_auth_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="usd")
    merchant = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50)  # approved / declined
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"${self.amount} at {self.merchant} [{self.status}]"
