from __future__ import annotations

import random
from datetime import timedelta
from typing import Optional

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models, transaction

from core.email_service import send_email


import secrets

class EmailVerification(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="email_verifications",
    )
    token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "expires_at"]),
            models.Index(fields=["token"]),
        ]

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None



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

    verify_url = f"https://wolvcapital.com/accounts/verify-email?token={token}"
    send_email(
        template_name="email_verification",
        to_emails=user.email,
        context={"user": user, "verify_url": verify_url},
        subject="Verify your WolvCapital email address",
    )
    return ev



@transaction.atomic
def verify_token(token: str) -> Optional[EmailVerification]:
    ev: Optional[EmailVerification] = (
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
