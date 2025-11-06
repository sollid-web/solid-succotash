from decimal import Decimal
from django.db.models import Sum
from rest_framework import serializers

from core.models import Agreement, UserAgreementAcceptance
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import Profile, UserNotification, UserWallet


class AgreementSerializer(serializers.ModelSerializer):
    accepted = serializers.SerializerMethodField()
    accepted_at = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = [
            "id",
            "title",
            "slug",
            "version",
            "body",
            "effective_date",
            "is_active",
            "accepted",
            "accepted_at",
        ]
        read_only_fields = fields

    def _get_user(self):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        return user if user and user.is_authenticated else None

    def _get_acceptance(self, obj) -> UserAgreementAcceptance | None:
        user = self._get_user()
        if not user:
            return None

        cache = self.context.setdefault("_acceptance_cache", {})
        cache_key = (user.pk, obj.pk)
        if cache_key in cache:
            return cache[cache_key]

        acceptance = UserAgreementAcceptance.objects.filter(user=user, agreement=obj).first()
        cache[cache_key] = acceptance
        return acceptance

    def get_accepted(self, obj):
        return self._get_acceptance(obj) is not None

    def get_accepted_at(self, obj):
        acceptance = self._get_acceptance(obj)
        return acceptance.accepted_at if acceptance else None


class InvestmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentPlan
        fields = [
            "id",
            "name",
            "description",
            "daily_roi",
            "duration_days",
            "min_amount",
            "max_amount",
        ]


class UserInvestmentSerializer(serializers.ModelSerializer):
    plan = InvestmentPlanSerializer(read_only=True)
    plan_id = serializers.IntegerField(write_only=True)
    total_return = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = UserInvestment
        fields = [
            "id",
            "plan",
            "plan_id",
            "amount",
            "status",
            "started_at",
            "ends_at",
            "created_at",
            "total_return",
        ]
        read_only_fields = ["status", "started_at", "ends_at", "created_at"]

    def validate(self, data):
        plan_id = data.get("plan_id")
        amount = data.get("amount")

        if plan_id and amount:
            try:
                plan = InvestmentPlan.objects.get(id=plan_id)
                if amount < plan.min_amount:
                    raise serializers.ValidationError(
                        f"Minimum investment for {plan.name} is ${plan.min_amount}"
                    )
                if amount > plan.max_amount:
                    raise serializers.ValidationError(
                        f"Maximum investment for {plan.name} is ${plan.max_amount}"
                    )
            except InvestmentPlan.DoesNotExist:
                raise serializers.ValidationError("Invalid investment plan")

        return data


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "tx_type",
            "amount",
            "reference",
            "payment_method",
            "tx_hash",
            "wallet_address_used",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]
        extra_kwargs = {
            "payment_method": {"required": False},
            "tx_hash": {"required": False, "allow_blank": True},
            "wallet_address_used": {"required": False, "allow_blank": True},
        }


class UserWalletSerializer(serializers.ModelSerializer):
    total_deposits = serializers.SerializerMethodField()
    total_withdrawals = serializers.SerializerMethodField()

    class Meta:
        model = UserWallet
        fields = ["balance", "total_deposits", "total_withdrawals", "updated_at"]
        read_only_fields = ["balance", "total_deposits", "total_withdrawals", "updated_at"]

    def get_total_deposits(self, obj):
        from transactions.models import Transaction
        total = (
            Transaction.objects.filter(
                user=obj.user, tx_type="deposit", status="approved"
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        return total

    def get_total_withdrawals(self, obj):
        from transactions.models import Transaction
        total = (
            Transaction.objects.filter(
                user=obj.user, tx_type="withdrawal", status="approved"
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )
        return total


class AdminTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    approved_by_email = serializers.EmailField(source="approved_by.email", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user_email",
            "tx_type",
            "amount",
            "reference",
            "status",
            "notes",
            "approved_by_email",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user_email",
            "tx_type",
            "amount",
            "reference",
            "approved_by_email",
            "created_at",
            "updated_at",
        ]


class AdminUserInvestmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    plan_name = serializers.CharField(source="plan.name", read_only=True)
    total_return = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = UserInvestment
        fields = [
            "id",
            "user_email",
            "plan_name",
            "amount",
            "status",
            "started_at",
            "ends_at",
            "created_at",
            "total_return",
        ]
        read_only_fields = [
            "user_email",
            "plan_name",
            "amount",
            "created_at",
            "total_return",
        ]


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "action_url",
            "entity_type",
            "entity_id",
            "priority",
            "is_read",
            "read_at",
            "created_at",
            "expires_at",
        ]
        read_only_fields = [
            "id",
            "notification_type",
            "title",
            "message",
            "action_url",
            "entity_type",
            "entity_id",
            "priority",
            "read_at",
            "created_at",
            "expires_at",
        ]


class EmailPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "email_notifications_enabled",
            "email_welcome",
            "email_transactions",
            "email_investments",
            "email_roi_payouts",
            "email_wallet_updates",
            "email_security_alerts",
            "email_marketing",
        ]
