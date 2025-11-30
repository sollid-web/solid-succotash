from django.contrib import admin
from .models import ReferralCode, Referral, ReferralReward, ReferralSetting


@admin.register(ReferralCode)
class ReferralCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'active', 'created_at')
    search_fields = ('user__email', 'code')
    list_filter = ('active', 'created_at')
    readonly_fields = ('id', 'created_at')


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ('id', 'referrer', 'referred_user', 'code', 'status', 'reward_processed', 'created_at')
    list_filter = ('status', 'reward_processed', 'created_at')
    search_fields = ('referrer__email', 'referred_user__email', 'code')
    readonly_fields = ('id', 'created_at', 'reward_processed_at')
    raw_id_fields = ('referrer', 'referred_user')


@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ('id', 'referral', 'reward_type', 'amount', 'currency', 'approved', 'created_at')
    list_filter = ('reward_type', 'approved', 'currency', 'created_at')
    readonly_fields = ('id', 'created_at', 'approved_at')
    raw_id_fields = ('referral', 'created_by', 'approved_by')


@admin.register(ReferralSetting)
class ReferralSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'updated_at')
    search_fields = ('key',)
    readonly_fields = ('updated_at',)
