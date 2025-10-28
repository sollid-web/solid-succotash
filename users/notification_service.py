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
    if EMAIL_SENDER_POOL:
        # simple rotation: use first sender for now. Replace with round-robin if needed.
        return EMAIL_SENDER_POOL[0]
    return DEFAULT_FROM_EMAIL

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
    except Exception:
        html_message = ""
    try:
        text_message = render_to_string(f"email/{template_name}.txt", {"user": user, **context})
    except Exception:
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

def create_user_notification(user, notification_type, title, message, priority="low", action_url=None, expires_in_days=None, send_email=True, template_name=None):
    """
    Create a DB notification and optionally send an email.
    - notification_type: used for categorization and selecting a template (convention: template name == notification_type)
    - template_name: optional override for email template filename
    """
    notif = UserNotification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        priority=priority,
        action_url=action_url,
    )

    if send_email:
        template = template_name or notification_type or "generic"
        context = {
            "message": message,
            "title": title,
            "action_url": action_url,
            "notification": notif,
        }
        try:
            # If Celery is used in production, replace this with a Celery task invocation
            _send_email_in_background(user, title, template, context)
        except Exception:
            # fallback to sync send
            send_email_notification(user, title, template, context)

    return notif

def notify_welcome(user, send_email=True):
    title = "Welcome to WolvCapital"
    message = f"Hello {user.get_full_name() or user.email}, welcome to WolvCapital!"
    return create_user_notification(user, "welcome", title, message, priority="low", action_url=reverse("dashboard"), send_email=send_email)

def notify_wallet_credited(user, amount, reason=None, send_email=True):
    title = f"Wallet credited: ${amount:.2f}"
    reason_text = f" Reason: {reason}" if reason else ""
    message = f"Your wallet was credited with ${amount:.2f}.{reason_text}"
    return create_user_notification(user, "wallet_credited", title, message, priority="low", action_url=reverse("wallet"), send_email=send_email)

# If your repo already has other helper functions (get_user_notifications, get_unread_count, mark_notification_read),
# ensure they're preserved or merged with the above implementation.