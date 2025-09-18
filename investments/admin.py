from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from .models import InvestmentPlan, UserInvestment
from .services import approve_investment, reject_investment


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
    actions = ['approve_investments', 'reject_investments']
    
    def total_return(self, obj):
        return f"${obj.total_return}"
    total_return.short_description = 'Total Return'
    
    def approve_investments(self, request, queryset):
        """Approve selected investments"""
        approved_count = 0
        failed_count = 0
        
        for investment in queryset.filter(status='pending'):
            try:
                approve_investment(investment, request.user, "Approved via admin bulk action")
                approved_count += 1
            except Exception as e:
                failed_count += 1
                self.message_user(
                    request,
                    f"Failed to approve investment {investment.id}: {str(e)}",
                    level=messages.ERROR
                )
        
        if approved_count:
            self.message_user(
                request,
                f"Successfully approved {approved_count} investment(s).",
                level=messages.SUCCESS
            )
        
        if failed_count:
            self.message_user(
                request,
                f"Failed to approve {failed_count} investment(s).",
                level=messages.WARNING
            )
    
    approve_investments.short_description = "Approve selected investments"
    
    def reject_investments(self, request, queryset):
        """Reject selected investments"""
        rejected_count = 0
        
        for investment in queryset.filter(status='pending'):
            try:
                reject_investment(investment, request.user, "Rejected via admin bulk action")
                rejected_count += 1
            except Exception as e:
                self.message_user(
                    request,
                    f"Failed to reject investment {investment.id}: {str(e)}",
                    level=messages.ERROR
                )
        
        if rejected_count:
            self.message_user(
                request,
                f"Successfully rejected {rejected_count} investment(s).",
                level=messages.SUCCESS
            )
    
    reject_investments.short_description = "Reject selected investments"
