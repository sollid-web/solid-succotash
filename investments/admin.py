from django.contrib import admin, messages

from .models import InvestmentPlan, UserInvestment
from .services import approve_investment, reject_investment


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
    actions = ["approve_investments", "reject_investments"]

    def total_return(self, obj):
        return f"${obj.total_return}"

    total_return.short_description = "Total Return"

    def approve_investments(self, request, queryset):
        approved = 0
        failed = 0

        for investment in queryset.select_related("user", "plan").filter(status="pending"):
            try:
                approve_investment(
                    investment,
                    request.user,
                    notes=f"Approved via admin action by {request.user.email}",
                )
                approved += 1
            except Exception as exc:  # pragma: no cover - admin feedback path
                failed += 1
                messages.error(request, f"Failed to approve investment {investment.id}: {exc}")

        if approved:
            messages.success(request, f"Approved {approved} investment(s); wallets debited.")
        if failed:
            messages.warning(request, f"{failed} investment(s) could not be approved.")

    approve_investments.short_description = "Approve selected investments"

    def reject_investments(self, request, queryset):
        rejected = 0
        failed = 0

        for investment in queryset.filter(status="pending"):
            try:
                reject_investment(
                    investment,
                    request.user,
                    notes=f"Rejected via admin action by {request.user.email}",
                )
                rejected += 1
            except Exception as exc:  # pragma: no cover - admin feedback path
                failed += 1
                messages.error(request, f"Failed to reject investment {investment.id}: {exc}")

        if rejected:
            messages.success(request, f"Rejected {rejected} investment(s).")
        if failed:
            messages.warning(request, f"{failed} investment(s) could not be rejected.")

    reject_investments.short_description = "Reject selected investments"

    def save_model(self, request, obj, form, change):
        """Ensure manual status edits trigger service logic for balance accuracy."""
        if change and obj.pk:
            original = UserInvestment.objects.select_related("user", "plan").get(pk=obj.pk)
            new_status = form.cleaned_data.get("status")

            if original.status == "pending" and new_status == "approved":
                # reflect any form changes before service call
                original.plan = form.cleaned_data.get("plan", original.plan)
                original.amount = form.cleaned_data.get("amount", original.amount)
                approve_investment(
                    original,
                    request.user,
                    notes=f"Approved via admin edit by {request.user.email}",
                )
                messages.success(request, f"Investment {original.id} approved and wallet debited.")
                return

            if original.status == "pending" and new_status == "rejected":
                reject_investment(
                    original,
                    request.user,
                    notes=f"Rejected via admin edit by {request.user.email}",
                )
                messages.info(request, f"Investment {original.id} rejected.")
                return

        super().save_model(request, obj, form, change)
