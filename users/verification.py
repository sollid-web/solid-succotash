from __future__ import annotations

import secrets
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from core.email_service import send_email

from .models import EmailVerification


def _generate_token() -> str:
    return secrets.token_urlsafe(32)



@transaction.atomic
def issue_verification_token(user) -> EmailVerification:
    # invalidate previous active tokens
    recent = EmailVerification.objects.filter(user=user).order_by('-created_at').first()
    if recent and (timezone.now() - recent.created_at).total_seconds() < 60:
        raise ValueError("Too many requests. Please wait before requesting another link.")
    EmailVerification.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())

    token = _generate_token()
    ev = EmailVerification.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=2),
    )

    site_url = str(
        getattr(settings, "PUBLIC_SITE_URL", None)
        or getattr(settings, "SITE_URL", "https://wolvcapital.com")
    ).rstrip("/")
    verify_url = f"{site_url}/accounts/verify-email?token={token}"
    send_email(
        template_name="email_verification",
        to_emails=user.email,
        context={"user": user, "verify_url": verify_url, "username": user.username or user.email},
        subject="Verify your WolvCapital email address",
        from_email="WolvCapital <support@mail.wolvcapital.com>",
    )
    return ev



@transaction.atomic
def verify_token(token: str) -> EmailVerification | None:
    ev: EmailVerification | None = (
        EmailVerification.objects.select_for_update()
        .filter(token=token, used_at__isnull=True)
        .order_by("-created_at")
        .first()
    )
    if not ev or ev.is_expired:
        return None
    ev.used_at = timezone.now()
    ev.save(update_fields=["used_at"])

    user = ev.user
    try:
        profile = getattr(user, "profile", None)
        if profile and hasattr(profile, "email_verified"):
            profile.email_verified = True
            profile.save(update_fields=["email_verified"])
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=["is_active"])
    except Exception:
        pass
    return ev
