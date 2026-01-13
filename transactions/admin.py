from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from transactions.models import (
    AdminAuditLog,
    AdminNotification,
    CryptocurrencyWallet,
    Transaction,
    VirtualCard,
)
from transactions.services import (
    approve_transaction,
    reject_transaction,
    create_transaction,
)

# ------------------------------------------------------------------
# ADMIN NOTIFICATIONS
# ------------------------------------------------------------------

@admin.register(AdminNotification)
class AdminNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "notification_type",
        "user",
        "priority",
        "is_read",
        "is_resolved",
        "created_at",
        "action_links",
    )
    list_filter = (
        "notification_type",
        "priority",
        "is_read",
        "is_resolved",
        "created_at",
    )
    search_fields = ("title", "message", "user__email")
    readonly_fields = ("created_at", "resolved_at")
    ordering = ("-created_at",)

    @admin.display(description="Actions")
    def action_links(self, obj):
        if obj.entity_type == "transaction":
            return format_html(
                '<a href="{}">View Transaction</a>',
                reverse("admin:transactions_transaction_change", args=[obj.entity_id]),
            )
        if obj.entity_type == "investment":
            return format_html(
                '<a href="{}">View Investment</a>',
                reverse("admin:investments_userinvestment_change", args=[obj.entity_id]),
            )
        return "-"

    actions = ["mark_as_read", "mark_as_resolved"]

    @admin.action(description="Mark selected as read")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, "Notifications marked as read.")

    @admin.action(description="Mark selected as resolved")
    def mark_as_resolved(self, request, queryset):
        queryset.update(
            is_resolved=True,
            resolved_by=request.user,
            resolved_at=timezone.now(),
        )
        self.message_user(request, "Notifications marked as resolved.")


# ------------------------------------------------------------------
# VIRTUAL CARDS
# ------------------------------------------------------------------

@admin.register(VirtualCard)
class VirtualCardAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "card_type",
        "masked_card_number",
        "balance",
        "status",
        "is_active",
        "created_at",
    )
    list_filter = ("card_type", "status", "is_active")
    search_fields = ("user__email", "cardholder_name")

    @admin.display(description="Card")
    def masked_card_number(self, obj):
        return obj.get_masked_number()

    actions = ["approve_cards", "reject_cards"]

    @admin.action(description="Approve selected cards")
    def approve_cards(self, request, queryset):
        for card in queryset.filter(status="pending"):
            card.status = "approved"
            card.approved_by = request.user
            card.is_active = True
            card.save()
        self.message_user(request, "Cards approved.")

    @admin.action(description="Reject selected cards")
    def reject_cards(self, request, queryset):
        queryset.filter(status="pending").update(status="rejected")
        self.message_user(request, "Cards rejected.")


# ------------------------------------------------------------------
# CRYPTO WALLETS
# ------------------------------------------------------------------

@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(admin.ModelAdmin):
    list_display = ("currency", "network", "short_address", "is_active", "updated_at")
    list_filter = ("currency", "network", "is_active")

    @admin.display(description="Wallet")
    def short_address(self, obj):
        return f"{obj.wallet_address[:10]}..."


# ------------------------------------------------------------------
# TRANSACTIONS (CORE FINANCE CONTROL)
# ------------------------------------------------------------------

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "tx_type",
        "amount",
        "status",
        "payment_method",
        "approved_by",
        "created_at",
    )
    list_filter = ("tx_type", "status", "payment_method", "created_at")
    search_fields = ("user__email", "reference", "tx_hash")
    readonly_fields = ("id", "created_at", "updated_at")

    actions = [
        "admin_approve",
        "admin_reject",
        "manual_credit",
        "manual_debit",
    ]

    # ---------------- SAFE ACTIONS ----------------

    @admin.action(description="Approve selected (SAFE)")
    def admin_approve(self, request, queryset):
        success, failed = 0, 0
        for tx in queryset.filter(status="pending"):
            try:
                approve_transaction(tx, request.user, "Approved via admin")
                success += 1
            except ValidationError as exc:
                failed += 1
                messages.error(request, f"{tx.id}: {exc}")

        if success:
            messages.success(request, f"Approved {success} transaction(s).")
        if failed:
            messages.warning(request, f"{failed} failed.")

    @admin.action(description="Reject selected (SAFE)")
    def admin_reject(self, request, queryset):
        for tx in queryset.filter(status="pending"):
            reject_transaction(tx, request.user, "Rejected via admin")
        messages.info(request, "Transactions rejected.")

    # ---------------- MANUAL OVERRIDES ----------------

    @admin.action(description="Manual CREDIT (Admin)")
    def manual_credit(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(request, "Select exactly one row.", level="error")
            return

        tx = queryset.first()
        try:
            new_tx = create_transaction(
                user=tx.user,
                tx_type="deposit",
                amount=tx.amount,
                payment_method="admin_adjustment",
                reference="Manual admin credit",
            )
            approve_transaction(new_tx, request.user, "Manual credit")
            self.message_user(request, "Wallet credited.")
        except ValidationError as exc:
            self.message_user(request, str(exc), level="error")

    @admin.action(description="Manual DEBIT (Admin)")
    def manual_debit(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(request, "Select exactly one row.", level="error")
            return

        tx = queryset.first()
        try:
            new_tx = create_transaction(
                user=tx.user,
                tx_type="withdrawal",
                amount=tx.amount,
                payment_method="admin_adjustment",
                reference="Manual admin debit",
            )
            approve_transaction(new_tx, request.user, "Manual debit")
            self.message_user(request, "Wallet debited.")
        except ValidationError as exc:
            self.message_user(request, str(exc), level="error")


# ------------------------------------------------------------------
# AUDIT LOG (READ ONLY)
# ------------------------------------------------------------------

@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ("admin", "entity", "entity_id", "action", "created_at")
    readonly_fields = (
        "id",
        "admin",
        "entity",
        "entity_id",
        "action",
        "notes",
        "created_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
