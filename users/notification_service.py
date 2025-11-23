"""
User Notification Service
Handles creating and managing notifications for regular users
"""

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone

from .models import UserNotification

User = get_user_model()


def create_user_notification(
    user,
    notification_type,
    title,
    message,
    priority="medium",
    action_url="",
    entity_type="",
    entity_id=None,
    expires_in_days=30,
):
    """
    Create a notification for a regular user.

    Args:
        user: User instance to notify
        notification_type: Type from UserNotification.NOTIFICATION_TYPES
        title: Short notification title
        message: Detailed message
        priority: 'low', 'medium', or 'high'
        action_url: Optional URL for user to take action
        entity_type: Optional entity type ('transaction', 'investment', etc.)
        entity_id: Optional entity ID
        expires_in_days: Number of days until notification auto-expires

    Returns:
        UserNotification instance
    """
    expires_at = timezone.now() + timedelta(days=expires_in_days) if expires_in_days else None

    notification = UserNotification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        priority=priority,
        action_url=action_url,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else "",
        expires_at=expires_at,
    )

    return notification


def get_user_notifications(user, unread_only=False, limit=None):
    """
    Get notifications for a specific user.

    Args:
        user: User instance
        unread_only: If True, only return unread notifications
        limit: Optional limit on number of notifications

    Returns:
        QuerySet of UserNotification objects
    """
    notifications = UserNotification.objects.filter(user=user)

    if unread_only:
        notifications = notifications.filter(is_read=False)

    if limit:
        notifications = notifications[:limit]

    return notifications


def get_unread_count(user):
    """Get count of unread notifications for a user."""
    return UserNotification.objects.filter(user=user, is_read=False).count()


def mark_notification_read(notification_id, user):
    """Mark a specific notification as read."""
    try:
        notification = UserNotification.objects.get(id=notification_id, user=user)
        notification.mark_as_read()
        return notification
    except UserNotification.DoesNotExist:
        return None


def mark_all_read(user):
    """Mark all notifications as read for a user."""
    count = UserNotification.objects.filter(user=user, is_read=False).update(
        is_read=True, read_at=timezone.now()
    )
    return count


def delete_expired_notifications():
    """Delete all expired notifications (cleanup task)."""
    count = UserNotification.objects.filter(expires_at__lt=timezone.now()).delete()[0]
    return count


# Specific notification creators for common events


def notify_deposit_approved(user, transaction, admin_notes=""):
    """Notify user that their deposit was approved."""
    message = f"Your deposit of ${transaction.amount} via {transaction.get_payment_method_display()} has been approved and credited to your wallet."
    if admin_notes:
        message += f"\n\nAdmin notes: {admin_notes}"

    return create_user_notification(
        user=user,
        notification_type="deposit_approved",
        title="Deposit Approved",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="transaction",
        entity_id=transaction.id,
    )


def notify_deposit_rejected(user, transaction, reason=""):
    """Notify user that their deposit was rejected."""
    message = f"Your deposit request of ${transaction.amount} has been rejected."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="deposit_rejected",
        title="Deposit Rejected",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="transaction",
        entity_id=transaction.id,
    )


def notify_withdrawal_approved(user, transaction, admin_notes=""):
    """Notify user that their withdrawal was approved."""
    message = f"Your withdrawal request of ${transaction.amount} has been approved and processed."
    if admin_notes:
        message += f"\n\nAdmin notes: {admin_notes}"

    return create_user_notification(
        user=user,
        notification_type="withdrawal_approved",
        title="Withdrawal Approved",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="transaction",
        entity_id=transaction.id,
    )


def notify_withdrawal_rejected(user, transaction, reason=""):
    """Notify user that their withdrawal was rejected."""
    message = f"Your withdrawal request of ${transaction.amount} has been rejected."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="withdrawal_rejected",
        title="Withdrawal Rejected",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="transaction",
        entity_id=transaction.id,
    )


def notify_investment_approved(user, investment, admin_notes=""):
    """Notify user that their investment was approved."""
    message = f"Your investment of ${investment.amount} in the {investment.plan.name} plan has been approved and activated."
    if admin_notes:
        message += f"\n\nAdmin notes: {admin_notes}"

    return create_user_notification(
        user=user,
        notification_type="investment_approved",
        title="Investment Approved",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="investment",
        entity_id=investment.id,
    )


def notify_investment_rejected(user, investment, reason=""):
    """Notify user that their investment was rejected."""
    message = f"Your investment request of ${investment.amount} for the {investment.plan.name} plan has been rejected."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="investment_rejected",
        title="Investment Rejected",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="investment",
        entity_id=investment.id,
    )


def notify_investment_completed(user, investment):
    """Notify user that their investment has completed."""
    message = f"Your investment in the {investment.plan.name} plan has completed! Total returns: ${investment.total_return}."

    return create_user_notification(
        user=user,
        notification_type="investment_completed",
        title="Investment Completed",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="investment",
        entity_id=investment.id,
    )


def notify_welcome(user):
    """Send welcome notification to new user."""
    message = "Welcome to WolvCapital! Your account has been successfully created. Start exploring our investment plans and begin your journey to financial growth."

    return create_user_notification(
        user=user,
        notification_type="welcome",
        title="Welcome to WolvCapital!",
        message=message,
        priority="medium",
        action_url="/plans/",
        expires_in_days=7,
    )


def notify_wallet_credited(user, amount, reason=""):
    """Notify user that their wallet was credited."""
    message = f"Your wallet has been credited with ${amount}."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="wallet_credited",
        title="Wallet Credited",
        message=message,
        priority="medium",
        action_url="/dashboard/",
    )


def notify_wallet_debited(user, amount, reason=""):
    """Notify user that their wallet was debited."""
    message = f"${amount} has been deducted from your wallet."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="wallet_debited",
        title="Wallet Debited",
        message=message,
        priority="medium",
        action_url="/dashboard/",
    )


def notify_card_approved(user, card, admin_notes=""):
    """Notify user that their virtual card was approved."""
    message = f"Your virtual card request has been approved! Card details are now available in your dashboard."
    if admin_notes:
        message += f"\n\nAdmin notes: {admin_notes}"

    return create_user_notification(
        user=user,
        notification_type="card_approved",
        title="Virtual Card Approved",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="virtual_card",
        entity_id=card.id,
    )


def notify_card_rejected(user, card, reason=""):
    """Notify user that their virtual card was rejected."""
    message = f"Your virtual card request has been rejected."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="card_rejected",
        title="Virtual Card Rejected",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="virtual_card",
        entity_id=card.id,
    )


def notify_kyc_submitted(user, application, stage_label="application"):
    """Notify user that their KYC submission is pending review."""
    message = (
        f"Your KYC {stage_label} has been received and is pending manual review. "
        "Our compliance team will update you once verification is complete."
    )

    return create_user_notification(
        user=user,
        notification_type="kyc_submitted",
        title="KYC Submitted",
        message=message,
        priority="medium",
        action_url="/dashboard/kyc",
        entity_type="kyc",
        entity_id=application.id,
    )


def notify_kyc_approved(user, application, notes=""):
    """Notify user that their KYC was approved."""
    message = "Your KYC verification has been approved. You now have full account access."
    if notes:
        message += f"\n\nNotes: {notes}"

    return create_user_notification(
        user=user,
        notification_type="kyc_approved",
        title="KYC Approved",
        message=message,
        priority="high",
        action_url="/dashboard/",
        entity_type="kyc",
        entity_id=application.id,
    )


def notify_kyc_rejected(user, application, reason=""):
    """Notify user that their KYC was rejected."""
    message = "Your KYC verification was rejected. Please review the notes and resubmit."
    if reason:
        message += f"\n\nReason: {reason}"

    return create_user_notification(
        user=user,
        notification_type="kyc_rejected",
        title="KYC Rejected",
        message=message,
        priority="high",
        action_url="/dashboard/kyc",
        entity_type="kyc",
        entity_id=application.id,
    )
