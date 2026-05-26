import os
from django.contrib import admin, messages
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.utils.html import format_html
from unfold.admin import ModelAdmin as UnfoldModelAdmin

from .models import AdminAuditLog, CryptocurrencyWallet, Transaction, VirtualCard
from .services import approve_transaction, reject_transaction


# ─────────────────────────────────────────────
# TRANSACTION ADMIN
# ─────────────────────────────────────────────

@admin.register(Transaction)
class TransactionAdmin(UnfoldModelAdmin):
    list_display = (
        "user_email",
        "tx_type_badge",
        "amount_display",
        "payment_method",
        "status_badge",
        "created_at",
        "approved_by",
    )
    list_filter = ("tx_type", "status", "payment_method", "created_at")
    search_fields = ("user__email", "tx_hash", "wallet_address_used", "reference")
    readonly_fields = (
        "id",
        "created_at",
        "updated_at",
        "approved_by",
        "tx_hash_link",
    )
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 50
    actions = ["admin_approve", "admin_reject"]

    fieldsets = (
        ("Transaction Info", {
            "fields": ("id", "user", "tx_type", "amount", "payment_method", "status")
        }),
        ("Crypto Details", {
            "fields": ("tx_hash", "tx_hash_link", "wallet_address_used"),
            "classes": ("collapse",),
        }),
        ("Reference & Notes", {
            "fields": ("reference", "notes", "investment"),
        }),
        ("Audit", {
            "fields": ("approved_by", "created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ("user", "tx_type", "amount", "payment_method")
        return self.readonly_fields

    # ── Display helpers ──────────────────────

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"
    user_email.admin_order_field = "user__email"

    def amount_display(self, obj):
        return format_html("<strong>${}</strong>", obj.amount)
    amount_display.short_description = "Amount"
    amount_display.admin_order_field = "amount"

    def tx_type_badge(self, obj):
        colors = {
            "deposit": "#16a34a",
            "withdrawal": "#dc2626",
            "profit": "#2563eb",
            "manual_credit": "#7c3aed",
        }
        color = colors.get(obj.tx_type, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px;">{}</span>',
            color,
            obj.get_tx_type_display(),
        )
    tx_type_badge.short_description = "Type"

    def status_badge(self, obj):
        colors = {
            "pending": "#f59e0b",
            "approved": "#16a34a",
            "rejected": "#dc2626",
            "completed": "#2563eb",
        }
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px;">{}</span>',
            color,
            obj.get_status_display(),
        )
    status_badge.short_description = "Status"

    def tx_hash_link(self, obj):
        if not obj.tx_hash:
            return "—"
        explorers = {
            "BTC": f"https://mempool.space/tx/{obj.tx_hash}",
            "ETH": f"https://etherscan.io/tx/{obj.tx_hash}",
            "USDT": f"https://etherscan.io/tx/{obj.tx_hash}",
            "USDC": f"https://etherscan.io/tx/{obj.tx_hash}",
        }
        url = explorers.get(obj.payment_method, "#")
        return format_html(
            '<a href="{}" target="_blank" style="font-family:monospace;font-size:11px;">{}</a>',
            url,
            obj.tx_hash[:24] + "...",
        )
    tx_hash_link.short_description = "View on Explorer"

    # ── Actions ──────────────────────────────

    @admin.action(description="✅ Approve selected transactions")
    def admin_approve(self, request, queryset):
        count = 0
        for txn in queryset.filter(status="pending"):
            try:
                approve_transaction(txn, request.user, "Approved via admin panel")
                count += 1
            except ValidationError as exc:
                messages.error(request, f"Transaction {txn.id}: {exc}")
        if count:
            messages.success(request, f"{count} transaction(s) approved and wallet(s) updated.")

    @admin.action(description="❌ Reject selected transactions")
    def admin_reject(self, request, queryset):
        count = 0
        for txn in queryset.filter(status="pending"):
            try:
                reject_transaction(txn, request.user, "Rejected via admin panel")
                count += 1
            except ValidationError as exc:
                messages.error(request, f"Transaction {txn.id}: {exc}")
        if count:
            messages.success(request, f"{count} transaction(s) rejected.")


# ─────────────────────────────────────────────
# CRYPTOCURRENCY WALLET ADMIN
# ─────────────────────────────────────────────

@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(UnfoldModelAdmin):
    list_display = ("currency", "wallet_address", "network", "is_active", "updated_at")
    list_filter = ("currency", "is_active")
    list_editable = ("is_active",)
    search_fields = ("currency", "wallet_address", "network")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("currency",)


# ─────────────────────────────────────────────
# VIRTUAL CARD ADMIN
# ─────────────────────────────────────────────

@admin.register(VirtualCard)
class VirtualCardAdmin(UnfoldModelAdmin):
    list_display = (
        "user_email",
        "card_type",
        "masked_number",
        "status_badge",
        "balance",
        "purchase_amount",
        "created_at",
    )
    list_filter = ("status", "card_type", "is_active", "created_at")
    search_fields = ("user__email", "card_number", "cardholder_name")
    readonly_fields = (
        "id",
        "card_number",
        "cvv",
        "expiry_month",
        "expiry_year",
        "expires_at",
        "created_at",
        "updated_at",
        "approved_by",
        "masked_number_display",
    )
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Card Info", {
            "fields": ("id", "user", "card_type", "status", "is_active", "purchase_amount", "balance")
        }),
        ("Card Details", {
            "fields": ("masked_number_display", "cardholder_name", "expiry_month", "expiry_year", "expires_at"),
        }),
        ("Admin Notes", {
            "fields": ("notes", "approved_by"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"
    user_email.admin_order_field = "user__email"

    def masked_number(self, obj):
        return obj.get_masked_number()
    masked_number.short_description = "Card Number"

    def masked_number_display(self, obj):
        return obj.get_masked_number()
    masked_number_display.short_description = "Card Number (Masked)"

    def status_badge(self, obj):
        colors = {
            "pending": "#f59e0b",
            "approved": "#16a34a",
            "active": "#2563eb",
            "rejected": "#dc2626",
            "suspended": "#7c3aed",
            "expired": "#6b7280",
        }
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px;">{}</span>',
            color,
            obj.get_status_display(),
        )
    status_badge.short_description = "Status"


# ─────────────────────────────────────────────
# SYSTEM STATUS VIEW (kept for urls.py)
# ─────────────────────────────────────────────

from django.db import connection
from django.http import JsonResponse
from django.views import View


class SystemStatusView(View):
    def get(self, request):
        try:
            connection.ensure_connection()
            db_ok = True
        except Exception:
            db_ok = False

        total_pending = Transaction.objects.filter(status="pending").count()
        total_approved_today = Transaction.objects.filter(
            status="approved"
        ).count()

        return JsonResponse({
            "status": "ok" if db_ok else "degraded",
            "database": "connected" if db_ok else "error",
            "pending_transactions": total_pending,
            "approved_transactions": total_approved_today,
        })
