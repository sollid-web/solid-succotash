from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()


# Register User WITHOUT profile inline
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "is_active", "is_staff", "get_wallet_balance")
    search_fields = ("email",)
    ordering = ("id",)

    def get_wallet_balance(self, obj):
        try:
            return f"${obj.wallet.balance}"
        except Exception:
            return "-"
    get_wallet_balance.short_description = 'Wallet Balance'
