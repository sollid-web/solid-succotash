# core/services/email_service.py
from __future__ import annotations

import logging
import re
from decimal import Decimal
from typing import Any

from collections.abc import Sequence
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)
# runtime reference to the actual User model class (use a different name so mypy does not confuse the runtime variable with a type name)
UserModel: Any = get_user_model()


class EmailService:
    """
    Centralized email service for WolvCapital platform.
    Handles templated HTML/text emails and user preference checks.
    """

    DEFAULT_FROM_EMAIL = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@wolvcapital.com")
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
        """Send HTML + text email using templates."""
        if isinstance(to_emails, str):
            recipients: list[str] = [to_emails]
        else:
            recipients = list(to_emails)

        if not recipients:
            logger.warning("No recipients provided for email %s", template_name)
            return False

        if from_email is None:
            from_email = cls.DEFAULT_FROM_EMAIL

        # Respect user preferences
        if user and email_type and not cls._should_send_email(user, email_type):
            logger.info(
                "Email %s skipped for user %s due to preferences",
                email_type,
                getattr(user, "email", None),
            )
            return True  # not failure

        try:
            full_context = {
                **context,
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

            html_template = f"emails/{template_name}.html"
            html_content = render_to_string(html_template, full_context)

            text_template = f"emails/{template_name}.txt"
            try:
                text_content = render_to_string(text_template, full_context)
            except Exception:
                text_content = cls._html_to_text(html_content)

            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipients,
            )
            msg.attach_alternative(html_content, "text/html")

            sent = msg.send(fail_silently=False)
            return sent > 0

        except Exception as exc:
            logger.exception("Error sending email %s -> %s: %s", email_type, recipients, exc)
            return False

    @classmethod
    def _should_send_email(cls, user: Any, email_type: str) -> bool:
        """Check user notification preferences."""
        if hasattr(user, "profile") and hasattr(user.profile, "email_preferences"):
            return user.profile.email_preferences.get(email_type, True)
        return True

    @classmethod
    def _html_to_text(cls, html_content: str) -> str:
        text = re.sub(r"<[^>]+>", "", html_content)
        return re.sub(r"\s+", " ", text).strip()
    @classmethod
    def send_welcome_email(cls, user: Any) -> bool:
        context = {
            "user": user,
            "dashboard_url": "/dashboard/",
            "plans_url": "/plans/",
        }
        return cls.send_templated_email(
            "welcome",
            to_emails=getattr(user, "email", ""),
            context=context,
            subject=f"Welcome to {cls.BRAND_NAME}!",
            email_type=cls.EMAIL_TYPES["WELCOME"],
            user=user,
        )

    @classmethod
    def send_transaction_notification(cls, transaction: Any, status: str, admin_notes: str = "") -> bool:
        user = getattr(transaction, "user", None)

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

        context = {
            "user": user,
            "transaction": transaction,
            "admin_notes": admin_notes,
            "dashboard_url": "/dashboard/",
        }
        return cls.send_templated_email(
            template,
            to_emails=getattr(user, "email", ""),
            context=context,
            subject=subject,
            email_type=email_type,
            user=user,
        )

    @classmethod
    def send_investment_notification(cls, investment: Any, status: str, admin_notes: str = "") -> bool:
        user = getattr(investment, "user", None)

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

        context = {
            "user": user,
            "investment": investment,
            "admin_notes": admin_notes,
            "dashboard_url": "/dashboard/",
        }
        return cls.send_templated_email(
            template,
            to_emails=getattr(user, "email", ""),
            context=context,
            subject=subject,
            email_type=email_type,
            user=user,
        )

    @classmethod
    def send_roi_payout_notification(cls, user: Any, amount: Decimal, investment: Any, payout_date) -> bool:
        context = {
            "user": user,
            "amount": amount,
            "investment": investment,
            "payout_date": payout_date,
            "dashboard_url": "/dashboard/",
        }
        return cls.send_templated_email(
            "roi_payout",
            to_emails=getattr(user, "email", ""),
            context=context,
            subject=f"ROI Payout Credited - {cls.BRAND_NAME}",
            email_type=cls.EMAIL_TYPES["ROI_PAYOUT"],
            user=user,
        )
