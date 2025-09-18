from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from users.models import UserWallet
from investments.services import create_investment, approve_investment, reject_investment
from transactions.services import create_transaction, approve_transaction, reject_transaction
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
    
    def perform_create(self, serializer):
        plan = get_object_or_404(InvestmentPlan, id=serializer.validated_data['plan_id'])
        investment = create_investment(
            user=self.request.user,
            plan=plan,
            amount=serializer.validated_data['amount']
        )
        serializer.instance = investment


class TransactionViewSet(viewsets.ModelViewSet):
    """User transactions endpoint"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        transaction = create_transaction(
            user=self.request.user,
            tx_type=serializer.validated_data['tx_type'],
            amount=serializer.validated_data['amount'],
            reference=serializer.validated_data['reference']
        )
        serializer.instance = transaction


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
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        transaction = self.get_object()
        notes = request.data.get('notes', '')
        
        try:
            approve_transaction(transaction, request.user, notes)
            return Response({'status': 'approved'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        transaction = self.get_object()
        notes = request.data.get('notes', '')
        
        try:
            reject_transaction(transaction, request.user, notes)
            return Response({'status': 'rejected'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class AdminUserInvestmentViewSet(viewsets.ModelViewSet):
    """Admin investments management endpoint"""
    queryset = UserInvestment.objects.all()
    serializer_class = AdminUserInvestmentSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        investment = self.get_object()
        notes = request.data.get('notes', '')
        
        try:
            approve_investment(investment, request.user, notes)
            return Response({'status': 'approved'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        investment = self.get_object()
        notes = request.data.get('notes', '')
        
        try:
            reject_investment(investment, request.user, notes)
            return Response({'status': 'rejected'})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
