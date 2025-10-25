from django.core.exceptions import ValidationError as DjangoValidationError
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from investments.models import InvestmentPlan, UserInvestment
from investments.services import (
    approve_investment,
    create_investment,
    reject_investment,
)
from transactions.models import Transaction
from transactions.services import (
    approve_transaction,
    create_transaction,
    reject_transaction,
)
from users.models import UserWallet

from .serializers import (
    AdminTransactionSerializer,
    AdminUserInvestmentSerializer,
    InvestmentPlanSerializer,
    TransactionSerializer,
    UserInvestmentSerializer,
    UserWalletSerializer,
)


class InvestmentPlanViewSet(viewsets.ReadOnlyModelViewSet):
    """Public endpoint for investment plans"""

    queryset = InvestmentPlan.objects.all()
    serializer_class = InvestmentPlanSerializer
    permission_classes = [permissions.AllowAny]


class UserInvestmentViewSet(viewsets.ModelViewSet):
    """User investments endpoint"""

    serializer_class = UserInvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserInvestment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan = get_object_or_404(InvestmentPlan, id=serializer.validated_data["plan_id"])
        amount = serializer.validated_data["amount"]

        try:
            investment = create_investment(request.user, plan, amount)
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        output_serializer = self.get_serializer(investment)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TransactionViewSet(viewsets.ModelViewSet):
    """User transactions endpoint"""

    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data

        try:
            txn = create_transaction(
                user=request.user,
                tx_type=validated["tx_type"],
                amount=validated["amount"],
                reference=validated["reference"],
                payment_method=validated.get("payment_method", "bank_transfer"),
                tx_hash=validated.get("tx_hash", ""),
                wallet_address_used=validated.get("wallet_address_used", ""),
            )
        except DjangoValidationError as exc:
            raise ValidationError(exc.messages)

        output_serializer = self.get_serializer(txn)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class WalletView(APIView):
    """User wallet endpoint"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        wallet, created = UserWallet.objects.get_or_create(user=request.user)
        serializer = UserWalletSerializer(wallet)
        return Response(serializer.data)


class AdminTransactionViewSet(viewsets.ModelViewSet):
    """Admin transactions management endpoint"""

    queryset = Transaction.objects.all()
    serializer_class = AdminTransactionSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        target_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if target_status and target_status != instance.status:
            try:
                if target_status == "approved":
                    approve_transaction(instance, request.user, notes)
                elif target_status == "rejected":
                    reject_transaction(instance, request.user, notes)
                else:
                    raise ValidationError("Unsupported status change requested.")
            except DjangoValidationError as exc:
                raise ValidationError(exc.messages)

            instance.refresh_from_db()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        kwargs["partial"] = partial
        return super().update(request, *args, **kwargs)


class AdminUserInvestmentViewSet(viewsets.ModelViewSet):
    """Admin investments management endpoint"""

    queryset = UserInvestment.objects.all()
    serializer_class = AdminUserInvestmentSerializer
    permission_classes = [permissions.IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        target_status = request.data.get("status")
        notes = request.data.get("notes", "")

        if target_status and target_status != instance.status:
            try:
                if target_status == "approved":
                    approve_investment(instance, request.user, notes)
                elif target_status == "rejected":
                    reject_investment(instance, request.user, notes)
                else:
                    raise ValidationError("Unsupported status change requested.")
            except DjangoValidationError as exc:
                raise ValidationError(exc.messages)

            instance.refresh_from_db()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)

        kwargs["partial"] = partial
        return super().update(request, *args, **kwargs)
