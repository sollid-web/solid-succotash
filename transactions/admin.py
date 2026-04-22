from django.contrib import admin, messages
from django.db import transaction

from .models import AdminAuditLog, CryptocurrencyWallet, Transaction, VirtualCard
from .services import approve_transaction, reject_transaction


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


@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(admin.ModelAdmin):
    list_display = ("currency", "wallet_address", "network", "is_active", "updated_at")
    list_filter = ("currency", "is_active")


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
        updated = queryset.filter(status="pending").update(status="rejected", is_active=False)
        messages.success(request, f"{updated} card(s) rejected.")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "tx_type", "amount", "status", "payment_method", "created_at")
    list_filter = ("tx_type", "status")
    actions = ["admin_approve", "admin_reject"]

    @admin.action(description="Approve selected (SAFE)")
    def admin_approve(self, request, queryset):
        success, failed = 0, 0
        for tx in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    tx = Transaction.objects.select_for_update().get(pk=tx.pk)
                    if tx.status != "pending":
                        continue
                    if tx.tx_type == "withdrawal":
                        _debit_wallet(tx.user, tx.amount)
                    elif tx.tx_type == "deposit":
                        _credit_wallet(tx.user, tx.amount)
                    approve_transaction(tx, request.user, "Approved via admin")
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error on {tx.id}: {str(e)}")
        messages.success(request, f"Processed {success} transactions.")

    @admin.action(description="Reject selected")
    def admin_reject(self, request, queryset):
        success, failed = 0, 0
        for tx in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    tx = Transaction.objects.select_for_update().get(pk=tx.pk)
                    if tx.status != "pending":
                        continue
                    reject_transaction(tx, request.user, "Rejected via admin")
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error on {tx.id}: {str(e)}")
        messages.success(request, f"Rejected {success} transactions.")


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ("admin", "entity", "action", "created_at")
    readonly_fields = ("admin", "entity", "entity_id", "action", "notes", "created_at")
