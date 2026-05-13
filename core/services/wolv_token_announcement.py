from __future__ import annotations

from django.contrib.auth import get_user_model

from core.email_service import EmailService

User = get_user_model()

SUBJECT = "🚀 Introducing WOLV Token — Your Profits Are Now On-Chain!"
DASHBOARD_URL = "https://wolvcapital.com/dashboard"
WOLV_TOKEN_URL = "https://wolvcapital.com/wolv-token"
CONTRACT_ADDRESS = "0xe0167279aef7bf4ad313d261da82e8366822270c"


def get_wolv_token_recipients(test_email: str | None = None) -> list[dict[str, str]]:
    if test_email:
        return [{"email": test_email, "first_name": "Test"}]

    return list(
        User.objects.filter(
            is_active=True,
            is_staff=False,
            is_superuser=False,
        )
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .values("email", "first_name")
    )


def get_wolv_token_recipient_count() -> int:
    return (
        User.objects.filter(
            is_active=True,
            is_staff=False,
            is_superuser=False,
        )
        .exclude(email__isnull=True)
        .exclude(email__exact="")
        .count()
    )


def send_wolv_token_announcement(recipients: list[dict[str, str]]) -> dict[str, int]:
    sent = 0
    failed = 0

    for recipient in recipients:
        email = recipient.get("email")
        if not email:
            continue

        first_name = recipient.get("first_name") or "Valued Investor"
        context = {
            "first_name": first_name,
            "dashboard_url": DASHBOARD_URL,
            "wolv_token_url": WOLV_TOKEN_URL,
            "contract_address": CONTRACT_ADDRESS,
        }

        if EmailService.send_template(
            "wolv_token_announcement",
            email,
            context=context,
            subject=SUBJECT,
        ):
            sent += 1
        else:
            failed += 1

    return {"sent": sent, "failed": failed}
