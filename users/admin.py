from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.urls import path

from transactions.services import approve_transaction, create_transaction

from .models import UserWallet, KycDocument, KycApplication

User = get_user_model()

# Register User WITHOUT profile inline


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "is_active", "is_staff", "get_wallet_balance")
    search_fields = ("email",)
    ordering = ("id",)
    actions = ("credit_wallet",)

    def get_wallet_balance(self, obj):
        try:
            return f"${obj.wallet.balance}"
        except Exception:
            return "-"

    get_wallet_balance.short_description = "Wallet Balance"

    @admin.action(description="Credit wallet (SAFE)")
    def credit_wallet(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(request, "Select exactly one user.", level=messages.ERROR)
            return

        user = queryset.first()

        try:
            amount = user.wallet.balance
        except Exception:
            self.message_user(request, "Selected user does not have a wallet.", level=messages.ERROR)
            return

        tx = create_transaction(
            user=user,
            tx_type="deposit",
            amount=amount,  # replace via popup later if needed
            payment_method="admin_adjustment",
            reference="Admin wallet credit",
        )
        approve_transaction(tx, request.user, notes="Admin credit")

        self.message_user(request, "Wallet credited successfully.", level=messages.SUCCESS)


class WalletAdjustmentForm(forms.Form):
    amount = forms.DecimalField(
        min_value=0.01,
        decimal_places=2,
        max_digits=20,
        help_text="Enter the amount to credit or debit"
    )
    note = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={"rows": 3}),
        help_text="Optional admin note"
    )


@admin.register(UserWallet)
class UserWalletAdmin(admin.ModelAdmin):
    list_display = ("user", "balance", "updated_at")
    readonly_fields = ("user", "balance", "updated_at")
    actions = ["credit_wallet_popup", "debit_wallet_popup"]

    @admin.action(description="Credit wallet (enter amount)")
    def credit_wallet_popup(self, request, queryset):
        return self._wallet_adjustment(
            request,
            queryset,
            tx_type="deposit",
            title="Credit Wallet"
        )

    @admin.action(description="Debit wallet (enter amount)")
    def debit_wallet_popup(self, request, queryset):
        return self._wallet_adjustment(
            request,
            queryset,
            tx_type="withdrawal",
            title="Debit Wallet"
        )

    def _wallet_adjustment(self, request, queryset, tx_type, title):
        if queryset.count() != 1:
            self.message_user(
                request,
                "Please select exactly one wallet.",
                level=messages.ERROR
            )
            return None

        wallet = queryset.first()

        if request.method == "POST" and "apply" in request.POST:
            form = WalletAdjustmentForm(request.POST)
            if form.is_valid():
                amount = form.cleaned_data["amount"]
                note = form.cleaned_data.get("note") or ""

                tx = create_transaction(
                    user=wallet.user,
                    tx_type=tx_type,
                    amount=amount,
                    payment_method="admin_adjustment",
                    reference=f"Admin {tx_type}"
                )
                approve_transaction(tx, request.user, note)

                self.message_user(
                    request,
                    f"Wallet successfully {'credited' if tx_type == 'deposit' else 'debited'} by {amount}.",
                    level=messages.SUCCESS
                )
                return None
        else:
            form = WalletAdjustmentForm(
                initial={
                    "_selected_action": queryset.values_list("id", flat=True)
                }
            )

        return render(
            request,
            "admin/wallet_adjustment.html",
            {
                "wallet": wallet,
                "form": form,
                "title": title,
                "action": tx_type,
            },
        )


@admin.register(KycDocument)
class KycDocumentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "document_type",
        "colored_status",
        "submitted_at",
        "reviewed_by",
        "action_buttons",
    )
    readonly_fields = (
        "user",
        "document_type",
        "document_file",
        "submitted_at",
        "reviewed_at",
        "reviewed_by",
        "rejection_reason",
    )
    search_fields = ("user__email", "user__username")
    list_filter = (
        "status",
        "document_type",
        ("submitted_at", admin.DateFieldListFilter),
    )
    ordering = ("-submitted_at",)
    actions = ["approve_selected", "reject_selected"]

    def colored_status(self, obj):
        # color coding for status
        colors = {"pending": "#F59E0B", "approved": "#10B981", "rejected": "#EF4444"}
        color = colors.get(obj.status, "#000000")
        return format_html("<span style='color: {}; font-weight:600;'>{}</span>", color, obj.get_status_display())

    colored_status.short_description = "Status"
    colored_status.admin_order_field = "status"

    def action_buttons(self, obj):
        if obj.status == "pending":
            approve_url = reverse("admin:users_kycdocument_approve", args=[obj.pk])
            reject_url = reverse("admin:users_kycdocument_reject", args=[obj.pk])
            return format_html(
                "<a class='button' href='{}'>Approve</a> &nbsp; <a class='button' href='{}'>Reject</a>",
                approve_url,
                reject_url,
            )
        return "-"

    action_buttons.short_description = "Actions"
    action_buttons.allow_tags = True

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("<path:object_id>/approve/", self.admin_site.admin_view(self.process_approve), name="users_kycdocument_approve"),
            path("<path:object_id>/reject/", self.admin_site.admin_view(self.process_reject), name="users_kycdocument_reject"),
        ]
        return custom + urls

    def process_approve(self, request, object_id, *args, **kwargs):
        obj = self.get_object(request, object_id)
        if obj and obj.status == "pending":
            from users.services import approve_kyc_document
            approve_kyc_document(obj, request.user)
            self.message_user(request, "Document approved", level=messages.SUCCESS)
        return HttpResponseRedirect(request.META.get("HTTP_REFERER", "."))

    def process_reject(self, request, object_id, *args, **kwargs):
        obj = self.get_object(request, object_id)
        if request.method == "POST":
            reason = request.POST.get("reason", "")
            from users.services import reject_kyc_document
            reject_kyc_document(obj, request.user, reason)
            self.message_user(request, "Document rejected", level=messages.SUCCESS)
            return HttpResponseRedirect(request.META.get("HTTP_REFERER", "."))
        context = {"object": obj}
        return render(request, "admin/kyc_reject_form.html", context)

    @admin.action(description="Approve selected documents")
    def approve_selected(self, request, queryset):
        from users.services import approve_kyc_document
        for obj in queryset.filter(status="pending"):
            approve_kyc_document(obj, request.user)
        self.message_user(request, f"{queryset.count()} document(s) approved", level=messages.SUCCESS)

    @admin.action(description="Reject selected documents")
    def reject_selected(self, request, queryset):
        # simple rejection without reason for bulk; admin can edit reason later
        from users.services import reject_kyc_document
        for obj in queryset.filter(status="pending"):
            reject_kyc_document(obj, request.user, "")
        self.message_user(request, f"{queryset.count()} document(s) rejected", level=messages.SUCCESS)


@admin.register(KycApplication)
class KycApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "status", "last_submitted_at", "reviewed_by")
    readonly_fields = ("id", "user", "personal_info", "document_info", "created_at", "updated_at")
    search_fields = ("user__email",)
    list_filter = ("status",)
    ordering = ("-created_at",)
    fieldsets = (
        ("User", {"fields": ("id", "user")}),
        ("Status", {"fields": ("status", "reviewed_by", "reviewed_at", "reviewer_notes", "rejection_reason")}),
        ("Submissions", {"fields": ("personal_info", "document_info", "personal_info_submitted_at", "document_submitted_at", "last_submitted_at")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
