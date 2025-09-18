from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'investments', views.UserInvestmentViewSet, basename='api-investments')
router.register(r'transactions', views.TransactionViewSet, basename='api-transactions')
router.register(r'plans', views.InvestmentPlanViewSet, basename='api-plans')

# Admin endpoints
router.register(r'admin/transactions', views.AdminTransactionViewSet, basename='api-admin-transactions')
router.register(r'admin/investments', views.AdminUserInvestmentViewSet, basename='api-admin-investments')

urlpatterns = [
    path('', include(router.urls)),
    path('wallet/', views.WalletView.as_view(), name='api-wallet'),
]