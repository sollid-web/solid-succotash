from django.contrib import admin

from .models import ChatMessage


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("session_id", "role", "created_at", "is_human_handover")
    list_filter = ("session_id", "role", "is_human_handover")
    search_fields = ("session_id", "content")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)
