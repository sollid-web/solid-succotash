from __future__ import annotations

from contextlib import contextmanager

from django.db import connection


@contextmanager
def rls_admin_context():
    """Temporarily set Postgres RLS variables for system/admin operations.

    Useful for management commands where there is no authenticated request.
    """

    if connection.vendor != "postgresql":
        yield
        return

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT set_config('app.current_user_id', %s, false);",
            [""],
        )
        cursor.execute(
            "SELECT set_config('app.is_admin', %s, false);",
            ["true"],
        )

    try:
        yield
    finally:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT set_config('app.current_user_id', %s, false);",
                [""],
            )
            cursor.execute(
                "SELECT set_config('app.is_admin', %s, false);",
                ["false"],
            )
