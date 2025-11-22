from django.contrib import admin, messages
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html

from .models import (
    AdminAuditLog,
    AdminNotification,
    CryptocurrencyWallet,
    Transaction,
    VirtualCard,
)
from .services import approve_transaction, reject_transaction


@admin.register(AdminNotification)
class AdminNotificationAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "notification_type",
        "user",
        "priority",
        "is_read",
        "is_resolved",
        "created_at",
        "action_links",
    ]
    list_filter = [
        "notification_type",
        "priority",
        "is_read",
        "is_resolved",
        "created_at",
    ]
    search_fields = ["title", "message", "user__email"]
    readonly_fields = ["created_at", "resolved_at"]
    ordering = ["-created_at"]

    fieldsets = (
        (
            "Notification Details",
            {"fields": ("notification_type", "title", "message", "priority")},
        ),
        ("Related Entity", {"fields": ("user", "entity_type", "entity_id")}),
        (
            "Status",
            {"fields": ("is_read", "is_resolved", "resolved_by", "resolved_at")},
        ),
        ("Timestamps", {"fields": ("created_at",)}),
    )

    @admin.display(description="Actions")
    def action_links(self, obj):
        """Display action links for the notification"""
        if obj.entity_type and obj.entity_id:
            if obj.entity_type == "transaction":
                try:
                    url = reverse("admin:transactions_transaction_change", args=[obj.entity_id])
                    return format_html('<a href="{}" class="button">View Transaction</a>', url)
                except:
                    pass
            elif obj.entity_type == "investment":
                try:
                    url = reverse("admin:investments_userinvestment_change", args=[obj.entity_id])
                    return format_html('<a href="{}" class="button">View Investment</a>', url)
                except:
                    pass
            elif obj.entity_type == "virtual_card":
                try:
                    url = reverse("admin:transactions_virtualcard_change", args=[obj.entity_id])
                    return format_html('<a href="{}" class="button">View Card</a>', url)
                except:
                    pass
        return "-"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "resolved_by")

    actions = ["mark_as_read", "mark_as_resolved"]

    @admin.action(description="Mark selected notifications as read")
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"{updated} notifications marked as read.")

    @admin.action(description="Mark selected notifications as resolved")
    def mark_as_resolved(self, request, queryset):
        updated = queryset.update(
            is_resolved=True, resolved_by=request.user, resolved_at=timezone.now()
        )
        self.message_user(request, f"{updated} notifications marked as resolved.")


@admin.register(VirtualCard)
class VirtualCardAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "card_type",
        "masked_card_number",
        "cardholder_name",
        "balance",
        "status",
        "is_active",
        "created_at",
    ]
    list_filter = ["card_type", "status", "is_active", "created_at"]
    search_fields = ["user__email", "cardholder_name", "card_number"]
    readonly_fields = [
        "id",
        "card_number",
        "cvv",
        "expiry_month",
        "expiry_year",
        "created_at",
        "updated_at",
        "expires_at",
    ]
    list_per_page = 25

    fieldsets = (
        (
            None,
            {"fields": ("user", "card_type", "purchase_amount", "status", "is_active")},
        ),
        (
            "Card Details",
            {
                "fields": (
                    "card_number",
                    "cardholder_name",
                    "expiry_month",
                    "expiry_year",
                    "cvv",
                    "balance",
                ),
                "classes": ("collapse",),
            },
        ),
        ("Admin Fields", {"fields": ("approved_by", "notes")}),
        (
            "Timestamps",
            {
                "fields": ("id", "created_at", "updated_at", "expires_at"),
                "classes": ("collapse",),
            },
        ),
    )

    @admin.display(description="Card Number")
    def masked_card_number(self, obj):
        return obj.get_masked_number()

    actions = ["approve_cards", "reject_cards", "generate_card_details"]

    @admin.action(description="Approve selected virtual cards")
    def approve_cards(self, request, queryset):
        count = 0
        for card in queryset.filter(status="pending"):
            card.status = "approved"
            card.approved_by = request.user
            card.is_active = True
            if not card.card_number:
                card.generate_card_details()
            card.save()
            count += 1

        self.message_user(request, f"Successfully approved {count} virtual card(s)")

    @admin.action(description="Reject selected virtual cards")
    def reject_cards(self, request, queryset):
        count = 0
        for card in queryset.filter(status="pending"):
            card.status = "rejected"
            card.approved_by = request.user
            card.save()
            count += 1

        self.message_user(request, f"Successfully rejected {count} virtual card(s)")

    @admin.action(description="Generate card details for approved cards")
    def generate_card_details(self, request, queryset):
        count = 0
        for card in queryset.filter(status__in=["approved", "active"]):
            if not card.card_number:
                card.generate_card_details()
                count += 1

        self.message_user(request, f"Generated card details for {count} card(s)")


@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(admin.ModelAdmin):
    list_display = [
        "currency",
        "display_wallet_address",
        "network",
        "is_active",
        "updated_at",
    ]
    list_filter = ["currency", "is_active", "network"]
    list_editable = ["is_active"]
    search_fields = ["currency", "wallet_address", "network"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (None, {"fields": ("currency", "wallet_address", "network", "is_active")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    @admin.display(description="Wallet Address")
    def display_wallet_address(self, obj):
        return format_html(
            '<span title="{}">{}<strong>...</strong></span>',
            obj.wallet_address,
            obj.wallet_address[:15],
        )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "tx_type",
        "payment_method",
        "amount",
        "status",
        "approved_by",
        "created_at",
    )
    list_filter = ("tx_type", "payment_method", "status", "created_at", "approved_by")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "reference",
        "tx_hash",
        "id",
    )
    readonly_fields = ("id", "created_at", "updated_at")
    date_hierarchy = "created_at"
    actions = ["approve_transactions", "reject_transactions"]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "id",
                    "user",
                    "tx_type",
                    "payment_method",
                    "amount",
                    "reference",
                    "status",
                )
            },
        ),
        (
            "Crypto Details",
            {
                "fields": ("tx_hash", "wallet_address_used"),
                "classes": ("collapse",),
                "description": "Cryptocurrency transaction details (if applicable)",
            },
        ),
        (
            "Admin Info",
            {"fields": ("notes", "approved_by", "created_at", "updated_at")},
        ),
    )

    @admin.action(
        description="Approve selected transactions and update wallets"
    )
    def approve_transactions(self, request, queryset):
        """Approve selected pending transactions and update user wallets"""
        approved_count = 0
        failed_count = 0

        for txn in queryset.filter(status="pending"):
            try:
                approve_transaction(
                    txn,
                    request.user,
                    f"Approved via admin action by {request.user.email}",
                )
                approved_count += 1
            except Exception as e:
                failed_count += 1
                messages.error(request, f"Failed to approve transaction {txn.id}: {str(e)}")

        if approved_count > 0:
            messages.success(
                request,
                f"Successfully approved {approved_count} transaction(s). User wallets have been updated.",
            )

        if failed_count > 0:
            messages.warning(request, f"Failed to approve {failed_count} transaction(s)")

    @admin.action(description="Reject selected transactions")
    def reject_transactions(self, request, queryset):
        """Reject selected pending transactions"""
        rejected_count = 0
        failed_count = 0

        for txn in queryset.filter(status="pending"):
            try:
                reject_transaction(
                    txn,
                    request.user,
                    f"Rejected via admin action by {request.user.email}",
                )
                rejected_count += 1
            except Exception as e:
                failed_count += 1
                messages.error(request, f"Failed to reject transaction {txn.id}: {str(e)}")

        if rejected_count > 0:
            messages.success(request, f"Successfully rejected {rejected_count} transaction(s)")

        if failed_count > 0:
            messages.warning(request, f"Failed to reject {failed_count} transaction(s)")

    def save_model(self, request, obj, form, change):
        """Ensure manual status changes go through service layer so wallets stay accurate."""
        if change and obj.pk:
            original = Transaction.objects.select_related("user").get(pk=obj.pk)
            new_status = form.cleaned_data.get("status")
            notes = form.cleaned_data.get("notes", "")

            if original.status == "pending" and new_status == "approved":
                approve_transaction(
                    original,
                    request.user,
                    notes or f"Approved via admin edit by {request.user.email}",
                )
                messages.success(
                    request, f"Transaction {original.id} approved and wallet credited."
                )
                return

            if original.status == "pending" and new_status == "rejected":
                reject_transaction(
                    original,
                    request.user,
                    notes or f"Rejected via admin edit by {request.user.email}",
                )
                messages.info(request, f"Transaction {original.id} rejected.")
                return

        super().save_model(request, obj, form, change)


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ("admin", "entity", "entity_id", "action", "created_at")
    list_filter = ("entity", "action", "created_at", "admin")
    search_fields = ("admin__email", "entity_id", "notes")
    readonly_fields = (
        "id",
        "admin",
        "entity",
        "entity_id",
        "action",
        "notes",
        "created_at",
    )
    date_hierarchy = "created_at"

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
