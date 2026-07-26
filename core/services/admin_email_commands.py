from __future__ import annotations

from decimal import Decimal
from typing import Any

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone

from core.services.email_service import EmailService
from core.services.wolv_token_announcement import (
    get_wolv_token_recipient_count,
    get_wolv_token_recipients,
    send_wolv_token_announcement,
)
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction

User = get_user_model()


def get_active_user_emails() -> list[str]:
    return list(
        User.objects.filter(is_active=True)
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .values_list("email", flat=True)
    )


def get_active_user_count() -> int:
    return (
        User.objects.filter(is_active=True)
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .count()
    )


def send_validation_email(to_email: str, investor_name: str = "Investor") -> bool:
    from_header = f"{EmailService.BRAND_NAME} Support <{settings.DEFAULT_FROM_EMAIL}>"
    subject = "Reminder: Please Complete Your Account Validation"

    text_body = f"""Dear {investor_name},

I hope you are well.

This is a gentle reminder that your WolvCapital account restoration has been completed successfully.

To keep your account running smoothly and to ensure transactions process without interruption, please complete the final Account Validation step in your dashboard.

How to do it (securely):
1) Open your browser and type www.wolvcapital.com manually (avoid forwarded links).
2) Log in to your dashboard.
3) Complete the “Account Validation” step shown on your dashboard.

For your protection:
- We will never ask for your password, OTP, or private access details by email.
- Please complete all actions only inside your official dashboard.

Warm regards,
WolvCapital Support
support@mail.wolvcapital.com
"""

    html_body = f"""
    <div style=\"font-family:Arial,Helvetica,sans-serif;\">
      <p>Dear {investor_name},</p>
      <p>I hope you are well.</p>
      <p>This is a gentle reminder that your WolvCapital account restoration has been completed successfully.</p>
      <p>To keep your account running smoothly and to ensure transactions process without interruption, please complete the final <b>Account Validation</b> step in your dashboard.</p>
      <p><b>How to do it (securely):</b><br/>
      1) Open your browser and type <b>www.wolvcapital.com</b> manually (avoid forwarded links).<br/>
      2) Log in to your dashboard.<br/>
      3) Complete the <b>Account Validation</b> step shown on your dashboard.</p>
      <p><b>For your protection:</b><br/>
      • We will never ask for your password, OTP, or private access details by email.<br/>
      • Please complete all actions only inside your official dashboard.</p>
      <p style=\"margin-top:14px;\"><b>Warm regards,</b><br/>WolvCapital Support<br/><span style=\"color:#6b7280; font-size:12px;\">support@mail.wolvcapital.com</span></p>
    </div>
    """

    message = EmailMultiAlternatives(subject, text_body, from_header, [to_email])
    message.attach_alternative(html_body, "text/html")
    try:
        sent = message.send(fail_silently=False)
        return bool(sent)
    except Exception:
        return False


def send_account_ready_email(
    user_email: str,
    dashboard_url: str = "/dashboard/",
    login_url: str = "/accounts/login/",
    password_reset_url: str = "/accounts/password/reset/",
) -> bool:
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return False

    context = {
        "user": user,
        "dashboard_link": dashboard_url,
        "login_link": login_url,
        "password_reset_link": password_reset_url,
    }
    subject = f"Your account is ready - {EmailService.BRAND_NAME}"
    return EmailService._send("account_ready", user_email, context=context, subject=subject)


def send_virtual_card_email(recipients: list[str]) -> dict[str, int]:
    subject = "Introducing Your WolvCapital Virtual Card"
    sent = 0
    failed = 0

    for email in recipients:
        if not email:
            continue

        html_content = render_to_string("emails/virtual_card_announcement.html", {})
        message = EmailMultiAlternatives(
            subject=subject,
            body="This is an HTML email. Please enable HTML view.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )
        message.attach_alternative(html_content, "text/html")

        try:
            result = message.send(fail_silently=False)
            if result:
                sent += 1
            else:
                failed += 1
        except Exception:
            failed += 1

    return {"sent": sent, "failed": failed}


def send_manual_email(
    subject: str, message_body: str, recipients: list[str], from_email: str | None = None
) -> dict[str, int]:
    sent = 0
    failed = 0
    from_address = from_email or settings.DEFAULT_FROM_EMAIL

    for email in recipients:
        if not email:
            continue

        message = EmailMultiAlternatives(subject, message_body, from_address, [email])
        try:
            result = message.send(fail_silently=False)
            if result:
                sent += 1
            else:
                failed += 1
        except Exception:
            failed += 1

    return {"sent": sent, "failed": failed}


def send_test_email(to_email: str, email_type: str = "test") -> bool:
    if email_type == "test":

        class MockUser:
            email = to_email
            username = to_email.split("@")[0]

            def get_full_name(self):
                return "Test User"

            class profile:
                email_preferences = {}

        return EmailService.send_welcome_email(MockUser())

    user, _ = User.objects.get_or_create(email=to_email, defaults={"username": to_email})

    if email_type == "welcome":
        return EmailService.send_welcome_email(user)

    if email_type == "transaction":
        transaction = Transaction(
            user=user,
            tx_type="deposit",
            amount=Decimal("100.00"),
            payment_method="bank_transfer",
            reference="TEST-REF-001",
            status="approved",
        )
        transaction.id = "test-transaction-id"
        return EmailService.send_transaction_notification(
            transaction, "approved", "Test admin notes"
        )

    if email_type == "investment":
        plan, _ = InvestmentPlan.objects.get_or_create(
            name="Test Plan",
            defaults={
                "daily_roi": Decimal("1.5"),
                "duration_days": 30,
                "min_amount": Decimal("100"),
                "max_amount": Decimal("10000"),
            },
        )
        investment = UserInvestment(
            user=user,
            plan=plan,
            amount=Decimal("500.00"),
            status="approved",
        )
        investment.id = "test-investment-id"
        return EmailService.send_investment_notification(investment, "approved", "Test admin notes")

    return False
