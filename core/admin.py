from django.contrib import admin

from .models import Agreement, SupportRequest, UserAgreementAcceptance


@admin.register(Agreement)
class AgreementAdmin(admin.ModelAdmin):
    list_display = ("title", "version", "effective_date", "is_active")
    list_filter = ("is_active", "effective_date")
    search_fields = ("title", "version", "body")
    ordering = ("-effective_date", "-created_at")


@admin.register(UserAgreementAcceptance)
class UserAgreementAcceptanceAdmin(admin.ModelAdmin):
    list_display = ("user", "agreement", "accepted_at", "ip_address")
    search_fields = ("user__email", "agreement__title", "agreement_version")
    list_filter = ("agreement", "accepted_at")
    date_hierarchy = "accepted_at"


@admin.register(SupportRequest)
class SupportRequestAdmin(admin.ModelAdmin):
    list_display = (
        "contact_email",
        "full_name",
        "topic",
        "status",
        "source_url",
        "created_at",
        "handled_by",
    )
    list_filter = ("status", "created_at")
    search_fields = ("contact_email", "full_name", "message", "topic")
    readonly_fields = (
        "user",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
        "source_url",
    )
    ordering = ("-created_at",)
