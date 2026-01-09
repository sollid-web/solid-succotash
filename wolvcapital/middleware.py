import threading
import uuid

from django.db import connection
from django.utils.deprecation import MiddlewareMixin

_request_local = threading.local()


def get_request_id():  # helper for formatters
    return getattr(_request_local, "request_id", None)


class RequestIDMiddleware(MiddlewareMixin):
    """Assign a unique request id (UUID4) to each request.

    Used for trace correlation.
    """

    def process_request(self, request):  # pragma: no cover (simple assignment)
        rid = uuid.uuid4().hex
        _request_local.request_id = rid
        request.request_id = rid

    def process_response(self, request, response):  # pragma: no cover
        rid = getattr(request, "request_id", None)
        if rid:
            response.headers["X-Request-ID"] = rid
        return response


class PostgresRlsSessionMiddleware(MiddlewareMixin):
    """Set per-request Postgres session variables used by RLS.

    Policies read:
    - app.current_user_id
    - app.is_admin
    """

    def process_request(self, request):  # pragma: no cover
        if connection.vendor != "postgresql":
            return

        user = getattr(request, "user", None)
        user_id = ""
        is_admin = "false"
        if user is not None and getattr(user, "is_authenticated", False):
            user_id = str(getattr(user, "id", ""))
            is_admin = (
                "true" if (user.is_staff or user.is_superuser) else "false"
            )

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT set_config('app.current_user_id', %s, false);",
                    [user_id],
                )
                cursor.execute(
                    "SELECT set_config('app.is_admin', %s, false);",
                    [is_admin],
                )
        except Exception:
            return

    def process_response(self, request, response):  # pragma: no cover
        if connection.vendor != "postgresql":
            return response

        # Reset to safe defaults to avoid leaking auth context across requests
        # when connections are re-used.
        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT set_config('app.current_user_id', %s, false);",
                    [""],
                )
                cursor.execute(
                    "SELECT set_config('app.is_admin', %s, false);",
                    ["false"],
                )
        except Exception:
            return response
        return response
