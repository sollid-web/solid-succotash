from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone

from .models import Agreement, SupportRequest, UserAgreementAcceptance, EmailInbox, EmailTemplate, PlatformCertificate


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


@admin.register(EmailInbox)
class EmailInboxAdmin(admin.ModelAdmin):
    list_display = (
        'status_badge',
        'subject_with_star',
        'from_display',
        'received_at',
        'priority_badge',
        'assigned_to',
        'has_attachments',
    )
    list_filter = (
        'status',
        'priority',
        'is_starred',
        'has_attachments',
        'assigned_to',
        'received_at',
    )
    search_fields = (
        'subject',
        'from_email',
        'from_name',
        'body_text',
        'to_email',
    )
    readonly_fields = (
        'message_id',
        'received_at',
        'created_at',
        'updated_at',
        'read_at',
        'replied_at',
        'raw_headers_display',
        'attachment_info',
        'ip_address',
    )
    ordering = ('-received_at',)
    date_hierarchy = 'received_at'
    list_per_page = 50
    
    fieldsets = (
        ('Email Details', {
            'fields': (
                'message_id',
                'subject',
                'from_name',
                'from_email',
                'to_email',
                'cc',
                'reply_to',
                'received_at',
            )
        }),
        ('Content', {
            'fields': (
                'body_text',
                'body_html',
            )
        }),
        ('Attachments', {
            'fields': (
                'has_attachments',
                'attachment_info',
            ),
            'classes': ('collapse',)
        }),
        ('Status & Organization', {
            'fields': (
                'status',
                'priority',
                'is_starred',
                'labels',
                'folder',
                'assigned_to',
            )
        }),
        ('Tracking', {
            'fields': (
                'read_at',
                'replied_at',
                'created_at',
                'updated_at',
            )
        }),
        ('Technical Details', {
            'fields': (
                'raw_headers_display',
                'ip_address',
            ),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_read',
        'mark_as_unread',
        'mark_as_replied',
        'mark_as_archived',
        'mark_as_spam',
        'assign_to_me',
        'set_priority_high',
        'set_priority_normal',
        'toggle_star',
    ]
    
    def status_badge(self, obj):
        colors = {
            'unread': 'blue',
            'read': 'gray',
            'replied': 'green',
            'archived': 'purple',
            'spam': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def priority_badge(self, obj):
        if obj.priority == 'urgent':
            color = '#DC2626'
        elif obj.priority == 'high':
            color = '#F59E0B'
        elif obj.priority == 'low':
            color = '#6B7280'
        else:
            return '-'
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            color,
            obj.get_priority_display()
        )
    priority_badge.short_description = 'Priority'
    
    def subject_with_star(self, obj):
        star = '⭐ ' if obj.is_starred else ''
        return format_html(
            '{}{}',
            star,
            obj.subject[:60] + '...' if len(obj.subject) > 60 else obj.subject
        )
    subject_with_star.short_description = 'Subject'
    
    def from_display(self, obj):
        if obj.from_name:
            return format_html('{}<br><small style="color: #6B7280;">{}</small>', obj.from_name, obj.from_email)
        return obj.from_email
    from_display.short_description = 'From'
    
    def raw_headers_display(self, obj):
        if obj.raw_headers:
            headers_html = '<br>'.join([f'<strong>{k}:</strong> {v}' for k, v in obj.raw_headers.items()[:20]])
            return format_html(headers_html)
        return '-'
    raw_headers_display.short_description = 'Email Headers'
    
    # Actions
    def mark_as_read(self, request, queryset):
        updated = queryset.update(status='read', read_at=timezone.now(), assigned_to=request.user)
        self.message_user(request, f'{updated} email(s) marked as read.')
    mark_as_read.short_description = 'Mark as Read'
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(status='unread', read_at=None)
        self.message_user(request, f'{updated} email(s) marked as unread.')
    mark_as_unread.short_description = 'Mark as Unread'
    
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(status='replied', replied_at=timezone.now())
        self.message_user(request, f'{updated} email(s) marked as replied.')
    mark_as_replied.short_description = 'Mark as Replied'
    
    def mark_as_archived(self, request, queryset):
        updated = queryset.update(status='archived')
        self.message_user(request, f'{updated} email(s) archived.')
    mark_as_archived.short_description = 'Archive'
    
    def mark_as_spam(self, request, queryset):
        updated = queryset.update(status='spam')
        self.message_user(request, f'{updated} email(s) marked as spam.')
    mark_as_spam.short_description = 'Mark as Spam'
    
    def assign_to_me(self, request, queryset):
        updated = queryset.update(assigned_to=request.user)
        self.message_user(request, f'{updated} email(s) assigned to you.')
    assign_to_me.short_description = 'Assign to Me'
    
    def set_priority_high(self, request, queryset):
        updated = queryset.update(priority='high')
        self.message_user(request, f'{updated} email(s) set to high priority.')
    set_priority_high.short_description = 'Set Priority: High'
    
    def set_priority_normal(self, request, queryset):
        updated = queryset.update(priority='normal')
        self.message_user(request, f'{updated} email(s) set to normal priority.')
    set_priority_normal.short_description = 'Set Priority: Normal'
    
    def toggle_star(self, request, queryset):
        for email in queryset:
            email.toggle_star()
        self.message_user(request, f'{queryset.count()} email(s) star toggled.')
    toggle_star.short_description = 'Toggle Star'


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'subject', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'category', 'created_at')
    search_fields = ('name', 'subject', 'body', 'category')
    readonly_fields = ('created_by', 'created_at', 'updated_at')
    ordering = ('category', 'name')
    
    fieldsets = (
        ('Template Info', {
            'fields': ('name', 'category', 'is_active')
        }),
        ('Email Content', {
            'fields': ('subject', 'body'),
            'description': 'Use {{variable}} for placeholders like {{name}}, {{email}}, {{company}}, etc.'
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(PlatformCertificate)
class PlatformCertificateAdmin(admin.ModelAdmin):
    list_display = ("certificate_id", "title", "issuing_authority", "issue_date", "is_active", "created_at")
    list_filter = ("is_active", "issue_date", "created_at")
    search_fields = ("certificate_id", "title", "issuing_authority", "jurisdiction")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("Certificate", {
            "fields": ("title", "certificate_id", "issue_date", "jurisdiction", "issuing_authority", "is_active"),
        }),
        ("Verification", {
            "fields": ("verification_url",),
        }),
        ("Branding & Signatures", {
            "fields": ("authority_seal_url", "signature_1_url", "signature_2_url"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
