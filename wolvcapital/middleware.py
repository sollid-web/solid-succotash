import logging
import threading
import uuid

from django.db import connection, OperationalError, ProgrammingError
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)

_request_local = threading.local()

# ---------------------------------------------------------------------------
# Module-level database reachability probe
# ---------------------------------------------------------------------------
# Executed once when Django imports this module (i.e. during middleware stack
# construction at worker startup).  A failed probe does NOT prevent the worker
# from starting — it only sets a flag so that PostgresRlsSessionMiddleware can
# skip RLS setup gracefully instead of hanging on every request.
#
# The probe uses a short statement_timeout so a slow/unreachable Supabase
# instance cannot block the worker for more than DB_PROBE_TIMEOUT_MS ms.
# ---------------------------------------------------------------------------

DB_PROBE_TIMEOUT_MS = 3_000  # 3 seconds — enough for a healthy connection


def _probe_database() -> bool:
    """Return True if the default database is reachable, False otherwise.

    Runs a lightweight ``SELECT 1`` wrapped in a per-session statement_timeout
    so the probe never blocks the worker for more than DB_PROBE_TIMEOUT_MS.
    Any exception is caught and logged; the function never raises.
    """
    try:
        with connection.cursor() as cursor:
            # Apply a tight timeout for the probe only.  This is a session-
            # level SET so it does not persist beyond this connection checkout
            # when conn_max_age > 0 (Django resets session state on reuse).
            cursor.execute(
                "SET LOCAL statement_timeout = %s;", [DB_PROBE_TIMEOUT_MS]
            )
            cursor.execute("SELECT 1;")
        logger.info(
            "PostgresRlsSessionMiddleware: database reachability probe succeeded"
        )
        return True
    except OperationalError as exc:
        logger.warning(
            "PostgresRlsSessionMiddleware: database unreachable during startup probe "
            "(OperationalError: %s). RLS session variables will be skipped until "
            "the database becomes available.",
            exc,
        )
    except ProgrammingError as exc:
        logger.warning(
            "PostgresRlsSessionMiddleware: database probe failed with ProgrammingError: %s. "
            "RLS session variables will be skipped.",
            exc,
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "PostgresRlsSessionMiddleware: unexpected error during database probe: %s (%s). "
            "RLS session variables will be skipped.",
            exc,
            type(exc).__name__,
        )
    return False


# Run the probe at import time.  If Django is not yet fully configured (e.g.
# during test collection before django.setup()), skip it silently.
try:
    from django.conf import settings as _settings  # noqa: PLC0415

    if _settings.configured:
        _db_available = _probe_database()
    else:
        _db_available = False
except Exception:  # noqa: BLE001
    _db_available = False


def get_request_id():  # helper for formatters
    return getattr(_request_local, "request_id", None)


class RequestIDMiddleware(MiddlewareMixin):
    """Assign a unique request id (UUID4) to each request.
    Used for trace correlation.
    """

    def process_request(self, request): # pragma: no cover (simple assignment)
        rid = uuid.uuid4().hex
        _request_local.request_id = rid
        request.request_id = rid

    def process_response(self, request, response): # pragma: no cover
        rid = getattr(request, "request_id", None)
        if rid:
            response.headers["X-Request-ID"] = rid
        return response


class PostgresRlsSessionMiddleware(MiddlewareMixin):
    """Set per-request Postgres session variables used by RLS.
    Policies read:
    - app.current_user_id
    - app.is_admin

    If the database is unreachable (detected at startup or at request time),
    the middleware logs a warning and skips RLS setup rather than crashing the
    worker or hanging indefinitely.
    """

    def _set_rls_vars(self, user_id: str, is_admin: str) -> None:
        """Execute the two set_config calls inside a single cursor context."""
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT set_config('app.current_user_id', %s, false);",
                [user_id],
            )
            cursor.execute(
                "SELECT set_config('app.is_admin', %s, false);",
                [is_admin],
            )

    def _reset_rls_vars(self) -> None:
        """Reset RLS session variables to safe defaults."""
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT set_config('app.current_user_id', %s, false);",
                [""],
            )
            cursor.execute(
                "SELECT set_config('app.is_admin', %s, false);",
                ["false"],
            )

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
            self._set_rls_vars(user_id, is_admin)
        except OperationalError as exc:
            logger.warning(
                "PostgresRlsSessionMiddleware.process_request: could not set RLS "
                "session variables (OperationalError: %s). Request will proceed "
                "without RLS context — check database connectivity.",
                exc,
            )
        except ProgrammingError as exc:
            logger.warning(
                "PostgresRlsSessionMiddleware.process_request: could not set RLS "
                "session variables (ProgrammingError: %s).",
                exc,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(
                "PostgresRlsSessionMiddleware.process_request: unexpected error "
                "setting RLS session variables: %s (%s).",
                exc,
                type(exc).__name__,
                exc_info=True,
            )

    def process_response(self, request, response):  # pragma: no cover
        if connection.vendor != "postgresql":
            return response

        # Reset to safe defaults to avoid leaking auth context across requests
        # when connections are re-used from the pool.
        try:
            self._reset_rls_vars()
        except OperationalError as exc:
            logger.warning(
                "PostgresRlsSessionMiddleware.process_response: could not reset RLS "
                "session variables (OperationalError: %s). Connection may be stale.",
                exc,
            )
        except ProgrammingError as exc:
            logger.warning(
                "PostgresRlsSessionMiddleware.process_response: could not reset RLS "
                "session variables (ProgrammingError: %s).",
                exc,
            )
        except Exception as exc:  # noqa: BLE001
            logger.error(
                "PostgresRlsSessionMiddleware.process_response: unexpected error "
                "resetting RLS session variables: %s (%s).",
                exc,
                type(exc).__name__,
                exc_info=True,
            )
        return response