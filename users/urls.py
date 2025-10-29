"""
URLs for users app
"""

from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notifications'),
    path('notifications/mark-read/<uuid:notification_id>/', views.mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', views.mark_all_read, name='mark_all_read'),
    path('notifications/unread-count/', views.get_unread_count, name='unread_count'),
    
    # Email preferences
    path('email-preferences/', views.email_preferences, name='email_preferences'),
]