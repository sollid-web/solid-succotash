import threading
import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse

from .models import UserNotification

logger = logging.getLogger(__name__)

DEFAULT_FROM_EMAIL = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@wolvcapital.com")
EMAIL_SENDER_POOL = None
if _raw_pool := getattr(settings, "EMAIL_SENDER_POOL", None):
    # support comma-separated env var
    EMAIL_SENDER_POOL = [s.strip() for s in _raw_pool.split(",") if s.strip()]

def _choose_from_email(preferred=None):
    if preferred:
        return preferred
    return EMAIL_SENDER_POOL[0] if EMAIL_SENDER_POOL else DEFAULT_FROM_EMAIL

def send_email_notification(user, subject, template_name, context=None, from_email=None, to_email=None, fail_silently=False):
    """
    Send an email to the user. Renders HTML and text versions from templates:
      - users/templates/email/<template_name>.html
      - users/templates/email/<template_name>.txt

    Uses Django's configured EMAIL_BACKEND. Returns True if send succeeded, False otherwise.
    For production, convert this to a Celery task for retries and reliability.
    """
    if not context:
        context = {}

    to = to_email or ([user.email] if getattr(user, "email", None) else [])
    if not to:
        logger.debug("No recipient email for user %s; skipping email send", getattr(user, "id", None))
        return False

    from_addr = _choose_from_email(from_email)

    try:
        html_message = render_to_string(f"email/{template_name}.html", {"user": user, **context})
    except Exception as exc:
        logger.exception("Failed to render HTML email template 'email/%s.html' for user %s: %s", template_name, getattr(user, "id", None), exc)
        html_message = ""
    try:
        text_message = render_to_string(f"email/{template_name}.txt", {"user": user, **context})
    except Exception as exc:
        logger.exception("Failed to render text email template 'email/%s.txt' for user %s: %s", template_name, getattr(user, "id", None), exc)
        # fallback to strip HTML if text template missing
        text_message = strip_tags(html_message) if html_message else ""

    msg = EmailMultiAlternatives(subject=subject, body=text_message or subject, from_email=from_addr, to=to)
    if html_message:
        msg.attach_alternative(html_message, "text/html")

    try:
        # explicit connection so provider-specific settings take effect
        with get_connection() as connection:
            msg.connection = connection
            msg.send(fail_silently=fail_silently)
        logger.info("Email sent to %s subject=%s", to, subject)
        return True
    except Exception as exc:
        logger.exception("Failed to send email to %s subject=%s: %s", to, subject, exc)
        return False

def _send_email_in_background(*args, **kwargs):
    t = threading.Thread(target=send_email_notification, args=args, kwargs=kwargs, daemon=True)
    t.start()
    return t

def create_user_notification(user, notification_type, title, message, priority="medium", action_url=None, entity_type=None, entity_id=None, expires_in_days=None, send_email=True, template_name=None):
    """
    Create a DB notification and optionally send an email.
    - notification_type: used for categorization and selecting a template (convention: template name == notification_type)
    - entity_type: optional entity type for tracking (e.g., 'transaction', 'investment')
    - entity_id: optional entity ID for tracking
    - expires_in_days: optional number of days until notification expires
    - template_name: optional override for email template filename
    """
    from datetime import timedelta
    from django.utils import timezone
    
    expires_at = None
    if expires_in_days:
        expires_at = timezone.now() + timedelta(days=expires_in_days)
    
    notif = UserNotification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        priority=priority,
        action_url=action_url,
        entity_type=entity_type or "",
        entity_id=entity_id or "",
        expires_at=expires_at,
    )

    if send_email:
        template = template_name or notification_type or "generic"
        context = {
            "message": message,
            "title": title,
            "action_url": action_url,
            "notification": notif,
        }
        # If Celery is used in production, replace this with a Celery task invocation
        _send_email_in_background(user, title, template, context)

    return notif

def notify_welcome(user, send_email=True):
    title = "Welcome to WolvCapital"
    message = f"Hello {user.get_full_name() or user.email}, welcome to WolvCapital!"
    action_url = reverse("dashboard")
    return create_user_notification(user, "welcome", title, message, priority="low", action_url=action_url, send_email=send_email)

def notify_wallet_credited(user, amount, reason="", send_email=True):
    title = f"Wallet credited: ${amount:.2f}"
    reason_text = f" Reason: {reason}" if reason else ""
    message = f"Your wallet was credited with ${amount:.2f}.{reason_text}"
    return create_user_notification(user, "wallet_credited", title, message, priority="low", action_url=reverse("dashboard"), send_email=send_email)

def notify_wallet_debited(user, amount, reason="", send_email=True):
    """Notify user when their wallet is debited."""
    title = f"Wallet debited: ${amount:.2f}"
    reason_text = f" Reason: {reason}" if reason else ""
    message = f"Your wallet was debited ${amount:.2f}.{reason_text}"
    return create_user_notification(user, "wallet_debited", title, message, priority="low", action_url=reverse("dashboard"), send_email=send_email)

def notify_deposit_approved(user, transaction, notes="", send_email=True):
    """Notify user when their deposit is approved."""
    title = f"Deposit Approved: ${transaction.amount:.2f}"
    message = f"Your deposit of ${transaction.amount:.2f} has been approved and credited to your wallet."
    if notes:
        message += f" Admin notes: {notes}"
    return create_user_notification(
        user, "deposit_approved", title, message, 
        priority="medium", action_url=reverse("dashboard"), 
        entity_type="transaction", entity_id=str(transaction.id),
        send_email=send_email
    )

def notify_deposit_rejected(user, transaction, notes="", send_email=True):
    """Notify user when their deposit is rejected."""
    title = f"Deposit Rejected: ${transaction.amount:.2f}"
    message = f"Your deposit of ${transaction.amount:.2f} has been rejected."
    if notes:
        message += f" Reason: {notes}"
    return create_user_notification(
        user, "deposit_rejected", title, message, 
        priority="high", action_url=reverse("dashboard"), 
        entity_type="transaction", entity_id=str(transaction.id),
        send_email=send_email
    )

def notify_withdrawal_approved(user, transaction, notes="", send_email=True):
    """Notify user when their withdrawal is approved."""
    title = f"Withdrawal Approved: ${transaction.amount:.2f}"
    message = f"Your withdrawal of ${transaction.amount:.2f} has been approved and will be processed shortly."
    if notes:
        message += f" Admin notes: {notes}"
    return create_user_notification(
        user, "withdrawal_approved", title, message, 
        priority="medium", action_url=reverse("dashboard"), 
        entity_type="transaction", entity_id=str(transaction.id),
        send_email=send_email
    )

def notify_withdrawal_rejected(user, transaction, notes="", send_email=True):
    """Notify user when their withdrawal is rejected."""
    title = f"Withdrawal Rejected: ${transaction.amount:.2f}"
    message = f"Your withdrawal request of ${transaction.amount:.2f} has been rejected."
    if notes:
        message += f" Reason: {notes}"
    return create_user_notification(
        user, "withdrawal_rejected", title, message, 
        priority="high", action_url=reverse("dashboard"), 
        entity_type="transaction", entity_id=str(transaction.id),
        send_email=send_email
    )

def notify_investment_approved(user, investment, notes="", send_email=True):
    """Notify user when their investment is approved."""
    title = f"Investment Approved: ${investment.amount:.2f}"
    message = f"Your investment of ${investment.amount:.2f} in {investment.plan.name} has been approved and is now active."
    if notes:
        message += f" Admin notes: {notes}"
    return create_user_notification(
        user, "investment_approved", title, message, 
        priority="medium", action_url=reverse("dashboard"), 
        entity_type="investment", entity_id=str(investment.id),
        send_email=send_email
    )

def notify_investment_rejected(user, investment, notes="", send_email=True):
    """Notify user when their investment is rejected."""
    title = f"Investment Rejected: ${investment.amount:.2f}"
    message = f"Your investment request of ${investment.amount:.2f} in {investment.plan.name} has been rejected."
    if notes:
        message += f" Reason: {notes}"
    return create_user_notification(
        user, "investment_rejected", title, message, 
        priority="high", action_url=reverse("dashboard"), 
        entity_type="investment", entity_id=str(investment.id),
        send_email=send_email
    )

def notify_investment_completed(user, investment, send_email=True):
    """Notify user when their investment term is completed."""
    title = f"Investment Completed: ${investment.amount:.2f}"
    message = f"Your investment of ${investment.amount:.2f} in {investment.plan.name} has completed its term. Total return: ${investment.total_return:.2f}"
    return create_user_notification(
        user, "investment_completed", title, message, 
        priority="medium", action_url=reverse("dashboard"), 
        entity_type="investment", entity_id=str(investment.id),
        send_email=send_email
    )

def notify_roi_payout(user, amount, investment, send_email=True):
    """Notify user when they receive an ROI payout."""
    title = f"ROI Payout: ${amount:.2f}"
    message = f"You received a daily ROI payout of ${amount:.2f} from your {investment.plan.name} investment."
    return create_user_notification(
        user, "roi_payout", title, message, 
        priority="low", action_url=reverse("dashboard"), 
        entity_type="investment", entity_id=str(investment.id),
        send_email=send_email
    )

# Utility functions for managing notifications

def get_user_notifications(user, limit=None, unread_only=False):
    """Get notifications for a user, optionally filtered by unread status."""
    qs = UserNotification.objects.filter(user=user).order_by('-created_at')
    if unread_only:
        qs = qs.filter(is_read=False)
    if limit:
        qs = qs[:limit]
    return qs

def get_unread_count(user):
    """Get count of unread notifications for a user."""
    return UserNotification.objects.filter(user=user, is_read=False).count()

def mark_notification_read(notification_id, user):
    """Mark a specific notification as read."""
    try:
        notif = UserNotification.objects.get(id=notification_id, user=user)
        notif.mark_as_read()
        return True
    except UserNotification.DoesNotExist:
        return False

def mark_all_read(user):
    """Mark all notifications as read for a user."""
    from django.utils import timezone
    count = UserNotification.objects.filter(user=user, is_read=False).update(
        is_read=True, 
        read_at=timezone.now()
    )
    return count

def delete_expired_notifications():
    """Delete all expired notifications. Should be run as a periodic task."""
    from django.utils import timezone
    count, _ = UserNotification.objects.filter(
        expires_at__isnull=False,
        expires_at__lt=timezone.now()
    ).delete()
    return count

# If your repo already has other helper functions (get_user_notifications, get_unread_count, mark_notification_read),
# ensure they're preserved or merged with the above implementation.