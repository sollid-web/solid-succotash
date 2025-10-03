from django.urls import path
from . import views
from users import views as user_views

urlpatterns = [
    # Public pages
    path('', views.HomeView.as_view(), name='home'),
    path('plans/', views.PlansView.as_view(), name='plans'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('contact/', views.ContactView.as_view(), name='contact'),
    
    # Legal pages
    path('risk-disclosure/', views.RiskDisclosureView.as_view(), name='risk_disclosure'),
    path('terms/', views.TermsView.as_view(), name='terms'),  # Legal Disclaimer
    path('terms-of-service/', views.TermsOfServiceView.as_view(), name='terms_of_service'),
    path('privacy/', views.PrivacyView.as_view(), name='privacy'),
    
    # User area
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('invest/', views.InvestView.as_view(), name='invest'),
    path('deposit/', views.DepositView.as_view(), name='deposit'),
    path('withdrawals/', views.WithdrawalsView.as_view(), name='withdrawals'),
    path('withdraw/', views.WithdrawView.as_view(), name='withdraw'),
    
    # Notifications
    path('notifications/', user_views.NotificationListView.as_view(), name='notifications'),
    path('notifications/<uuid:notification_id>/read/', user_views.mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', user_views.mark_all_read, name='mark_all_read'),
    path('notifications/unread-count/', user_views.get_unread_count, name='unread_count'),
]