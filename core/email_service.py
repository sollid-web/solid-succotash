"""
WolvCapital Email Service
Centralized email sending functionality with templates for all notifications
"""
from __future__ import annotations

import logging
from collections.abc import Sequence
from decimal import Decimal
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()


class EmailService:
    """
    Centralized email service for WolvCapital platform
    Handles all email sending with HTML/text templates
    """
    DEFAULT_FROM_EMAIL = getattr(
        settings,
        "DEFAULT_FROM_EMAIL",
        "noreply@wolvcapital.com",
    )
    BRAND_NAME = getattr(settings, "BRAND", {}).get("name", "WolvCapital")
    EMAIL_TYPES = {
        "WELCOME": "welcome",
        "TRANSACTION_CREATED": "transaction_created",
        "TRANSACTION_APPROVED": "transaction_approved",
        "TRANSACTION_REJECTED": "transaction_rejected",
        "INVESTMENT_CREATED": "investment_created",
        "INVESTMENT_APPROVED": "investment_approved",
        "INVESTMENT_REJECTED": "investment_rejected",
        "INVESTMENT_COMPLETED": "investment_completed",
        "ROI_PAYOUT": "roi_payout",
        "WALLET_CREDITED": "wallet_credited",
        "WALLET_DEBITED": "wallet_debited",
        "CARD_APPROVED": "card_approved",
        "CARD_REJECTED": "card_rejected",
        "PASSWORD_RESET": "password_reset",
        "SECURITY_ALERT": "security_alert",
        "ADMIN_ALERT": "admin_alert",
        "SYSTEM_MAINTENANCE": "system_maintenance",
    }

    @classmethod
    def send_templated_email(
        cls,
        template_name: str,
        to_emails: str | Sequence[str],
        context: dict,
        subject: str,
        from_email: str | None = None,
        email_type: str | None = None,
        user: Any = None,
    ) -> bool:
        """Send an email using HTML and text templates.

        Args:
            template_name: Base template name under templates/emails/.
            to_emails: Single email or iterable of emails.
            context: Template context (copied to avoid mutation).
        """
        if isinstance(to_emails, str):
            recipients: list[str] = [to_emails]
        else:
            recipients = list(to_emails)

        if not recipients:
            logger.warning("No recipients provided for email %s", template_name)
            return False

        if from_email is None:
            from_email = cls.DEFAULT_FROM_EMAIL

        # Respect user preferences if provided
        if user and email_type and not cls._should_send_email(user, email_type):
            logger.info(
                "Email %s skipped for user %s due to preferences",
                email_type,
                getattr(user, "email", None),
            )
            return True  # not an error: user opted out

        try:
            # Build a new context to avoid mutating caller's dict
            full_context = {**context}
            full_context.update(
                {
                    "brand_name": cls.BRAND_NAME,
                    "current_year": timezone.now().year,
                    "brand_config": getattr(settings, "BRAND", {}),
                    "site_url": getattr(
                        settings,
                        "PUBLIC_SITE_URL",
                        getattr(settings, "SITE_URL", "https://wolvcapital.com"),
                    ),
                    "admin_site_url": getattr(
                        settings,
                        "ADMIN_SITE_URL",
                        getattr(settings, "SITE_URL", "https://wolvcapital.com"),
                    ),
                }
            )

            # Render templates
            html_template = f"emails/{template_name}.html"
            html_content: str = render_to_string(html_template, full_context)

            text_template = f"emails/{template_name}.txt"
            try:
                text_content: str = render_to_string(text_template, full_context)
            except Exception:
                text_content = cls._html_to_text(html_content)

            # Prepare and send message
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipients,
                reply_to=["support@wolvcapital.com"],
            )
            msg.attach_alternative(html_content, "text/html")

            # Add headers to improve deliverability
            is_urgent = email_type in [
                'SECURITY_ALERT',
                'ADMIN_ALERT',
            ]
            site_url = full_context.get(
                "site_url",
                "https://wolvcapital.com",
            )
            msg.extra_headers = {
                'X-Mailer': 'WolvCapital Email System',
                'X-Priority': '1' if is_urgent else '3',
                'Importance': 'High' if is_urgent else 'Normal',
                'List-Unsubscribe': f'<{site_url}/accounts/settings/>',
            }

            sent_count = msg.send(fail_silently=False)

            if sent_count and sent_count > 0:
                logger.info("Email sent: %s -> %s", email_type, recipients)
                return True

            logger.error(
                "Email not sent (0 recipients): %s -> %s",
                email_type,
                recipients,
            )
            return False

        except Exception as exc:  # pragma: no cover - integration behavior
            # Avoid logging sensitive payload; log the error and metadata only
            logger.exception(
                "Error sending email %s to %s: %s",
                email_type,
                recipients,
                exc,
            )
            return False

    @classmethod
    def _should_send_email(cls, user, email_type: str) -> bool:
        """
        Placeholder for checking user preferences.
        Implement lookup against a profile or preferences table.
        """
        if hasattr(user, "profile") and hasattr(user.profile, "email_preferences"):
            preferences = user.profile.email_preferences
            return preferences.get(email_type, True)
        return True

    @classmethod
    def _html_to_text(cls, html_content: str) -> str:
        import re

        text = re.sub(r"<[^>]+>", "", html_content)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    # Convenience wrappers
    @classmethod
    def send_welcome_email(cls, user) -> bool:
        context = {"user": user, "dashboard_url": "/dashboard/", "plans_url": "/plans/"}
        return cls.send_templated_email(
            template_name="welcome",
            to_emails=getattr(user, "email", ""),
            context=context,
            subject=f"Welcome to {cls.BRAND_NAME}!",
            email_type=cls.EMAIL_TYPES["WELCOME"],
            user=user,
        )

    @classmethod
    def send_transaction_notification(cls, transaction: Any, status: str, admin_notes: str = "") -> bool:
        user = transaction.user
        if status == "created":
            template = "transaction_created"
            subject = f"Transaction Submitted - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["TRANSACTION_CREATED"]
        elif status == "approved":
            template = "transaction_approved"
            subject = f"Transaction Approved - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["TRANSACTION_APPROVED"]
        elif status == "rejected":
            template = "transaction_rejected"
            subject = f"Transaction Rejected - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["TRANSACTION_REJECTED"]
        else:
            logger.warning("Unknown transaction status: %s", status)
            return False
        context = {"user": user, "transaction": transaction, "admin_notes": admin_notes, "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name=template, to_emails=getattr(user, "email", ""), context=context, subject=subject, email_type=email_type, user=user)















    @classmethod
    def send_investment_notification(cls, investment, status: str, admin_notes: str = "") -> bool:
        user = investment.user
        if status == "created":
            template = "investment_created"
            subject = f"Investment Submitted - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["INVESTMENT_CREATED"]
        elif status == "approved":
            template = "investment_approved"
            subject = f"Investment Approved - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["INVESTMENT_APPROVED"]
        elif status == "rejected":
            template = "investment_rejected"
            subject = f"Investment Rejected - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["INVESTMENT_REJECTED"]
        elif status == "completed":
            template = "investment_completed"
            subject = f"Investment Completed - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["INVESTMENT_COMPLETED"]
        else:
            logger.warning("Unknown investment status: %s", status)
            return False

        context = {"user": user, "investment": investment, "admin_notes": admin_notes, "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name=template, to_emails=getattr(user, "email", ""), context=context, subject=subject, email_type=email_type, user=user)

    @classmethod
    def send_roi_payout_notification(cls, user, amount: Decimal, investment, payout_date) -> bool:
        context = {"user": user, "amount": amount, "investment": investment, "payout_date": payout_date, "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name="roi_payout", to_emails=getattr(user, "email", ""), context=context, subject=f"ROI Payout Received - {cls.BRAND_NAME}", email_type=cls.EMAIL_TYPES["ROI_PAYOUT"], user=user)

    @classmethod
    def send_wallet_notification(cls, user, amount: Decimal, action: str, reason: str = "") -> bool:
        if action == "credited":
            template = "wallet_credited"
            subject = f"Wallet Credited - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["WALLET_CREDITED"]
        elif action == "debited":
            template = "wallet_debited"
            subject = f"Wallet Debited - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["WALLET_DEBITED"]
        else:
            logger.warning("Unknown wallet action: %s", action)
            return False

        context = {"user": user, "amount": amount, "reason": reason, "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name=template, to_emails=getattr(user, "email", ""), context=context, subject=subject, email_type=email_type, user=user)

    @classmethod
    def send_virtual_card_notification(cls, user, card, status: str, admin_notes: str = "") -> bool:
        if status == "approved":
            template = "card_approved"
            subject = f"Virtual Card Approved - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["CARD_APPROVED"]
        elif status == "rejected":
            template = "card_rejected"
            subject = f"Virtual Card Rejected - {cls.BRAND_NAME}"
            email_type = cls.EMAIL_TYPES["CARD_REJECTED"]
        else:
            logger.warning("Unknown card status: %s", status)
            return False

        context = {"user": user, "card": card, "admin_notes": admin_notes, "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name=template, to_emails=getattr(user, "email", ""), context=context, subject=subject, email_type=email_type, user=user)

    @classmethod
    def send_security_alert(cls, user, alert_type: str, details: str) -> bool:
        context = {"user": user, "alert_type": alert_type, "details": details, "timestamp": timezone.now(), "dashboard_url": "/dashboard/"}
        return cls.send_templated_email(template_name="security_alert", to_emails=getattr(user, "email", ""), context=context, subject=f"Security Alert - {cls.BRAND_NAME}", email_type=cls.EMAIL_TYPES["SECURITY_ALERT"], user=user)

    @classmethod
    def send_admin_alert(cls, subject: str, message: str, admin_emails: Sequence[str] | None = None) -> bool:
        if admin_emails is None:
            admin_users = User.objects.filter(is_staff=True, is_active=True)
            admin_emails = [getattr(u, "email", "") for u in admin_users if getattr(u, "email", "")]

        if not admin_emails:
            logger.warning("No admin emails found for alert")
            return False

        context = {"message": message, "timestamp": timezone.now(), "admin_url": "/admin/", "admin_site_url": getattr(settings, "ADMIN_SITE_URL", getattr(settings, "SITE_URL", "https://wolvcapital.com"))}
        return cls.send_templated_email(template_name="admin_alert", to_emails=admin_emails, context=context, subject=f"[ADMIN ALERT] {subject} - {cls.BRAND_NAME}", email_type=cls.EMAIL_TYPES["ADMIN_ALERT"])

    @classmethod
    def send_test_email(cls, to_email: str) -> bool:
        context = {"test_timestamp": timezone.now()}
        return cls.send_templated_email(template_name="test_email", to_emails=to_email, context=context, subject=f"Test Email - {cls.BRAND_NAME}", email_type="test")


def send_email(template_name: str, to_emails: str | Sequence[str], context: dict, subject: str, **kwargs) -> bool:
    return EmailService.send_templated_email(template_name=template_name, to_emails=to_emails, context=context, subject=subject, **kwargs)
