# 🔔 Notification System - Quick Reference

## 📍 Access Points

| What | URL | Who |
|------|-----|-----|
| User Notifications | `/notifications/` | Users |
| Dashboard Widget | `/dashboard/` | Users |
| Admin Panel | `/admin/users/usernotification/` | Admins |
| Unread Count API | `/notifications/unread-count/` | AJAX |

## 🎯 Common Tasks

### Send Notification to User
```python
from users.notification_service import create_user_notification

create_user_notification(
    user=user,
    notification_type='system_alert',
    title='Your Title Here',
    message='Your message here',
    priority='high',  # 'low', 'medium', or 'high'
    action_url='/dashboard/',  # Optional
    expires_in_days=30  # Optional
)
```

### Pre-built Notification Functions
```python
from users.notification_service import *

# Transactions
notify_deposit_approved(user, transaction, admin_notes='')
notify_deposit_rejected(user, transaction, reason='')
notify_withdrawal_approved(user, transaction, admin_notes='')
notify_withdrawal_rejected(user, transaction, reason='')

# Investments
notify_investment_approved(user, investment, admin_notes='')
notify_investment_rejected(user, investment, reason='')
notify_investment_completed(user, investment)

# Wallet
notify_wallet_credited(user, amount, reason='')
notify_wallet_debited(user, amount, reason='')

# Cards
notify_card_approved(user, card, admin_notes='')
notify_card_rejected(user, card, reason='')

# Other
notify_welcome(user)
```

### Get User Notifications
```python
from users.notification_service import get_user_notifications, get_unread_count

# Get all notifications
all_notifs = get_user_notifications(user)

# Get only unread
unread = get_user_notifications(user, unread_only=True)

# Get limited number
latest_5 = get_user_notifications(user, limit=5)

# Get unread count
count = get_unread_count(user)
```

### Mark as Read
```python
from users.notification_service import mark_notification_read, mark_all_read

# Mark single notification
mark_notification_read(notification_id, user)

# Mark all as read
count = mark_all_read(user)
```

## 📋 Notification Types

| Type | When Used |
|------|-----------|
| `deposit_approved` | Admin approves deposit |
| `deposit_rejected` | Admin rejects deposit |
| `withdrawal_approved` | Admin approves withdrawal |
| `withdrawal_rejected` | Admin rejects withdrawal |
| `investment_approved` | Admin approves investment |
| `investment_rejected` | Admin rejects investment |
| `investment_completed` | Investment duration ends |
| `card_approved` | Virtual card approved |
| `card_rejected` | Virtual card rejected |
| `wallet_credited` | Wallet balance increased |
| `wallet_debited` | Wallet balance decreased |
| `roi_payout` | ROI payment received |
| `system_alert` | System announcements |
| `welcome` | New user signup |

## 🎨 Priority Levels

| Priority | Badge Color | Use Case |
|----------|-------------|----------|
| `high` | 🔴 Red | Critical actions, approvals, rejections |
| `medium` | 🟡 Yellow | Standard updates, completions |
| `low` | 🟢 Green | Informational messages |

## 📊 Template Usage

### Display Notifications in Template
```django
{% load static %}

<!-- Show unread count -->
<span class="badge">{{ unread_count }}</span>

<!-- Loop through notifications -->
{% for notification in notifications %}
<div class="notification {% if not notification.is_read %}unread{% endif %}">
    <h4>{{ notification.title }}</h4>
    <p>{{ notification.message }}</p>
    <small>{{ notification.created_at|date:"Y-m-d H:i" }}</small>

    {% if notification.action_url %}
    <a href="{{ notification.action_url }}">View</a>
    {% endif %}
</div>
{% endfor %}
```

### Context in Views
```python
from users.models import UserNotification

# In your view
notifications = UserNotification.objects.filter(
    user=request.user,
    is_read=False
)[:5]

context = {
    'notifications': notifications,
    'unread_count': notifications.count()
}
```

## 🔧 Admin Actions

### Django Admin
1. Go to `/admin/users/usernotification/`
2. **Filter by:** Type, Priority, Read Status, Date
3. **Search by:** User email, Title, Message
4. **Bulk Actions:** Mark as read/unread

### Custom Admin Action
```python
# In admin.py
@admin.action(description='Mark selected as read')
def mark_as_read(modeladmin, request, queryset):
    queryset.update(is_read=True)
```

## 🧪 Testing

### Test in Django Shell
```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
from users.notification_service import *

User = get_user_model()
user = User.objects.first()

# Send test notification
notify_welcome(user)

# Check notifications
notifications = get_user_notifications(user)
print(f"Total: {notifications.count()}")
print(f"Unread: {get_unread_count(user)}")
```

### Run Test Script
```bash
python manage.py shell < test_notifications.py
```

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Notifications not showing | Check user is logged in |
| Unread count wrong | Clear browser cache |
| AJAX not working | Check CSRF token |
| Admin notifications not resolving | Use service layer functions |

## 📱 Frontend Integration

### AJAX Mark as Read
```javascript
function markAsRead(notificationId) {
    fetch(`/notifications/${notificationId}/read/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}
```

### Auto-refresh Unread Count
```javascript
setInterval(() => {
    fetch('/notifications/unread-count/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('badge').textContent = data.count;
        });
}, 30000); // Every 30 seconds
```

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `users/models.py` | UserNotification model |
| `users/notification_service.py` | Helper functions |
| `users/views.py` | Notification views |
| `users/admin.py` | Admin configuration |
| `core/urls.py` | URL routing |
| `templates/users/notifications.html` | UI template |
| `transactions/services.py` | Transaction integration |
| `investments/services.py` | Investment integration |

## 📖 Full Documentation

For complete documentation, see:
- `NOTIFICATIONS_IMPLEMENTATION.md` - Full system documentation
- `NOTIFICATION_SYSTEM_READY.md` - Status and quick start
- `test_notifications.py` - Test script examples

---

**✅ Server Running:** http://127.0.0.1:8000/
**✅ Notifications:** http://127.0.0.1:8000/notifications/

*Quick Reference - October 3, 2025*
