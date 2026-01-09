# ---------- Render / Production Hardening ----------
import importlib
import os
import sys
from datetime import timedelta
from pathlib import Path
from types import ModuleType
from typing import Any
from urllib.parse import urlparse

Env: Any
try:
    from environ import Env as _Env
except Exception:  # pragma: no cover
    # Optional dependency in some environments.
    Env = None
else:
    Env = _Env

# dj-database-url is optional in some environments; import and fall back
# gracefully.
dj_database_url: ModuleType | None
try:
    dj_database_url = importlib.import_module("dj_database_url")
except Exception:  # pragma: no cover - only relevant without dependency
    dj_database_url = None

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# Core flags / secrets
# ------------------------------------------------------------------
if Env is None:
    raise ImportError(
        "django-environ is required. Install 'environ' / 'django-environ' "
        "in the runtime."
    )

env = Env()
Env.read_env()  # Load .env early

# Unified DEBUG + SECRET_KEY handling
DEBUG = env.bool("DEBUG", default=True)
_secret_key_env = env("SECRET_KEY", default=None)
if _secret_key_env:
    SECRET_KEY = _secret_key_env
else:
    if DEBUG:
        SECRET_KEY = "dev-secret-key-for-testing-only-do-not-use-in-prod"
    else:
        raise ValueError(
            "SECRET_KEY environment variable required when DEBUG=False"
        )
CSRF_TRUSTED_ORIGINS = ["http://localhost:8000", "http://127.0.0.1:8000"]

# Initialize ALLOWED_HOSTS before mutation logic below
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# Render / deployment host hints (defined before conditional usage later)
RENDER_EXTERNAL_URL = env("RENDER_EXTERNAL_URL", default=None)
RENDER_EXTERNAL_HOSTNAME = env("RENDER_EXTERNAL_HOSTNAME", default=None)
CUSTOM_DOMAIN = env("CUSTOM_DOMAIN", default=None)

DEFAULT_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

cors_origins_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
if cors_origins_env:
    CORS_ALLOWED_ORIGINS = [
        origin.strip()
        for origin in cors_origins_env.split(",")
        if origin.strip()
    ]
else:
    CORS_ALLOWED_ORIGINS = DEFAULT_CORS_ORIGINS.copy()

for origin in DEFAULT_CORS_ORIGINS:
    if origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(origin)

# --- GitHub Codespaces support ---
CODESPACES_DOMAIN = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
IN_CODESPACES = bool(
    CODESPACES_DOMAIN
    or os.getenv("CODESPACES")
    or os.getenv("GITHUB_CODESPACES")
)

# --- Railway support ---
# Railway health checks use `healthcheck.railway.app` as the Host header.
IN_RAILWAY = bool(
    os.getenv("RAILWAY")
    or os.getenv("RAILWAY_ENVIRONMENT")
    or os.getenv("RAILWAY_ENVIRONMENT_NAME")
    or os.getenv("RAILWAY_PROJECT_ID")
    or any(k.startswith("RAILWAY_") for k in os.environ)
)

if IN_RAILWAY:
    for host in ["healthcheck.railway.app", ".railway.app", ".up.railway.app"]:
        if host not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(host)

if IN_CODESPACES:
    ALLOWED_HOSTS += [".app.github.dev"]
    CSRF_TRUSTED_ORIGINS += ["https://*.app.github.dev"]
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    # Keep cookies insecure for development
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    # Allow session cookies to work in codespaces
    SESSION_COOKIE_SAMESITE = None

if RENDER_EXTERNAL_URL:
    p = urlparse(RENDER_EXTERNAL_URL)
    if p.hostname:
        ALLOWED_HOSTS.append(p.hostname)
    if RENDER_EXTERNAL_URL not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(RENDER_EXTERNAL_URL)

# Fallback: allow Render external hostname if provided
if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
    https_origin = f"https://{RENDER_EXTERNAL_HOSTNAME}"
    if https_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(https_origin)

if CUSTOM_DOMAIN:
    raw_domains = [d.strip() for d in CUSTOM_DOMAIN.split(",") if d.strip()]
    for domain in raw_domains:
        candidates = {domain}
        # If caller supplied bare apex, also trust the www subdomain
        # (and vice versa).
        if domain.startswith("www."):
            candidates.add(domain.removeprefix("www."))
        else:
            candidates.add(f"www.{domain}")

        for host in candidates:
            if host not in ALLOWED_HOSTS:
                ALLOWED_HOSTS.append(host)
            https_origin = f"https://{host}"
            if https_origin not in CSRF_TRUSTED_ORIGINS:
                CSRF_TRUSTED_ORIGINS.append(https_origin)
            if https_origin not in CORS_ALLOWED_ORIGINS:
                CORS_ALLOWED_ORIGINS.append(https_origin)

env_allowed_hosts = os.getenv("ALLOWED_HOSTS", "")
if env_allowed_hosts:
    ALLOWED_HOSTS += [
        h.strip() for h in env_allowed_hosts.split(",") if h.strip()
    ]

extra_hosts = os.getenv("ALLOWED_HOSTS_EXTRA", "")
if extra_hosts:
    ALLOWED_HOSTS += [h.strip() for h in extra_hosts.split(",") if h.strip()]

env_csrf_origins = os.getenv("CSRF_TRUSTED_ORIGINS", "")
if env_csrf_origins:
    CSRF_TRUSTED_ORIGINS += [
        o.strip() for o in env_csrf_origins.split(",") if o.strip()
    ]

extra_origins = os.getenv("CSRF_TRUSTED_ORIGINS_EXTRA", "")
if extra_origins:
    CSRF_TRUSTED_ORIGINS += [
        o.strip() for o in extra_origins.split(",") if o.strip()
    ]

extra_cors = os.getenv("CORS_ALLOWED_ORIGINS_EXTRA", "")
if extra_cors:
    CORS_ALLOWED_ORIGINS += [
        o.strip() for o in extra_cors.split(",") if o.strip()
    ]

CORS_ALLOWED_ORIGIN_REGEXES: list[str] = []

if IN_CODESPACES:
    cors_codespaces_origin = (
        f"https://{CODESPACES_DOMAIN}" if CODESPACES_DOMAIN else None
    )
    if (
        cors_codespaces_origin
        and cors_codespaces_origin not in CORS_ALLOWED_ORIGINS
    ):
        CORS_ALLOWED_ORIGINS.append(cors_codespaces_origin)
    CORS_ALLOWED_ORIGIN_REGEXES.append(r"^https://.*\\.app\\.github\\.dev$")

# Allow Vercel preview deployments (*.vercel.app)
CORS_ALLOWED_ORIGIN_REGEXES.append(r"^https://.*\\.vercel\\.app$")

CORS_ALLOWED_ORIGINS = list(dict.fromkeys(CORS_ALLOWED_ORIGINS))
CSRF_TRUSTED_ORIGINS = list(dict.fromkeys(CSRF_TRUSTED_ORIGINS))

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Trust Render's TLS termination
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ------------------------------------------------------------------
# Installed apps / middleware
# ------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Third-party
    "whitenoise.runserver_nostatic",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    # Local apps
    "core",
    "users",
    "investments",
    "transactions",
    "api",
    "referrals",
]

# Alert thresholds for high-priority admin email notifications
# Environment variable overrides allow runtime tuning without code changes.


def _int_env(name: str, default: int) -> int:
    try:
        raw = os.getenv(name)
        if raw is None:
            return default
        val = int(raw.strip())
        if val < 0:
            return default
        return val
    except Exception:
        return default


ALERT_THRESHOLDS = {
    "high_deposit": _int_env("ALERT_THRESHOLD_HIGH_DEPOSIT", 10000),
    "high_withdrawal": _int_env("ALERT_THRESHOLD_HIGH_WITHDRAWAL", 5000),
    "high_card_purchase": _int_env("ALERT_THRESHOLD_HIGH_CARD_PURCHASE", 5000),
    # Optional: investment completion large principal alert
    "high_investment_completion": _int_env(
        "ALERT_THRESHOLD_HIGH_INVESTMENT_COMPLETION",
        10000,
    ),
    # High daily ROI payout alert (single payout amount)
    "high_roi_payout": _int_env("ALERT_THRESHOLD_HIGH_ROI_PAYOUT", 5000),
}

# ------------------------------------------------------------------
# REST Framework Configuration
# ------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "wolvcapital.authentication.RlsJwtAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "wolvcapital.authentication.RlsTokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}

# ------------------------------------------------------------------
# Simple JWT Configuration
# ------------------------------------------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": os.getenv("SECRET_KEY", "your-secret-key-here"),
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "wolvcapital.middleware.RequestIDMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "wolvcapital.middleware.PostgresRlsSessionMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]
# ------------------------------------------------------------------
# Database (Postgres in prod, SQLite locally)
# ------------------------------------------------------------------
if os.getenv("DATABASE_URL"):
    if dj_database_url:
        DATABASES = {
            "default": dj_database_url.parse(
                os.environ["DATABASE_URL"], conn_max_age=600, ssl_require=True
            )
        }
    else:
        # Minimal fallback parser for DATABASE_URL when dj-database-url isn't
        # installed.
        # Supports common PostgreSQL URLs like:
        # postgres://user:pass@host:port/dbname
        p = urlparse(os.environ["DATABASE_URL"])
        db_name = p.path.lstrip("/") if p.path else ""
        db_engine = "django.db.backends.postgresql"
        DATABASES = {
            "default": {
                "ENGINE": db_engine,
                "NAME": db_name,
                "USER": p.username or "",
                "PASSWORD": p.password or "",
                "HOST": p.hostname or "",
                "PORT": str(p.port) if p.port else "",
                "CONN_MAX_AGE": 600,
                "OPTIONS": {"sslmode": "require"},
            }
        }
else:
    # Guard against SQLite fallback in production environments
    if IN_RAILWAY and not DEBUG:
        raise ValueError(
            "Railway production deployment detected without DATABASE_URL! "
            "Add PostgreSQL service and set DATABASE_URL to prevent data loss. "
            "Users and investments will be lost on every redeploy with SQLite."
        )

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": str(BASE_DIR / "db.sqlite3"),
        }
    }

# ------------------------------------------------------------------
# Templates
# ------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(BASE_DIR / "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.i18n",
                "core.context_processors.brand_context",
            ],
        },
    },
]

# ------------------------------------------------------------------
# URL Configuration
# ------------------------------------------------------------------
ROOT_URLCONF = "wolvcapital.urls"
WSGI_APPLICATION = "wolvcapital.wsgi.application"

# ------------------------------------------------------------------
# Static & media
# ------------------------------------------------------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [str(BASE_DIR / "static")]
STATIC_ROOT_PATH = BASE_DIR / "staticfiles"

# Ensure STATIC_ROOT exists so whitenoise/tests don't warn about missing
# directory
STATIC_ROOT_PATH.mkdir(parents=True, exist_ok=True)
STATIC_ROOT = str(STATIC_ROOT_PATH)

TESTING = any(
    arg in os.environ.get("PYTEST_CURRENT_TEST", "")
    for arg in ["::"]
) or any(c in " ".join(sys.argv) for c in ["test", "pytest"])

if not DEBUG and not TESTING:
    STATICFILES_STORAGE = (
        "whitenoise.storage.CompressedManifestStaticFilesStorage"
    )
    # Avoid hard 500s if a static path is referenced but missing in the
    # manifest.
    # WhiteNoise will fall back to the un-hashed file path instead of raising
    # ValueError.
    WHITENOISE_MANIFEST_STRICT = False

MEDIA_URL = "/media/"
MEDIA_ROOT_PATH = BASE_DIR / "media"
MEDIA_ROOT_PATH.mkdir(parents=True, exist_ok=True)
MEDIA_ROOT = str(MEDIA_ROOT_PATH)

# ------------------------------------------------------------------
# Branding Configuration
# ------------------------------------------------------------------
BRAND = {
    "name": "WolvCapital",
    "tagline": "Invest Smart, Grow Fast",
    "primary": "#2196F3",
    "primary_light": "#6EC1E4",
    "primary_dark": "#0D47A1",
    "accent_gold": "#FFD700",
    "success": "#10B981",
    "danger": "#EF4444",
    "warning": "#F59E0B",
    "logo_svg": "images/logos/wolvcapital-logo.svg",
    "logo_png": "images/logos/wolvcapital-logo.svg",
    "favicon": "images/logos/wolvcapital-favicon.svg",
}

# ------------------------------------------------------------------
# Auth / Allauth
# ------------------------------------------------------------------
AUTH_USER_MODEL = "users.User"

# Authentication backends
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Frontend URLs (Next.js handles all user-facing pages)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Ensure the configured frontend origin is trusted for CORS/CSRF
_frontend_origin = FRONTEND_URL.rstrip("/")
if _frontend_origin and _frontend_origin not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(_frontend_origin)
if _frontend_origin and _frontend_origin not in CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS.append(_frontend_origin)

# Redirect to frontend after Django admin/allauth operations
LOGIN_URL = f"{FRONTEND_URL}/accounts/login"
LOGIN_REDIRECT_URL = f"{FRONTEND_URL}/dashboard"
LOGOUT_REDIRECT_URL = FRONTEND_URL

SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True

# Security: Prevent auto-login after signup - require explicit login
# This ensures users must sign in with credentials after account creation
ACCOUNT_LOGIN_ON_SIGNUP = False
ACCOUNT_SIGNUP_REDIRECT_URL = f"{FRONTEND_URL}/accounts/login?signup=success"

# ------------------------------------------------------------------
# Email Configuration
# ------------------------------------------------------------------
# Resend API key (optional). If present in production, we can send via Resend.
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

# Email backend selection based on environment
email_backend_override = os.getenv("EMAIL_BACKEND")
if email_backend_override:
    EMAIL_BACKEND = email_backend_override
else:
    if DEBUG:
        # Development: Print emails to console
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    elif RESEND_API_KEY:
        # Production: Prefer Resend if configured
        EMAIL_BACKEND = "core.email_backends.resend.ResendEmailBackend"
    else:
        # Production fallback: Use SMTP
        EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# SMTP Configuration (for production)
# Backwards-compatible: accept either SMTP_* / EMAIL_USER+EMAIL_PASS,
# or legacy EMAIL_HOST/EMAIL_HOST_USER.
EMAIL_HOST = os.getenv("SMTP_HOST") or os.getenv(
    "EMAIL_HOST",
    "smtp.privateemail.com",
)
EMAIL_PORT = int(
    str(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT") or "587")
)
EMAIL_USE_TLS = (os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true')
EMAIL_HOST_USER = os.getenv('EMAIL_USER') or os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS") or os.getenv(
    "EMAIL_HOST_PASSWORD"
)
# Default from email
DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    "WolvCapital <support@mail.wolvcapital.com>",
)
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# Email timeout (90 seconds)
EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "90"))

# Email subject prefix
EMAIL_SUBJECT_PREFIX = os.getenv("EMAIL_SUBJECT_PREFIX", "[WolvCapital] ")

# Admin email recipients for contact form and support notifications
ADMIN_EMAIL_RECIPIENTS = [
    email.strip()
    for email in os.getenv(
        "ADMIN_EMAIL_RECIPIENTS",
        "support@mail.wolvcapital.com,privacy@wolvcapital.com,"
        "legal@wolvcapital.com,admin@wolvcapital.com"
    ).split(",")
    if email.strip()
]

# Base URLs for backend and public-facing site
PUBLIC_SITE_URL = os.getenv("PUBLIC_SITE_URL", "https://wolvcapital.com")

# Site URL for email links
# NOTE: Must always be a string (used in email templates/headers).
_CODESPACES_SITE_URL = (
    f"https://{os.getenv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', '')}"
    if IN_CODESPACES and CODESPACES_DOMAIN
    else ""
)
SITE_URL: str = (
    os.getenv("SITE_URL")
    or RENDER_EXTERNAL_URL
    or _CODESPACES_SITE_URL
    or PUBLIC_SITE_URL
)
SITE_URL = str(SITE_URL)

ADMIN_SITE_URL = os.getenv("ADMIN_SITE_URL", SITE_URL)


def _add_trusted_origin_and_host(url_value: str | None) -> None:
    """Add hostname from a URL to ALLOWED_HOSTS and its https origin to CSRF/CORS.

    This prevents 400 Bad Request (DisallowedHost) and CSRF failures when the
    backend is accessed behind a proxy using the public site domain.
    """

    if not url_value:
        return

    raw = str(url_value).strip()
    if not raw:
        return

    parsed = urlparse(raw if "://" in raw else f"https://{raw}")
    host = parsed.hostname
    if not host:
        return

    candidates = {host}
    if host.startswith("www."):
        candidates.add(host.removeprefix("www."))
    else:
        candidates.add(f"www.{host}")

    for candidate in candidates:
        if candidate and candidate not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(candidate)

    # Trust https origin for CSRF/CORS (admin + any cookie-auth forms)
    https_origin = f"https://{host}"
    if https_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(https_origin)
    if https_origin not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(https_origin)


# Always trust our public site + frontend URL even if CUSTOM_DOMAIN isn't set.
_add_trusted_origin_and_host(PUBLIC_SITE_URL)
_add_trusted_origin_and_host(os.getenv("FRONTEND_URL"))

# ------------------------------------------------------------------
# Business Email Inbox Configuration (IMAP)
# ------------------------------------------------------------------
# IMAP settings for fetching business emails
INBOX_IMAP_HOST = os.getenv("INBOX_IMAP_HOST", "imap.gmail.com")
INBOX_IMAP_PORT = int(os.getenv("INBOX_IMAP_PORT", "993"))
INBOX_EMAIL_USER = os.getenv("INBOX_EMAIL_USER", EMAIL_HOST_USER)
INBOX_EMAIL_PASSWORD = os.getenv("INBOX_EMAIL_PASSWORD", EMAIL_HOST_PASSWORD)
INBOX_FOLDER = os.getenv("INBOX_FOLDER", "INBOX")
INBOX_USE_SSL = os.getenv("INBOX_USE_SSL", "True").lower() == "true"

# Sync settings
INBOX_SYNC_LIMIT = int(
    os.getenv("INBOX_SYNC_LIMIT", "200")
)  # Max emails per sync
INBOX_AUTO_SYNC = (
    os.getenv("INBOX_AUTO_SYNC", "TRUE").lower() == "true"
)  # Enable cron sync

# ------------------------------------------------------------------
# I18N / TZ
# ------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------------
# Logging (structured JSON in production)
# ------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = os.getenv("LOG_FORMAT", "json")  # 'json' or 'plain'


class JsonFormatter:
    """Minimal JSON log formatter to avoid external deps.

    Produces a single-line JSON object with level, message, logger,
    and timestamp.
    """

    def format(self, record):  # pragma: no cover (formatting utility)
        import datetime
        import json

        from wolvcapital.middleware import (
            get_request_id,
        )  # local import to avoid circular

        rid = get_request_id()
        data = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": datetime.datetime.utcnow().isoformat() + "Z",
        }
        if rid:
            data["request_id"] = rid
        if record.exc_info:
            import traceback

            data["exc"] = "".join(traceback.format_exception(*record.exc_info))
        return json.dumps(data, ensure_ascii=False)


if LOG_FORMAT == "json" and not DEBUG:
    SIMPLE_FORMATTER: dict[str, Any] = {
        "()": JsonFormatter,
    }
else:
    SIMPLE_FORMATTER = {
        "format": "[%(asctime)s] %(levelname)s %(name)s: %(message)s",
        "datefmt": "%Y-%m-%dT%H:%M:%SZ",
    }

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": SIMPLE_FORMATTER,
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
        }
    },
    "root": {"handlers": ["console"], "level": LOG_LEVEL},
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            "propagate": False,
        },
        "wolvcapital": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            "propagate": False,
        },
        "core.management.fetch_mail": {
            "handlers": ["console"],
            "level": os.getenv("FETCH_MAIL_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
    },
}

# ------------------------------------------------------------------
# Security Settings (Production Ready)
# ------------------------------------------------------------------
# Always enable security features for production deployment
SECURE_SSL_REDIRECT = not DEBUG and not IN_CODESPACES and not TESTING
SESSION_COOKIE_SECURE = not DEBUG and not IN_CODESPACES
CSRF_COOKIE_SECURE = not DEBUG and not IN_CODESPACES

# HSTS Security (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = int(
    os.getenv("SECURE_HSTS_SECONDS", "31536000")
)  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Additional security headers
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_BROWSER_XSS_FILTER = True

# Additional cookie security
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True

# ------------------------------------------------------------------
# Cookie / CSRF tweaks for Render
# ------------------------------------------------------------------
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False

# Session basics
SESSION_ENGINE = (
    "django.contrib.sessions.backends.db"
)  # Use database-backed sessions
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = (
    True
)  # Save session on every request to maintain login
SESSION_COOKIE_NAME = "wolvcapital_sessionid"
SESSION_COOKIE_DOMAIN = None  # Let Django handle this automatically
