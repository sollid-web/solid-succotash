from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from core.models import Agreement, PlatformCertificate, SupportRequest, UserAgreementAcceptance
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import CryptocurrencyWallet, Transaction, VirtualCard
from users.models import KycApplication, Profile, UserNotification, UserWallet


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
    ends_at = serializers.SerializerMethodField()

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

    def get_ends_at(self, obj):
        # Approved investments should always run for plan.duration_days from started_at.
        # This is a read-time safeguard for legacy records with stale ends_at.
        if (
            obj.status == "approved"
            and obj.started_at
            and getattr(obj, "plan", None)
            and getattr(obj.plan, "duration_days", None)
        ):
            expected = obj.started_at + timezone.timedelta(days=int(obj.plan.duration_days))
            return expected
        return obj.ends_at

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
        def validate(self, attrs):
            """
            Enforce: withdrawals allowed ONLY from profit of EXPIRED plans.
            """
            from django.utils import timezone
            from django.db.models import Sum
            from transactions.models import Transaction
            tx_type = attrs.get("tx_type") or getattr(self.instance, "tx_type", None)

            # Only enforce rule for withdrawals
            if tx_type != "withdrawal":
                return attrs

            request = self.context.get("request")
            user = request.user if request else None
            if not user:
                raise serializers.ValidationError("Authentication required.")

            investment = attrs.get("investment") or getattr(self.instance, "investment", None)
            if not investment:
                raise serializers.ValidationError({"investment": "Withdrawal must be linked to an investment."})

            now = timezone.now()
            if not investment.ends_at or investment.ends_at > now:
                raise serializers.ValidationError("Withdrawals are only allowed after the investment expires.")

            # compute available profit from EXPIRED investments only
            expired_profit = Transaction.objects.filter(
                user=user,
                tx_type="profit",
                status__in=["approved", "completed"],
                investment__ends_at__lte=now,
            ).aggregate(total=Sum("amount"))["total"] or 0

            already_withdrawn = Transaction.objects.filter(
                user=user,
                tx_type="withdrawal",
                status__in=["pending", "approved", "completed"],
                investment__ends_at__lte=now,
            ).aggregate(total=Sum("amount"))["total"] or 0

            available = expired_profit - already_withdrawn
            amount = attrs.get("amount") or 0

            if amount <= 0:
                raise serializers.ValidationError({"amount": "Amount must be greater than zero."})

            if amount > available:
                raise serializers.ValidationError(
                    {"amount": f"Insufficient withdrawable profit. Available: {available:.2f}"}
                )

            return attrs
P    class Meta:
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


class KycApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    reviewed_by_email = serializers.EmailField(source="reviewed_by.email", read_only=True)

    class Meta:
        model = KycApplication
        fields = [
            "id",
            "user_email",
            "status",
            "personal_info",
            "document_info",
            "personal_info_submitted_at",
            "document_submitted_at",
            "last_submitted_at",
            "reviewed_by_email",
            "reviewed_at",
            "reviewer_notes",
            "rejection_reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class AdminKycApplicationSerializer(KycApplicationSerializer):
    class Meta(KycApplicationSerializer.Meta):
        fields = KycApplicationSerializer.Meta.fields


class KycPersonalInfoSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    date_of_birth = serializers.DateField()
    nationality = serializers.CharField(max_length=60)
    address = serializers.CharField()


class KycDocumentSerializer(serializers.Serializer):
    government_id = serializers.JSONField()
    proof_of_address = serializers.JSONField()

    def validate(self, attrs):
        if not attrs.get("government_id") or not attrs.get("proof_of_address"):
            raise serializers.ValidationError(
                "Both government ID and proof of address metadata are required."
            )
        return attrs


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
    ends_at = serializers.SerializerMethodField()

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

        read_only_fields = fields

    def get_ends_at(self, obj):
        if (
            obj.status == "approved"
            and obj.started_at
            and getattr(obj, "plan", None)
            and getattr(obj.plan, "duration_days", None)
        ):
            expected = obj.started_at + timezone.timedelta(days=int(obj.plan.duration_days))
            return expected
        return obj.ends_at


class SupportRequestStatusSerializer(serializers.ModelSerializer):
    """Expose admin-updated support request fields back to the user."""

    class Meta:
        model = SupportRequest
        fields = [
            "id",
            "topic",
            "status",
            "responded_at",
            "admin_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


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


class CryptocurrencyWalletSerializer(serializers.ModelSerializer):
    """Public serializer exposing company crypto deposit addresses."""

    class Meta:
        model = CryptocurrencyWallet
        fields = [
            "currency",
            "wallet_address",
            "network",
            "is_active",
            "updated_at",
        ]
        read_only_fields = fields


class VirtualCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualCard
        fields = [
            "id",
            "card_type",
            "card_number",
            "cardholder_name",
            "expiry_month",
            "expiry_year",
            "cvv",
            "balance",
            "purchase_amount",
            "status",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "card_number",
            "cardholder_name",
            "expiry_month",
            "expiry_year",
            "cvv",
            "balance",
            "status",
            "is_active",
            "created_at",
            "updated_at",
        ]


class PlatformCertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformCertificate
        fields = [
            "title",
            "certificate_id",
            "issue_date",
            "jurisdiction",
            "issuing_authority",
            "verification_url",
            "authority_seal_url",
            "signature_1_url",
            "signature_2_url",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
