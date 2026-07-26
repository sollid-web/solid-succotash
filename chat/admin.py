from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.utils.html import format_html
from .models import ChatMessage, ChatSession

@admin.register(ChatSession)
class ChatSessionAdmin(UnfoldModelAdmin):
    list_display = ("user_info", "status_badge", "human_requested_at", "updated_at")
    list_filter = ("status",)
    ordering = ("-updated_at",)
    readonly_fields = ("session_id", "created_at", "updated_at", "human_requested_at", "agent_joined_at")

    def user_info(self, obj):
        return f"{obj.user_name or 'Unknown'} ({obj.user_email or obj.session_id})"
    user_info.short_description = "User"

    def status_badge(self, obj):
        colors = {"bot": "#6b7280", "waiting": "#f59e0b", "active": "#16a34a", "closed": "#374151"}
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 10px;border-radius:4px;font-size:11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = "Status"

@admin.register(ChatMessage)
class ChatMessageAdmin(UnfoldModelAdmin):
    list_display = ("session_id", "role", "short_content", "is_human_handover", "created_at")
    list_filter = ("role", "is_human_handover")
    search_fields = ("session_id", "content")
    ordering = ("-created_at",)

    def short_content(self, obj):
        return obj.content[:80] + "..." if len(obj.content) > 80 else obj.content
    short_content.short_description = "Message"
