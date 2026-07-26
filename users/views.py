"""
Views for users app

All user-facing functionality has been migrated to REST API endpoints.

Notification Management:
- GET /api/notifications/ - List notifications (replaces NotificationListView)
- POST /api/notifications/{id}/mark-read/ - Mark notification as read
- POST /api/notifications/mark-all-read/ - Mark all as read
- GET /api/notifications/unread-count/ - Get unread count

Email Preferences:
- GET/PUT/PATCH /api/profile/email-preferences/ - Manage email preferences

See api/views.py for the implementation of UserNotificationViewSet and EmailPreferencesView.
"""
