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
        "created_at",
        "handled_by",
    )
    list_filter = ("status", "created_at", "handled_by")
    search_fields = ("contact_email", "full_name", "message", "topic", "admin_notes")
    readonly_fields = (
        "user",
        "ip_address",
        "user_agent",
        "created_at",
        "updated_at",
        "source_url",
    )
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    
    fieldsets = (
        ('Message Details', {
            'fields': (
                'user',
                'full_name',
                'contact_email',
                'topic',
                'message',
                'source_url',
                'created_at',
            )
        }),
        ('Admin Response', {
            'fields': (
                'status',
                'handled_by',
                'admin_notes',
                'responded_at',
                'updated_at',
            )
        }),
        ('Metadata', {
            'fields': (
                'ip_address',
                'user_agent',
            ),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_in_progress', 'mark_resolved']
    
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress', handled_by=request.user)
        self.message_user(request, f"{updated} support request(s) marked as in progress.")
    mark_in_progress.short_description = "Mark selected as In Progress"
    
    def mark_resolved(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(
            status='resolved',
            handled_by=request.user,
            responded_at=timezone.now()
        )
        self.message_user(request, f"{updated} support request(s) marked as resolved.")
    mark_resolved.short_description = "Mark selected as Resolved"
