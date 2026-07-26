import os
import secrets
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

import resend

User = get_user_model()


def _send_reset_email(email: str, reset_url: str):
    resend.api_key = os.environ.get("RESEND_API_KEY", "")
    resend.Emails.send({
        "from": "WolvCapital Support <support@mail.wolvcapital.com>",
        "to": email,
        "subject": "Reset Your WolvCapital Password",
        "text": f"""Hello,

We received a request to reset your WolvCapital account password.

Click the link below to reset your password. This link expires in 1 hour:

{reset_url}

If you did not request a password reset, please ignore this email. Your account remains secure.

Warm regards,
The WolvCapital Support Team
support@mail.wolvcapital.com
""",
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    POST /api/auth/password/reset/
    Body: { "email": "user@example.com" }
    Always returns 200 to prevent email enumeration.
    """
    email = request.data.get("email", "").strip().lower()
    if not email:
        return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        # Return 200 anyway — don't reveal if email exists
        return Response({"detail": "If that email is registered, a reset link has been sent."})

    # Generate a secure token and store in cache for 1 hour
    token = secrets.token_urlsafe(48)
    cache_key = f"pwd_reset_{token}"
    cache.set(cache_key, str(user.pk), timeout=3600)

    # Build reset URL
    frontend_url = os.environ.get("FRONTEND_URL", "https://www.wolvcapital.com")
    reset_url = f"{frontend_url}/reset-password?token={token}"

    try:
        _send_reset_email(user.email, reset_url)
    except Exception as e:
        return Response(
            {"detail": "Failed to send reset email. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return Response({"detail": "If that email is registered, a reset link has been sent."})


@api_view(["POST"])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """
    POST /api/auth/password/reset/confirm/
    Body: { "token": "...", "password": "newpassword", "password2": "newpassword" }
    """
    token = request.data.get("token", "").strip()
    password = request.data.get("password", "")
    password2 = request.data.get("password2", "")

    if not token or not password or not password2:
        return Response(
            {"detail": "Token, password and password confirmation are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if password != password2:
        return Response(
            {"detail": "Passwords do not match."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(password) < 8:
        return Response(
            {"detail": "Password must be at least 8 characters."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cache_key = f"pwd_reset_{token}"
    user_pk = cache.get(cache_key)

    if not user_pk:
        return Response(
            {"detail": "This reset link is invalid or has expired."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(pk=user_pk)
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.set_password(password)
    user.save()

    # Invalidate the token immediately after use
    cache.delete(cache_key)

    return Response({"detail": "Password reset successful. You can now log in."})
