from __future__ import annotations

from django.db import connection
from rest_framework.authentication import TokenAuthentication
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication


def _set_rls_vars(user_id: str, is_admin: bool) -> None:
    if connection.vendor != "postgresql":
        return

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT set_config('app.current_user_id', %s, false);",
            [user_id],
        )
        cursor.execute(
            "SELECT set_config('app.is_admin', %s, false);",
            ["true" if is_admin else "false"],
        )


class RlsTokenAuthentication(TokenAuthentication):
    """Token auth that also sets Postgres RLS session variables."""

    def authenticate(self, request: Request):
        result = super().authenticate(request)
        if result is None:
            return None

        user, token = result
        is_admin = bool(
            getattr(user, "is_staff", False)
            or getattr(user, "is_superuser", False)
        )
        _set_rls_vars(
            str(getattr(user, "id", "")),
            is_admin,
        )
        return (user, token)


class RlsJwtAuthentication(JWTAuthentication):
    """JWT auth that also sets Postgres RLS session variables."""

    def authenticate(self, request: Request):
        result = super().authenticate(request)
        if result is None:
            return None

        user, validated_token = result
        is_admin = bool(
            getattr(user, "is_staff", False)
            or getattr(user, "is_superuser", False)
        )
        _set_rls_vars(
            str(getattr(user, "id", "")),
            is_admin,
        )
        return (user, validated_token)
