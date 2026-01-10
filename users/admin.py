from django import forms
from django.contrib import admin, messages
from django.contrib.auth import get_user_model
from django.shortcuts import render

from transactions.services import approve_transaction, create_transaction

from .models import UserWallet

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
    readonly_fields = ("user", "balance", "created_at", "updated_at")
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
