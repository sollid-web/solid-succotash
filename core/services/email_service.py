"""Centralized email sending for WolvCapital."""

from __future__ import annotations

import logging
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)
UserModel: Any = get_user_model()


class EmailService:
    """High-level email helper for system, transaction and investment emails."""

    BRAND_NAME: str = getattr(settings, "BRAND_NAME", "WolvCapital")
    DEFAULT_FROM_EMAIL: str = getattr(
        settings, "DEFAULT_FROM_EMAIL", "support@mail.wolvcapital.com"
    )

    EMAIL_TYPES = {
        "SYSTEM": "system",
        "WELCOME": "welcome",
        "TRANSACTION_CREATED": "transaction_created",
        "TRANSACTION_APPROVED": "transaction_approved",
        "TRANSACTION_REJECTED": "transaction_rejected",
        "INVESTMENT_CREATED": "investment_created",
        "INVESTMENT_APPROVED": "investment_approved",
        "INVESTMENT_REJECTED": "investment_rejected",
        "INVESTMENT_COMPLETED": "investment_completed",
        "TEST": "test",
    }

    @classmethod
    def _send(
        cls,
        template_name: str,
        to_emails: str | list[str],
        context: dict[str, Any] | None = None,
        subject: str | None = None,
    ) -> bool:
        """Render templates and send a multi-part email (text + HTML)."""
        if isinstance(to_emails, str):
            recipients: list[str] = [to_emails]
        else:
            recipients = to_emails

        if not recipients:
            logger.warning("EmailService._send called with empty recipients list")
            return False

        ctx: dict[str, Any] = context.copy() if context else {}
        ctx.setdefault("brand_name", cls.BRAND_NAME)
        ctx.setdefault("support_email", getattr(settings, "SUPPORT_EMAIL", None))
        ctx.setdefault("current_timestamp", timezone.now())

        html_template = f"emails/{template_name}.html"
        text_template = f"emails/{template_name}.txt"

        try:
            html_content: str = render_to_string(html_template, ctx)
        except Exception as exc:
            logger.exception(
                "Failed to render HTML template emails/%s.html: %s",
                template_name,
                exc,
            )
            return False

        try:
            text_content: str = render_to_string(text_template, ctx)
        except Exception:
            # text version is optional; fall back to HTML-only if missing
            logger.info("Text template emails/%s.txt not found or failed to render", template_name)
            text_content = ""

        if subject is None:
            subject = f"{cls.BRAND_NAME} notification"

        message = EmailMultiAlternatives(
            subject=subject,
            body=text_content or html_content,
            from_email=cls.DEFAULT_FROM_EMAIL,
            to=recipients,
        )
        message.attach_alternative(html_content, "text/html")

        try:
            sent = message.send(fail_silently=False)
            logger.info(
                "Email %r sent to %s using template %r (result=%s)",
                subject,
                recipients,
                template_name,
                sent,
            )
            return bool(sent)
        except Exception as exc:
            logger.exception(
                "Failed to send email %r to %s using template %r: %s",
                subject,
                recipients,
                template_name,
                exc,
            )
            return False

    # --- Public helpers -------------------------------------------------

    @classmethod
    def send_test_email(cls, to_email: str) -> bool:
        """Lightweight connectivity test."""
        context = {
            "test_timestamp": timezone.now(),
            "brand_name": cls.BRAND_NAME,
        }
        subject = f"{cls.BRAND_NAME} test email"
        return cls._send("test", to_email, context=context, subject=subject)

    @classmethod
    def send_welcome_email(cls, user: Any) -> bool:
        context = {"user": user}
        subject = f"Welcome to {cls.BRAND_NAME}"
        return cls._send("welcome", getattr(user, "email", ""), context=context, subject=subject)

    @classmethod
    def send_transaction_notification(
        cls,
        transaction: Any,
        status: str,
        admin_notes: str | None = None,
    ) -> bool:
        """Notify user when a transaction is created / approved / rejected."""
        user = getattr(transaction, "user", None)
        status_normalized = (status or "").lower()

        if status_normalized == "created":
            template = "transaction_created"
            subject = f"Transaction submitted - {cls.BRAND_NAME}"
        elif status_normalized == "approved":
            template = "transaction_approved"
            subject = f"Transaction approved - {cls.BRAND_NAME}"
        elif status_normalized == "rejected":
            template = "transaction_rejected"
            subject = f"Transaction rejected - {cls.BRAND_NAME}"
        else:
            logger.warning("Unknown transaction status %r in send_transaction_notification", status)
            return False

        context = {
            "user": user,
            "transaction": transaction,
            "admin_notes": admin_notes,
            "dashboard_url": "/dashboard/",
        }
        return cls._send(template, getattr(user, "email", ""), context=context, subject=subject)

    @classmethod
    def send_investment_notification(
        cls,
        investment: Any,
        status: str,
        admin_notes: str | None = None,
    ) -> bool:
        """Notify user when an investment is created / approved / rejected / completed."""
        user = getattr(investment, "user", None)
        status_normalized = (status or "").lower()

        if status_normalized == "created":
            template = "investment_created"
            subject = f"Investment submitted - {cls.BRAND_NAME}"
        elif status_normalized == "approved":
            template = "investment_approved"
            subject = f"Investment approved - {cls.BRAND_NAME}"
        elif status_normalized == "rejected":
            template = "investment_rejected"
            subject = f"Investment rejected - {cls.BRAND_NAME}"
        elif status_normalized == "completed":
            template = "investment_completed"
            subject = f"Investment completed - {cls.BRAND_NAME}"
        else:
            logger.warning("Unknown investment status %r in send_investment_notification", status)
            return False

        context = {
            "user": user,
            "investment": investment,
            "admin_notes": admin_notes,
            "dashboard_url": "/dashboard/",
        }
        return cls._send(template, getattr(user, "email", ""), context=context, subject=subject)
