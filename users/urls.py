"""
URLs for users app

All user-facing routes have been migrated to REST API endpoints at /api/.
This app no longer serves template-based views.

API Routes (see api/urls.py):
- /api/notifications/ - List, mark read, get unread count
- /api/profile/email-preferences/ - Manage email preferences
"""

app_name = 'users'

urlpatterns = [
    # All routes migrated to /api/ - see api/urls.py
    # - /api/notifications/ (list, mark-read, mark-all-read, unread-count)
    # - /api/profile/email-preferences/
]

