from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import UserWallet
# from investments.services import create_investment, approve_investment, reject_investment
# from transactions.services import create_transaction, approve_transaction, reject_transaction
from .serializers import (
    InvestmentPlanSerializer,
    UserInvestmentSerializer,
    TransactionSerializer,
    UserWalletSerializer,
    AdminTransactionSerializer,
    AdminUserInvestmentSerializer,
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


class TransactionViewSet(viewsets.ModelViewSet):
    """User transactions endpoint"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


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


class AdminUserInvestmentViewSet(viewsets.ModelViewSet):
    """Admin investments management endpoint"""
    queryset = UserInvestment.objects.all()
    serializer_class = AdminUserInvestmentSerializer
    permission_classes = [permissions.IsAdminUser]
