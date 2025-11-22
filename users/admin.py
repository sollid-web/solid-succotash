import csv

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.http import HttpResponse

from .models import Profile, User, UserNotification, UserWallet


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"


class UserWalletInline(admin.StackedInline):
    model = UserWallet
    can_delete = False
    verbose_name_plural = "Wallet"
    readonly_fields = ("balance", "updated_at")


class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, UserWalletInline)
    list_display = (
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "date_joined",
        "get_role",
        "get_balance",
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "date_joined",
        "profile__role",
    )
    search_fields = ("email", "first_name", "last_name", "profile__full_name")
    ordering = ("-date_joined",)
    actions = ["export_emails_csv", "export_users_csv"]

    @admin.action(description="Export email addresses (CSV)")
    def export_emails_csv(self, request, queryset):
        """Export just email addresses"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="user_emails.csv"'

        writer = csv.writer(response)
        writer.writerow(['Email'])

        for user in queryset:
            writer.writerow([user.email])

        self.message_user(request, f"{queryset.count()} email(s) exported.")
        return response


    @admin.action(description="Export user details (CSV)")
    def export_users_csv(self, request, queryset):
        """Export full user details"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="users_export.csv"'

        writer = csv.writer(response)
        writer.writerow(['Email', 'First Name', 'Last Name', 'Role', 'Balance', 'Date Joined', 'Active'])

        for user in queryset:
            try:
                role = user.profile.role
            except Profile.DoesNotExist:
                role = "N/A"

            try:
                balance = user.wallet.balance
            except UserWallet.DoesNotExist:
                balance = "0"

            writer.writerow([
                user.email,
                user.first_name,
                user.last_name,
                role,
                balance,
                user.date_joined.strftime('%Y-%m-%d'),
                user.is_active
            ])

        self.message_user(request, f"{queryset.count()} user(s) exported.")
        return response


    @admin.display(description="Role")
    def get_role(self, obj):
        try:
            return obj.profile.role
        except Profile.DoesNotExist:
            return "No Profile"


    @admin.display(description="Wallet Balance")
    def get_balance(self, obj):
        try:
            return f"${obj.wallet.balance}"
        except UserWallet.DoesNotExist:
            return "No Wallet"



@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "full_name", "created_at")
    list_filter = ("role", "created_at")
    search_fields = ("user__email", "user__first_name", "user__last_name", "full_name")
    readonly_fields = ("created_at",)


@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "updated_at")
    search_fields = ("user__email", "user__first_name", "user__last_name")
    readonly_fields = ("updated_at",)


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "title",
        "notification_type",
        "priority",
        "is_read",
        "created_at",
    )
    list_filter = ("notification_type", "priority", "is_read", "created_at")
    search_fields = ("user__email", "title", "message")
    readonly_fields = ("id", "created_at", "read_at")
    ordering = ("-created_at",)

    fieldsets = (
        (
            "Notification Info",
            {
                "fields": (
                    "id",
                    "user",
                    "notification_type",
                    "title",
                    "message",
                    "priority",
                )
            },
        ),
        ("Status", {"fields": ("is_read", "read_at", "created_at", "expires_at")}),
        (
            "Related Entity",
            {
                "fields": ("entity_type", "entity_id", "action_url"),
                "classes": ("collapse",),
            },
        ),
    )

    actions = ["mark_as_read", "mark_as_unread"]

    @admin.action(description="Mark selected notifications as read")
    def mark_as_read(self, request, queryset):
        count = queryset.update(is_read=True)
        self.message_user(request, f"{count} notification(s) marked as read.")


    @admin.action(description="Mark selected notifications as unread")
    def mark_as_unread(self, request, queryset):
        count = queryset.update(is_read=False, read_at=None)
        self.message_user(request, f"{count} notification(s) marked as unread.")



# Re-register UserAdmin
# admin.site.unregister(User)  # Not needed with custom User model
admin.site.register(User, UserAdmin)
