from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from .models import InvestmentPlan, UserInvestment
from .services import approve_investment, create_investment, reject_investment


@admin.register(InvestmentPlan)
class InvestmentPlanAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "daily_roi",
        "duration_days",
        "min_amount",
        "max_amount",
        "created_at",
    )
    list_filter = ("daily_roi", "duration_days", "created_at")
    search_fields = ("name", "description")
    readonly_fields = ("created_at",)
    ordering = ("name",)


@admin.register(UserInvestment)
class UserInvestmentAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "plan",
        "amount",
        "status",
        "started_at",
        "ends_at",
        "created_at",
    )
    list_filter = ("status", "plan", "created_at", "started_at")
    search_fields = ("user__email", "user__first_name", "user__last_name", "plan__name")
    readonly_fields = ("total_return", "created_at")
    date_hierarchy = "created_at"
    actions = ["admin_approve", "admin_reject"]

    @admin.display(description="Total Return")
    def total_return(self, obj):
        return f"${obj.total_return}"

    @admin.action(description="Approve selected investments (SAFE)")
    def admin_approve(self, request, queryset):
        count = 0
        for inv in queryset.select_related("user", "plan").filter(status="pending"):
            try:
                approve_investment(inv, request.user, "Approved via admin")
                count += 1
            except ValidationError as exc:
                messages.error(request, f"Investment {inv.id}: {exc}")
        self.message_user(request, f"{count} investment(s) approved.")

    @admin.action(description="Reject selected investments (SAFE)")
    def admin_reject(self, request, queryset):
        count = 0
        for inv in queryset.filter(status="pending"):
            try:
                reject_investment(inv, request.user, "Rejected via admin")
                count += 1
            except ValidationError as exc:
                messages.error(request, f"Investment {inv.id}: {exc}")
        self.message_user(request, f"{count} investment(s) rejected.")

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + (
                "user",
                "plan",
                "amount",
                "status",
                "started_at",
                "ends_at",
            )
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        # Creation must flow through the service layer to ensure wallet locks + notifications
        if not change:
            try:
                create_investment(user=obj.user, plan=obj.plan, amount=obj.amount)
                messages.success(request, "Investment request created and queued for approval.")
            except ValidationError as exc:
                messages.error(request, f"Could not create investment: {exc}")
            return

        # Existing records are locked to readonly; defer to super for completeness
        return super().save_model(request, obj, form, change)
