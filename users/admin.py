from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile, UserWallet


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserWalletInline(admin.StackedInline):
    model = UserWallet
    can_delete = False
    verbose_name_plural = 'Wallet'
    readonly_fields = ('balance', 'updated_at')


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, UserWalletInline)
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'date_joined', 'get_role', 'get_balance')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined', 'profile__role')
    search_fields = ('email', 'first_name', 'last_name', 'profile__full_name')
    ordering = ('-date_joined',)
    
    def get_role(self, obj):
        try:
            return obj.profile.role
        except Profile.DoesNotExist:
            return 'No Profile'
    get_role.short_description = 'Role'
    
    def get_balance(self, obj):
        try:
            return f"${obj.wallet.balance}"
        except UserWallet.DoesNotExist:
            return 'No Wallet'
    get_balance.short_description = 'Wallet Balance'


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'full_name', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'full_name')
    readonly_fields = ('created_at',)


@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance', 'updated_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('updated_at',)


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
