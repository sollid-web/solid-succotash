from decimal import Decimal
from django.contrib import admin, messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.db.models import Sum
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import path
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.html import format_html
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView

from .models import AdminAuditLog, CryptocurrencyWallet, Transaction, VirtualCard
from .services import approve_transaction, reject_transaction

User = get_user_model()


def _credit_wallet(user, amount):
    from users.models import UserWallet
    wallet, _ = UserWallet.objects.get_or_create(user=user)
    wallet.balance += amount
    wallet.save(update_fields=["balance", "updated_at"])


def _debit_wallet(user, amount):
    from users.models import UserWallet
    wallet, _ = UserWallet.objects.get_or_create(user=user)
    if wallet.balance < amount:
        raise ValueError(f"Insufficient balance: {wallet.balance} < {amount}")
    wallet.balance -= amount
    wallet.save(update_fields=["balance", "updated_at"])


# Custom admin action for transaction verification
@admin.action(description="Verify and Release Funds")
def verify_and_release_funds(modeladmin, request, queryset):
    """Custom admin action to verify and release funds for selected transactions."""
    if not request.user.is_superuser:
        messages.error(request, "Only superusers can perform this action.")
        return

    success_count = 0
    error_count = 0

    for txn in queryset.filter(status="pending"):
        try:
            with transaction.atomic():
                # Use the existing service function
                approve_transaction(txn, request.user, notes="Verified and released via admin action")

                # Log the admin action
                AdminAuditLog.objects.create(
                    admin=request.user,
                    entity="transaction",
                    entity_id=str(txn.id),
                    action="verify_release_funds",
                    notes=f"Verified and released {txn.amount} for {txn.user.email}",
                )

            success_count += 1
        except Exception as e:
            error_count += 1
            messages.error(request, f"Error processing transaction {txn.id}: {str(e)}")

    if success_count:
        messages.success(request, f"Successfully verified and released funds for {success_count} transaction(s).")
    if error_count:
        messages.error(request, f"Failed to process {error_count} transaction(s).")


@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(admin.ModelAdmin):
    list_display = ("currency", "wallet_address", "network", "is_active", "updated_at")
    list_filter = ("currency", "is_active")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "tx_type",
        "payment_method",
        "amount",
        "status",
        "created_at",
        "approved_by",
    )
    list_filter = ("tx_type", "payment_method", "status", "created_at")
    search_fields = ("user__email", "reference", "tx_hash")
    readonly_fields = ("id", "created_at", "updated_at")
    actions = [verify_and_release_funds, "reject_transactions"]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "approved_by")

    @admin.action(description="Reject selected transactions")
    def reject_transactions(self, request, queryset):
        if not request.user.is_superuser:
            messages.error(request, "Only superusers can perform this action.")
            return

        success_count = 0
        for txn in queryset.filter(status="pending"):
            try:
                reject_transaction(txn, request.user, notes="Rejected via admin action")
                AdminAuditLog.objects.create(
                    admin=request.user,
                    entity="transaction",
                    entity_id=str(txn.id),
                    action="reject",
                    notes=f"Rejected transaction for {txn.user.email}",
                )
                success_count += 1
            except Exception as e:
                messages.error(request, f"Error rejecting transaction {txn.id}: {str(e)}")

        if success_count:
            messages.success(request, f"Successfully rejected {success_count} transaction(s).")


@admin.register(VirtualCard)
class VirtualCardAdmin(admin.ModelAdmin):
    list_display = ("user", "card_type", "card_number_masked", "balance", "status", "is_active", "created_at")
    list_filter = ("card_type", "status", "is_active")
    readonly_fields = ("card_number", "cvv", "expiry_month", "expiry_year", "cardholder_name", "created_at", "updated_at")
    actions = ["approve_cards", "reject_cards"]

    def card_number_masked(self, obj):
        return obj.get_masked_number()
    card_number_masked.short_description = "Card Number"

    @admin.action(description="Approve selected cards and generate card details")
    def approve_cards(self, request, queryset):
        success = 0
        failed = 0
        for card in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    card.status = "approved"
                    card.approved_by = request.user
                    card.is_active = True
                    card.save(update_fields=["status", "approved_by", "is_active", "updated_at"])
                    # THIS was missing — generates card_number, cvv, expiry, cardholder_name
                    card.generate_card_details()
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error approving card for {card.user.email}: {str(e)}")

        if success:
            messages.success(request, f"✅ {success} card(s) approved and details generated.")
        if failed:
            messages.error(request, f"❌ {failed} card(s) failed.")

    @admin.action(description="Reject selected cards")
    def reject_cards(self, request, queryset):
        success = 0
        failed = 0
        for card in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    card.status = "rejected"
                    card.approved_by = request.user
                    card.save(update_fields=["status", "approved_by", "updated_at"])
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error rejecting card for {card.user.email}: {str(e)}")

        if success:
            messages.success(request, f"✅ {success} card(s) rejected.")
        if failed:
            messages.error(request, f"❌ {failed} card(s) failed.")


# Custom User Admin with wallet overview
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "get_full_name", "get_wallet_balance", "get_total_investment", "date_joined", "is_active")
    list_filter = ("is_active", "is_staff", "date_joined")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined", "last_login")

    def get_wallet_balance(self, obj):
        try:
            return f"${obj.wallet.balance}"
        except:
            return "$0.00"
    get_wallet_balance.short_description = "Wallet Balance"
    get_wallet_balance.admin_order_field = "wallet__balance"

    def get_total_investment(self, obj):
        total = obj.transactions.filter(tx_type="deposit", status="approved").aggregate(
            total=Sum("amount")
        )["total"] or Decimal("0.00")
        return f"${total}"
    get_total_investment.short_description = "Total Invested"
    get_total_investment.admin_order_field = "transactions__amount"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("wallet").prefetch_related("transactions")


# System Health View
@method_decorator(staff_member_required, name='dispatch')
@method_decorator(user_passes_test(lambda u: u.is_superuser), name='dispatch')
@method_decorator(never_cache, name='dispatch')
class SystemStatusView(TemplateView):
    template_name = "admin/system_status.html"

    def get(self, request):
        # Get last 50 lines of django.log
        log_content = ""
        try:
            with open("django.log", "r") as f:
                lines = f.readlines()[-50:]
                log_content = "".join(lines)
        except FileNotFoundError:
            log_content = "django.log file not found."

        # Check Supabase connection
        supabase_status = "Unknown"
        try:
            from django.db import connection
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            supabase_status = "Connected"
        except Exception as e:
            supabase_status = f"Error: {str(e)}"

        # Get quick stats
        today = timezone.now().date()
        deposits_today = Transaction.objects.filter(
            tx_type="deposit",
            status="approved",
            created_at__date=today
        ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        active_investors = User.objects.filter(
            transactions__tx_type="deposit",
            transactions__status="approved"
        ).distinct().count()

        pending_withdrawals = Transaction.objects.filter(
            tx_type="withdrawal",
            status="pending"
        ).count()

        context = {
            "log_content": log_content,
            "supabase_status": supabase_status,
            "deposits_today": deposits_today,
            "active_investors": active_investors,
            "pending_withdrawals": pending_withdrawals,
        }

        return render(request, self.template_name, context)


# Register custom admin classes
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Add system status URL
original_admin_urls = admin.site.get_urls

def get_admin_urls():
    urls = [
        path("system-status/", SystemStatusView.as_view(), name="system_status"),
    ]
    return urls + original_admin_urls()

admin.site.get_urls = get_admin_urls


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ("admin", "entity", "action", "created_at")
    readonly_fields = ("admin", "entity", "entity_id", "action", "notes", "created_at")
