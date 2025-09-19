from django.urls import path
from . import views

urlpatterns = [
    # Public pages
    path('', views.HomeView.as_view(), name='home'),
    path('plans/', views.PlansView.as_view(), name='plans'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    
    # Legal pages
    path('risk-disclosure/', views.RiskDisclosureView.as_view(), name='risk_disclosure'),
    path('terms/', views.TermsView.as_view(), name='terms'),
    path('privacy/', views.PrivacyView.as_view(), name='privacy'),
    
    # User area
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('invest/', views.InvestView.as_view(), name='invest'),
    path('deposit/', views.DepositView.as_view(), name='deposit'),
    path('withdrawals/', views.WithdrawalsView.as_view(), name='withdrawals'),
    path('withdraw/', views.WithdrawView.as_view(), name='withdraw'),
]