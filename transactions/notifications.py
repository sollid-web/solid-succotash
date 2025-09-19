from django.contrib.auth.models import User
from .models import AdminNotification


def create_admin_notification(
    notification_type,
    title,
    message,
    user=None,
    entity_type=None,
    entity_id=None,
    priority='medium'
):
    """
    Create an admin notification for actions that require admin attention.
    
    Args:
        notification_type: Type of notification (from AdminNotification.NOTIFICATION_TYPES)
        title: Short title for the notification
        message: Detailed message
        user: User who triggered the notification (optional)
        entity_type: Type of entity ('transaction', 'investment', 'virtual_card', etc.)
        entity_id: ID of the entity
        priority: Priority level ('low', 'medium', 'high', 'urgent')
    
    Returns:
        AdminNotification instance
    """
    notification = AdminNotification.objects.create(
        notification_type=notification_type,
        title=title,
        message=message,
        user=user,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else None,
        priority=priority
    )
    return notification


def get_unread_admin_notifications():
    """Get all unread admin notifications ordered by priority and creation time."""
    priority_order = {'urgent': 1, 'high': 2, 'medium': 3, 'low': 4}
    
    notifications = AdminNotification.objects.filter(
        is_read=False,
        is_resolved=False
    ).order_by('created_at')
    
    # Sort by priority manually
    sorted_notifications = sorted(
        notifications, 
        key=lambda x: (priority_order.get(x.priority, 5), x.created_at)
    )
    
    return sorted_notifications


def get_admin_notification_count():
    """Get count of unread admin notifications."""
    return AdminNotification.objects.filter(
        is_read=False,
        is_resolved=False
    ).count()


def mark_notification_as_resolved(notification_id, resolved_by=None):
    """Mark a notification as resolved."""
    try:
        notification = AdminNotification.objects.get(id=notification_id)
        notification.mark_as_resolved(resolved_by=resolved_by)
        return notification
    except AdminNotification.DoesNotExist:
        return None