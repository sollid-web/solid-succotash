from __future__ import annotations

import random
from datetime import timedelta
from typing import Optional

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import models, transaction

from core.email_service import send_email


class EmailVerification(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="email_verifications",
    )
    code = models.CharField(max_length=4)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "expires_at"]),
            models.Index(fields=["code"]),
        ]

    @property
    def is_expired(self) -> bool:
        return timezone.now() > self.expires_at

    @property
    def is_used(self) -> bool:
        return self.used_at is not None


def _generate_code() -> str:
    return f"{random.randint(0, 9999):04d}"


@transaction.atomic
def issue_verification_code(user) -> EmailVerification:
    # invalidate previous active codes
        # Rate limit: if a code was issued within the last 60 seconds, deny
        recent = EmailVerification.objects.filter(user=user).order_by('-created_at').first()
        if recent and (timezone.now() - recent.created_at).total_seconds() < 60:
            raise ValueError("Too many requests. Please wait before requesting another code.")
        EmailVerification.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())

    code = _generate_code()
    ev = EmailVerification.objects.create(
        user=user,
        code=code,
        expires_at=timezone.now() + timedelta(minutes=15),
    )

    send_email(
        to_address=user.email,
        subject="Your WolvCapital verification code",
        template_name=None,
        body=f"Your verification code is {code}. It expires in 15 minutes.",
    )
    return ev


@transaction.atomic
def verify_code(user, code: str) -> bool:
    ev: Optional[EmailVerification] = (
        EmailVerification.objects.select_for_update()
        .filter(user=user, code=code, used_at__isnull=True)
        .order_by("-created_at")
        .first()
    )
    if not ev or ev.is_expired:
        return False
    ev.used_at = timezone.now()
    ev.save(update_fields=["used_at"])

    # mark user as verified via profile flag if present or is_active
    # do not auto-approve any financial operations
    try:
        profile = getattr(user, "profile", None)
        if profile and hasattr(profile, "email_verified"):
            profile.email_verified = True
            profile.save(update_fields=["email_verified"])
    except Exception:
        pass
    return True
