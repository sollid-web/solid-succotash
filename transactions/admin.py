from django.contrib.admin.sites import NotRegistered
from decimal import Decimal
from django import forms
from django.contrib import admin, messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import user_passes_test
from django.db import transaction
from django.db.models import Sum
from django.shortcuts import render
from django.urls import path
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.html import format_html
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView

from unfold.admin import ModelAdmin
from unfold.decorators import action as unfold_action
from unfold.admin import TabularInline, StackedInline
from investments.models import UserInvestment, InvestmentPlan
from users.models import UserWallet, KycDocument, KycApplication, Profile
from transactions.models import Transaction, VirtualCard

from .models import AdminAuditLog, CryptocurrencyWallet
from .services import approve_transaction, reject_transaction
from core.email_service import EmailService
from core.services.admin_email_commands import (
    get_active_user_count,
    get_active_user_emails,
    get_wolv_token_recipient_count,
    get_wolv_token_recipients,
    send_account_ready_email,
    send_manual_email,
    send_test_email,
    send_validation_email,
    send_virtual_card_email,
    send_wolv_token_announcement,
)

User = get_user_model()


def _credit_wallet(user, amount):
    from users.models import UserWallet

    wallet, _ = UserWallet.objects.get_or_create(user=user)
    wallet.balance += amount
    wallet.save(update_fields=["balance", "updated_at"])


def _debit_wallet(user, amount):
    from users.models import UserWallet

    wallet, _ = UserWallet.objects.get_or_create(user=user)
    if wallet.balance < amount:
        raise ValueError(f"Insufficient balance: {wallet.balance} < {amount}")
    wallet.balance -= amount
    wallet.save(update_fields=["balance", "updated_at"])


@admin.register(CryptocurrencyWallet)
class CryptocurrencyWalletAdmin(ModelAdmin):
    list_display = ("currency", "wallet_address", "network", "is_active", "updated_at")
    list_filter = ("currency", "is_active")
    list_fullwidth = True
    list_filter_sheet = True


@admin.register(Transaction)
class TransactionAdmin(ModelAdmin):
    list_display = (
        "id",
        "user",
        "tx_type",
        "payment_method",
        "amount",
        "status_badge",
        "created_at",
        "approved_by",
    )
    list_filter = ("tx_type", "payment_method", "status", "created_at")
    list_fullwidth = True
    list_filter_sheet = True
    search_fields = ("user__email", "reference", "tx_hash")
    readonly_fields = ("id", "created_at", "updated_at")
    actions = ["verify_and_release_funds", "reject_transactions"]

    fieldsets = (
        (
            "Financial Details",
            {
                "fields": (
                    "tx_type",
                    "payment_method",
                    "amount",
                    "reference",
                    "tx_hash",
                    "wallet_address_used",
                )
            },
        ),
        (
            "User Info",
            {
                "fields": (
                    "user",
                    "investment",
                    "approved_by",
                )
            },
        ),
        (
            "Admin Verification",
            {
                "fields": (
                    "status",
                    "notes",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user", "approved_by", "investment")

    @admin.action(description="Verify and Release Funds")
    def verify_and_release_funds(self, request, queryset):
        if not request.user.is_superuser:
            messages.error(request, "Only superusers can perform this action.")
            return

        success_count = 0
        error_count = 0

        for txn in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    approve_transaction(
                        txn, request.user, notes="Verified and released via admin action"
                    )
                    AdminAuditLog.objects.create(
                        admin=request.user,
                        entity="transaction",
                        entity_id=str(txn.id),
                        action="verify_release_funds",
                        notes=f"Verified and released {txn.amount} for {txn.user.email}",
                    )
                success_count += 1
            except Exception as e:
                error_count += 1
                messages.error(request, f"Error processing transaction {txn.id}: {str(e)}")

        if success_count:
            messages.success(
                request,
                f"Successfully verified and released funds for {success_count} transaction(s).",
            )
        if error_count:
            messages.error(request, f"Failed to process {error_count} transaction(s).")

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        color = {
            "approved": "#15803d",
            "rejected": "#b91c1c",
            "pending": "#f59e0b",
        }.get(obj.status, "#6b7280")

        return format_html(
            '<span style="display:inline-flex; align-items:center; padding:0.25rem 0.75rem; '
            'border-radius:9999px; font-weight:600; color:#ffffff; background-color:{};">{}</span>',
            color,
            obj.get_status_display(),
        )

    status_badge.display_format = {
        "approved": "success",
        "rejected": "danger",
        "pending": "warning",
    }

    @admin.action(description="Reject selected transactions")
    def reject_transactions(self, request, queryset):
        if not request.user.is_superuser:
            messages.error(request, "Only superusers can perform this action.")
            return

        success_count = 0
        for txn in queryset.filter(status="pending"):
            try:
                reject_transaction(txn, request.user, notes="Rejected via admin action")
                AdminAuditLog.objects.create(
                    admin=request.user,
                    entity="transaction",
                    entity_id=str(txn.id),
                    action="reject",
                    notes=f"Rejected transaction for {txn.user.email}",
                )
                success_count += 1
            except Exception as e:
                messages.error(request, f"Error rejecting transaction {txn.id}: {str(e)}")

        if success_count:
            messages.success(request, f"Successfully rejected {success_count} transaction(s).")


@admin.register(VirtualCard)
class VirtualCardAdmin(ModelAdmin):
    list_display = (
        "user",
        "card_type",
        "card_number_masked",
        "balance",
        "status",
        "is_active",
        "created_at",
    )
    list_filter = ("card_type", "status", "is_active")
    list_fullwidth = True
    list_filter_sheet = True
    readonly_fields = (
        "card_number",
        "cvv",
        "expiry_month",
        "expiry_year",
        "cardholder_name",
        "created_at",
        "updated_at",
    )
    actions = ["approve_cards", "reject_cards"]

    def card_number_masked(self, obj):
        return obj.get_masked_number()

    card_number_masked.short_description = "Card Number"

    @admin.action(description="Approve selected cards and generate card details")
    def approve_cards(self, request, queryset):
        success = 0
        failed = 0
        for card in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    card.status = "approved"
                    card.approved_by = request.user
                    card.is_active = True
                    card.save(update_fields=["status", "approved_by", "is_active", "updated_at"])
                    # THIS was missing — generates card_number, cvv, expiry, cardholder_name
                    card.generate_card_details()
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error approving card for {card.user.email}: {str(e)}")

        if success:
            messages.success(request, f"✅ {success} card(s) approved and details generated.")
        if failed:
            messages.error(request, f"❌ {failed} card(s) failed.")

    @admin.action(description="Reject selected cards")
    def reject_cards(self, request, queryset):
        success = 0
        failed = 0
        for card in queryset.filter(status="pending"):
            try:
                with transaction.atomic():
                    card.status = "rejected"
                    card.approved_by = request.user
                    card.save(update_fields=["status", "approved_by", "updated_at"])
                success += 1
            except Exception as e:
                failed += 1
                messages.error(request, f"Error rejecting card for {card.user.email}: {str(e)}")

        if success:
            messages.success(request, f"✅ {success} card(s) rejected.")
        if failed:
            messages.error(request, f"❌ {failed} card(s) failed.")


# Custom User Admin with wallet overview
# Defensive unregister
try:
    admin.site.unregister(User)
except NotRegistered:
    pass


# ── User detail inlines ─────────────────────────────────────────────────────


class WalletInline(TabularInline):
    model = UserWallet
    fields = ("balance", "updated_at")
    readonly_fields = ("balance", "updated_at")
    extra = 0
    can_delete = False
    verbose_name = "Wallet"
    verbose_name_plural = "Wallet"
    tab = True


class UserInvestmentInline(StackedInline):
    model = UserInvestment
    fields = ("plan", "amount", "status", "started_at", "ends_at", "created_at")
    readonly_fields = ("created_at",)
    extra = 1
    can_delete = True
    verbose_name = "Investment"
    verbose_name_plural = "Investments"
    tab = True
    autocomplete_fields = []

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("plan")


class TransactionInline(TabularInline):
    model = Transaction
    fk_name = "user"
    fields = ("tx_type", "amount", "status", "payment_method", "created_at")
    readonly_fields = ("tx_type", "amount", "status", "payment_method", "created_at")
    extra = 0
    can_delete = False
    verbose_name = "Transaction"
    verbose_name_plural = "Transaction History"
    tab = True

    def get_queryset(self, request):
        return super().get_queryset(request).order_by("-created_at")


class KycInline(StackedInline):
    model = KycApplication
    fields = (
        "status",
        "personal_info",
        "last_submitted_at",
        "reviewed_by",
        "reviewer_notes",
        "rejection_reason",
    )
    readonly_fields = ("personal_info", "last_submitted_at", "reviewed_by")
    extra = 0
    can_delete = False
    verbose_name = "KYC Application"
    verbose_name_plural = "KYC Applications"
    tab = True
    fk_name = "user"


class VirtualCardInline(TabularInline):
    model = VirtualCard
    fk_name = "user"
    fields = ("status", "expires_at", "created_at")
    readonly_fields = ("status", "expires_at", "created_at")
    extra = 0
    can_delete = False
    verbose_name = "Virtual Card"
    verbose_name_plural = "Virtual Cards"
    tab = True


@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = (
        "email",
        "get_full_name",
        "get_wallet_balance",
        "get_total_invested",
        "get_kyc_status",
        "date_joined",
        "is_active",
    )
    list_filter = ("is_active", "is_staff", "date_joined")
    list_fullwidth = True
    list_filter_sheet = True
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined", "last_login")
    actions = ["send_custom_email"]
    actions_detail = ["send_direct_message"]
    inlines = [WalletInline, UserInvestmentInline, TransactionInline, KycInline, VirtualCardInline]

    def get_wallet_balance(self, obj):
        try:
            return f"${obj.wallet.balance:.2f}"
        except (AttributeError, ValueError, TypeError):
            return "$0.00"

    get_wallet_balance.short_description = "Wallet Balance"
    get_wallet_balance.admin_order_field = "wallet__balance"

    def get_total_invested(self, obj):
        try:
            total = obj.investments.filter(
                status__in=["approved", "active", "completed"]
            ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
            return f"${total:.2f}"
        except (AttributeError, ValueError, TypeError):
            return "$0.00"

    get_total_invested.short_description = "Total Invested"

    def get_kyc_status(self, obj):
        try:
            app = obj.kyc_applications.order_by("-created_at").first()
            if not app:
                return format_html("<span style='color:#999'>None</span>")
            colors = {
                "draft": "#999",
                "pending": "#F59E0B",
                "approved": "#10B981",
                "rejected": "#EF4444",
            }
            color = colors.get(app.status, "#999")
            return format_html(
                "<span style='color:{};font-weight:600'>{}</span>", color, app.get_status_display()
            )
        except Exception:
            return "-"

    get_kyc_status.short_description = "KYC"

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("wallet")
            .prefetch_related("investments", "kyc_applications", "transactions")
        )

    @admin.action(description="Send Custom Email")
    def send_custom_email(self, request, queryset):
        subject = "Custom Message from WolvCapital"
        message = "This is a custom message."
        success_count = 0
        error_count = 0
        for user in queryset:
            try:
                EmailService.send_custom_email(user, subject, message)
                success_count += 1
            except Exception:
                error_count += 1
        if success_count:
            messages.success(request, f"✅ Emails sent to {success_count} user(s).")
        if error_count:
            messages.error(request, f"❌ Failed to send emails to {error_count} user(s).")

    @unfold_action(description="Send Direct Message", url_path="send-direct-message")
    def send_direct_message(self, request, object_id):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        obj = User.objects.get(pk=object_id)
        subject = "Direct Message from WolvCapital"
        message = "This is a direct message."
        try:
            EmailService.send_custom_email(obj, subject, message)
            AdminAuditLog.objects.create(
                admin=request.user,
                entity="user",
                entity_id=str(obj.id),
                action="send_direct_message",
                notes=f"Subject: {subject}",
            )
            messages.success(request, f"Successfully sent email to {obj.email}.")
        except Exception as e:
            messages.error(request, f"Failed to send email to {obj.email}: {str(e)}")
        from django.http import HttpResponseRedirect

        return HttpResponseRedirect(f"/admin/users/user/{object_id}/change/")


# System Health View
@method_decorator(staff_member_required, name="dispatch")
@method_decorator(user_passes_test(lambda u: u.is_superuser), name="dispatch")
@method_decorator(never_cache, name="dispatch")
class EmailCommandsView(TemplateView):
    template_name = "admin/email_commands.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["wolv_recipient_count"] = get_wolv_token_recipient_count()
        context["active_user_count"] = get_active_user_count()
        context["form_data"] = kwargs.get("form_data", {})
        return context

    def get(self, request, *args, **kwargs):
        return self.render_to_response(self.get_context_data())

    def post(self, request, *args, **kwargs):
        action = request.POST.get("action")
        form_data = {k: request.POST.get(k, "") for k in request.POST}
        form_data["dry_run"] = bool(request.POST.get("dry_run"))

        if action == "wolv_announcement":
            test_email = request.POST.get("wolv_test_email", "").strip()
            dry_run = bool(request.POST.get("wolv_dry_run"))
            recipients = get_wolv_token_recipients(test_email)

            if not recipients:
                messages.error(request, "No eligible recipients found.")
            elif dry_run:
                messages.warning(
                    request,
                    f"DRY RUN — {len(recipients)} recipient(s) would receive the announcement.",
                )
            else:
                result = send_wolv_token_announcement(recipients)
                messages.success(
                    request,
                    f"WOLV announcement sent: {result['sent']} | Failed: {result['failed']}",
                )
                if result["failed"]:
                    messages.error(request, f"Failed for {result['failed']} recipient(s).")

        elif action == "manual_email":
            subject = request.POST.get("manual_subject", "").strip()
            message_body = request.POST.get("manual_message", "").strip()
            send_to_all = bool(request.POST.get("manual_to_all"))
            recipient_email = request.POST.get("manual_to", "").strip()

            recipients = []
            if send_to_all:
                recipients = get_active_user_emails()
            elif recipient_email:
                recipients = [recipient_email]

            if not subject or not message_body:
                messages.error(request, "Subject and message are required for manual email.")
            elif not recipients:
                messages.error(request, "No recipients specified for manual email.")
            else:
                result = send_manual_email(subject, message_body, recipients)
                messages.success(
                    request,
                    f"Manual emails sent: {result['sent']} | Failed: {result['failed']}",
                )
                if result["failed"]:
                    messages.error(request, f"Failed for {result['failed']} recipient(s).")

        elif action == "account_ready":
            user_email = request.POST.get("account_ready_email", "").strip()
            dashboard_url = (
                request.POST.get("dashboard_url", "/dashboard/").strip() or "/dashboard/"
            )
            login_url = (
                request.POST.get("login_url", "/accounts/login/").strip() or "/accounts/login/"
            )
            password_reset_url = (
                request.POST.get("password_reset_url", "/accounts/password/reset/").strip()
                or "/accounts/password/reset/"
            )

            if not user_email:
                messages.error(request, "User email is required for account-ready email.")
            else:
                success = send_account_ready_email(
                    user_email, dashboard_url, login_url, password_reset_url
                )
                if success:
                    messages.success(request, f"Account-ready email sent to {user_email}.")
                else:
                    messages.error(request, f"Failed to send account-ready email to {user_email}.")

        elif action == "validation_reminder":
            to_email = request.POST.get("validation_email", "").strip()
            investor_name = request.POST.get("validation_name", "Investor").strip() or "Investor"

            if not to_email:
                messages.error(request, "Recipient email is required for validation reminder.")
            else:
                success = send_validation_email(to_email, investor_name)
                if success:
                    messages.success(request, f"Validation reminder sent to {to_email}.")
                else:
                    messages.error(request, f"Failed to send validation reminder to {to_email}.")

        elif action == "virtual_card":
            raw_recipients = request.POST.get("virtual_card_emails", "").strip()
            recipients = [email.strip() for email in raw_recipients.split(",") if email.strip()]
            if not recipients:
                messages.error(
                    request, "At least one recipient email is required for virtual card email."
                )
            else:
                result = send_virtual_card_email(recipients)
                messages.success(
                    request,
                    f"Virtual card emails sent: {result['sent']} | Failed: {result['failed']}",
                )
                if result["failed"]:
                    messages.error(request, f"Failed for {result['failed']} recipient(s).")

        elif action == "test_email":
            test_email = request.POST.get("test_email", "").strip()
            email_type = request.POST.get("test_type", "test").strip()
            if not test_email:
                messages.error(request, "Test email address is required.")
            else:
                success = send_test_email(test_email, email_type)
                if success:
                    messages.success(request, f"Test email ({email_type}) sent to {test_email}.")
                else:
                    messages.error(request, f"Failed to send test email to {test_email}.")

        else:
            messages.error(request, "Unknown email command action.")

        context = self.get_context_data(form_data=form_data)
        return self.render_to_response(context)


class SystemStatusView(TemplateView):
    template_name = "admin/system_status.html"

    def get(self, request):
        # Get last 50 lines of django.log
        log_content = ""
        try:
            with open("django.log") as f:
                lines = f.readlines()[-50:]
                log_content = "".join(lines)
        except FileNotFoundError:
            log_content = "django.log file not found."

        # Check Supabase connection
        supabase_status = "Unknown"
        try:
            from django.db import connection

            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            supabase_status = "Connected"
        except Exception as e:
            supabase_status = f"Error: {str(e)}"

        # Get quick stats
        today = timezone.now().date()
        deposits_today = Transaction.objects.filter(
            tx_type="deposit", status="approved", created_at__date=today
        ).aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

        active_investors = (
            User.objects.filter(transactions__tx_type="deposit", transactions__status="approved")
            .distinct()
            .count()
        )

        pending_withdrawals = Transaction.objects.filter(
            tx_type="withdrawal", status="pending"
        ).count()

        context = {
            "log_content": log_content,
            "supabase_status": supabase_status,
            "deposits_today": deposits_today,
            "active_investors": active_investors,
            "pending_withdrawals": pending_withdrawals,
        }

        return render(request, self.template_name, context)


# Add system status URL
original_admin_urls = admin.site.get_urls


def get_admin_urls():
    urls = [
        path("system-status/", SystemStatusView.as_view(), name="system_status"),
        path(
            "email-commands/",
            EmailCommandsView.as_view(),
            name="email_commands",
        ),
    ]
    return urls + original_admin_urls()


admin.site.get_urls = get_admin_urls


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(ModelAdmin):
    list_display = ("admin", "entity", "action", "created_at")
    list_fullwidth = True
    list_filter_sheet = True
    readonly_fields = ("admin", "entity", "entity_id", "action", "notes", "created_at")
