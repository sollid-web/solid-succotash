from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import InvestmentPlan, UserInvestment
# from .services import approve_investment, reject_investment


@admin.register(InvestmentPlan)
class InvestmentPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'daily_roi', 'duration_days', 'min_amount', 'max_amount', 'created_at')
    list_filter = ('daily_roi', 'duration_days', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
    ordering = ('name',)


@admin.register(UserInvestment)
class UserInvestmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'amount', 'status', 'started_at', 'ends_at', 'created_at')
    list_filter = ('status', 'plan', 'created_at', 'started_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'plan__name')
    readonly_fields = ('total_return', 'created_at')
    date_hierarchy = 'created_at'
    # actions = ['approve_investments', 'reject_investments']
    
    def total_return(self, obj):
        return f"${obj.total_return}"
    total_return.short_description = 'Total Return'
