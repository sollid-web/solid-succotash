from django.contrib import admin
from django.contrib.auth import get_user_model
from django.db import connection
from django.http import JsonResponse
from django.views import View

from .models import Transaction, CryptocurrencyWallet, VirtualCard


class SystemStatusView(View):
    def get(self, request):
        # Basic DB connectivity check
        try:
            connection.ensure_connection()
            db_ok = True
        except Exception:
            db_ok = False

        return JsonResponse({
            "status": "ok" if db_ok else "degraded",
            "database": "connected" if db_ok else "error",
        })


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'tx_type', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['tx_type', 'status', 'payment_method']
    search_fields = ['user__email', 'tx_hash', 'wallet_address_used', 'reference']
    readonly_fields = ['id', 'created_at', 'updated_at']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ['user', 'tx_type', 'amount']
        return self.readonly_fields


@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(admin.ModelAdmin):
    list_display = ['currency', 'wallet_address', 'network', 'is_active']
    list_filter = ['currency', 'is_active']


@admin.register(VirtualCard)
class VirtualCardAdmin(admin.ModelAdmin):
    list_display = ['user', 'card_type', 'status', 'balance', 'created_at']
    list_filter = ['status', 'card_type']
    search_fields = ['user__email', 'card_number']
