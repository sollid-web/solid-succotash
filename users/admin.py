import os
import resend
from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.shortcuts import redirect, render
from django.urls import path
from django.utils.html import format_html
from unfold.admin import ModelAdmin as UnfoldModelAdmin

from .models import KycApplication, KycDocument, Profile, UserProfile, UserWallet

User = get_user_model()


# ─────────────────────────────────────────────
# EMAIL COMPOSE FORM
# ─────────────────────────────────────────────

class EmailComposeForm(forms.Form):
    to_email = forms.EmailField(label="To")
    subject = forms.CharField(max_length=255)
    body = forms.CharField(widget=forms.Textarea(attrs={"rows": 12}))


# ─────────────────────────────────────────────
# USER ADMIN (main User model)
# ─────────────────────────────────────────────

@admin.register(User)
class UserAdmin(UnfoldModelAdmin):
    list_display = ("email", "first_name", "last_name", "is_active", "is_staff", "date_joined")
    list_filter = ("is_active", "is_staff", "date_joined")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined", "last_login")
    ordering = ("-date_joined",)
    list_per_page = 50
    actions = ["send_email_action", "deactivate_users", "activate_users"]

    fieldsets = (
        ("Account", {
            "fields": ("email", "first_name", "last_name", "password")
        }),
        ("Permissions", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
            "classes": ("collapse",),
        }),
        ("Timestamps", {
            "fields": ("date_joined", "last_login"),
            "classes": ("collapse",),
        }),
    )

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("send-email/", self.admin_site.admin_view(self.send_email_view), name="users_send_email"),
        ]
        return custom + urls

    def send_email_view(self, request):
        """Admin email compose page using Resend."""
        if request.method == "POST":
            form = EmailComposeForm(request.POST)
            if form.is_valid():
                try:
                    resend.api_key = os.environ.get("RESEND_API_KEY", "")
                    resend.Emails.send({
                        "from": "WolvCapital Support <support@mail.wolvcapital.com>",
                        "to": form.cleaned_data["to_email"],
                        "subject": form.cleaned_data["subject"],
                        "text": form.cleaned_data["body"],
                    })
                    messages.success(request, f"Email sent to {form.cleaned_data['to_email']}")
                    return redirect("..")
                except Exception as e:
                    messages.error(request, f"Failed to send email: {e}")
        else:
            to = request.GET.get("to", "")
            form = EmailComposeForm(initial={"to_email": to})

        context = {
            **self.admin_site.each_context(request),
            "form": form,
            "title": "Send Email to User",
            "opts": User._meta,
        }
        return render(request, "admin/send_email.html", context)

    @admin.action(description="📧 Send email to selected users")
    def send_email_action(self, request, queryset):
        emails = ",".join(queryset.values_list("email", flat=True))
        return redirect(f"send-email/?to={emails}")

    @admin.action(description="🔴 Deactivate selected users")
    def deactivate_users(self, request, queryset):
        count = queryset.update(is_active=False)
        messages.success(request, f"{count} user(s) deactivated.")

    @admin.action(description="🟢 Activate selected users")
    def activate_users(self, request, queryset):
        count = queryset.update(is_active=True)
        messages.success(request, f"{count} user(s) activated.")


# ─────────────────────────────────────────────
# USER WALLET ADMIN
# ─────────────────────────────────────────────

@admin.register(UserWallet)
class UserWalletAdmin(UnfoldModelAdmin):
    list_display = ("user_email", "balance_display", "updated_at")
    readonly_fields = ("user", "updated_at")
    search_fields = ("user__email",)
    ordering = ("-updated_at",)
    list_per_page = 50

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"
    user_email.admin_order_field = "user__email"

    def balance_display(self, obj):
        color = "#16a34a" if obj.balance > 0 else "#6b7280"
        return format_html(
            '<strong style="color:{};">${}</strong>',
            color,
            obj.balance,
        )
    balance_display.short_description = "Balance"
    balance_display.admin_order_field = "balance"


# ─────────────────────────────────────────────
# USER PROFILE ADMIN
# ─────────────────────────────────────────────

@admin.register(UserProfile)
class UserProfileAdmin(UnfoldModelAdmin):
    list_display = ("user", "language_preference")
    list_filter = ("language_preference",)
    search_fields = ("user__email",)


# ─────────────────────────────────────────────
# KYC APPLICATION ADMIN
# ─────────────────────────────────────────────

@admin.register(KycApplication)
class KycApplicationAdmin(UnfoldModelAdmin):
    list_display = (
        "user_email",
        "status_badge",
        "created_at",
        "reviewed_at",
        "reviewed_by",
    )
    list_filter = ("status", "created_at")
    search_fields = ("user__email",)
    readonly_fields = ("user", "created_at", "updated_at", "reviewed_at", "reviewed_by")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    actions = ["approve_kyc", "reject_kyc"]

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"
    user_email.admin_order_field = "user__email"

    def status_badge(self, obj):
        colors = {
            "pending": "#f59e0b",
            "approved": "#16a34a",
            "rejected": "#dc2626",
            "under_review": "#2563eb",
        }
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px;">{}</span>',
            color,
            obj.get_status_display(),
        )
    status_badge.short_description = "Status"

    @admin.action(description="✅ Approve selected KYC applications")
    def approve_kyc(self, request, queryset):
        from users.services import approve_kyc_application
        count = 0
        for app in queryset.filter(status="pending"):
            try:
                approve_kyc_application(app, request.user)
                count += 1
            except Exception as exc:
                messages.error(request, f"KYC {app.id}: {exc}")
        if count:
            messages.success(request, f"{count} KYC application(s) approved.")

    @admin.action(description="❌ Reject selected KYC applications")
    def reject_kyc(self, request, queryset):
        from users.services import reject_kyc_application
        count = 0
        for app in queryset.filter(status="pending"):
            try:
                reject_kyc_application(app, request.user, "Rejected via admin panel")
                count += 1
            except Exception as exc:
                messages.error(request, f"KYC {app.id}: {exc}")
        if count:
            messages.success(request, f"{count} KYC application(s) rejected.")


# ─────────────────────────────────────────────
# KYC DOCUMENT ADMIN — with image preview
# ─────────────────────────────────────────────

@admin.register(KycDocument)
class KycDocumentAdmin(UnfoldModelAdmin):
    list_display = (
        "user_email",
        "document_type",
        "status_badge",
        "document_preview",
        "created_at",
    )
    list_filter = ("status", "document_type", "created_at")
    search_fields = ("user__email",)
    readonly_fields = (
        "user",
        "created_at",
        "updated_at",
        "reviewed_at",
        "reviewed_by",
        "document_preview",
        "front_image_preview",
        "back_image_preview",
    )
    ordering = ("-created_at",)
    actions = ["approve_docs", "reject_docs"]

    fieldsets = (
        ("Document Info", {
            "fields": ("user", "document_type", "status", "document_number")
        }),
        ("Document Images", {
            "fields": ("document_preview_full",),
        }),
        ("Review", {
            "fields": ("notes", "reviewed_by", "reviewed_at"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "User"
    user_email.admin_order_field = "user__email"

    def status_badge(self, obj):
        colors = {
            "pending": "#f59e0b",
            "approved": "#16a34a",
            "rejected": "#dc2626",
        }
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background:{};color:white;padding:2px 8px;border-radius:4px;font-size:11px;">{}</span>',
            color,
            obj.get_status_display(),
        )
    status_badge.short_description = "Status"

    def _image_tag(self, url, label):
        if not url:
            return format_html('<span style="color:#6b7280;">No image uploaded</span>')
        return format_html(
            '<div><p style="font-size:11px;color:#6b7280;margin:0 0 4px;">{}</p>'
            '<a href="{}" target="_blank">'
            '<img src="{}" style="max-width:400px;max-height:300px;border:1px solid #e5e7eb;border-radius:6px;" />'
            '</a><br><a href="{}" target="_blank" style="font-size:11px;">Open full size ↗</a></div>',
            label, url, url, url,
        )

    def front_image_preview(self, obj):
        url = obj.document_file.url if obj.document_file else None
        return self._image_tag(url, "Front of Document")
    front_image_preview.short_description = "Front Image"

    def back_image_preview(self, obj):
        url = None
        return self._image_tag(url, "Back of Document")
    back_image_preview.short_description = "Back Image"

    def document_preview(self, obj):
        """Thumbnail for list view."""
        url = obj.document_file.url if obj.document_file else None
        if not url:
            return "No image"
        return format_html(
            '<a href="{}" target="_blank"><img src="{}" style="height:40px;border-radius:4px;" /></a>',
            url, url,
        )
    document_preview.short_description = "Preview"

    @admin.action(description="✅ Approve selected KYC documents")
    def approve_docs(self, request, queryset):
        from users.services import approve_kyc_document
        count = 0
        for doc in queryset.filter(status="pending"):
            try:
                approve_kyc_document(doc, request.user)
                count += 1
            except Exception as exc:
                messages.error(request, f"Doc {doc.id}: {exc}")
        if count:
            messages.success(request, f"{count} document(s) approved.")

    @admin.action(description="❌ Reject selected KYC documents")
    def reject_docs(self, request, queryset):
        from users.services import reject_kyc_document
        count = 0
        for doc in queryset.filter(status="pending"):
            try:
                reject_kyc_document(doc, request.user, "Rejected via admin panel")
                count += 1
            except Exception as exc:
                messages.error(request, f"Doc {doc.id}: {exc}")
        if count:
            messages.success(request, f"{count} document(s) rejected.")
