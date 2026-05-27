# ---------- Render / Production Hardening ----------
import os
import sys
from datetime import timedelta
from pathlib import Path
from typing import Any

import dj_database_url

Env: Any
try:
    from environ import Env as _Env
except Exception:  # pragma: no cover
    # Optional dependency in some environments.
    Env = None
else:
    Env = _Env

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# Core flags / secrets
# ------------------------------------------------------------------
if Env is None:
    raise ImportError(
        "django-environ is required. Install 'environ' / 'django-environ' in the runtime."
    )

env = Env()

ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    Env.read_env(str(ENV_FILE))  # Load .env early
else:
    Env.read_env()  # Fallback to default lookup

# Unified DEBUG + SECRET_KEY handling
DEBUG = env.bool("DEBUG", default=True)
SECRET_KEY = env("SECRET_KEY", default=None)

# ── Stripe Keys ──────────────────────────────────
# Secret key used server‑side (never expose in frontend)
STRIPE_SECRET_KEY = env("STRIPE_SECRET_KEY", default="sk_test_xxx_REPLACE_ME_xxx")
STRIPE_WEBHOOK_SECRET = env("STRIPE_WEBHOOK_SECRET", default="whsec_YOUR_SECRET")
STRIPE_PUBLISHABLE_KEY = env("STRIPE_PUBLISHABLE_KEY", default="pk_test_YOUR_KEY")
ROI_CRON_SECRET = env("ROI_CRON_SECRET", default=None)
DRIP_CRON_SECRET = env("DRIP_CRON_SECRET", default=None)
STRIPE_ISSUING_ENABLED = True
STRIPE_CARDHOLDER_TYPE = "individual"
GROQ_API_KEY = env("GROQ_API_KEY", default="")

# Startup debugging for Railway/production deployment
print("🔧 Django startup: Loading environment...", file=sys.stderr)
print(f"   DEBUG={DEBUG}", file=sys.stderr)
print(f"   DATABASE_URL present: {bool(env('DATABASE_URL', default=None))}", file=sys.stderr)
print(f"   SECRET_KEY present: {bool(SECRET_KEY)}", file=sys.stderr)

if DEBUG:
    # Allow fallback dev key for local development
    if not SECRET_KEY:
        SECRET_KEY = "dev-fallback-key-unsafe"
else:
    # Fail fast in production if SECRET_KEY is missing
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable required when DEBUG=False")

# ------------------------------------------------------------------
# ALLOWED_HOSTS & CSRF Configuration (Koyeb + Production)
# ------------------------------------------------------------------
# Get custom domain from environment (e.g., from Koyeb)
KOYEB_PUBLIC_DOMAIN = env("KOYEB_PUBLIC_DOMAIN", default=None)
CUSTOM_DOMAIN = env("CUSTOM_DOMAIN", default=None)

# Dynamic ALLOWED_HOSTS for multi-environment deployment
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# Add custom domains if provided
if KOYEB_PUBLIC_DOMAIN:
    ALLOWED_HOSTS.append(KOYEB_PUBLIC_DOMAIN)
if CUSTOM_DOMAIN:
    ALLOWED_HOSTS.append(CUSTOM_DOMAIN)
    ALLOWED_HOSTS.append(f"www.{CUSTOM_DOMAIN}")

CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
)

# Add custom domain CSRF origins if provided
if KOYEB_PUBLIC_DOMAIN:
    CSRF_TRUSTED_ORIGINS.append(f"https://{KOYEB_PUBLIC_DOMAIN}")
if CUSTOM_DOMAIN:
    CSRF_TRUSTED_ORIGINS.append(f"https://{CUSTOM_DOMAIN}")
    CSRF_TRUSTED_ORIGINS.append(f"https://www.{CUSTOM_DOMAIN}")

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
)

# Add custom domain CORS origins if provided
if KOYEB_PUBLIC_DOMAIN:
    CORS_ALLOWED_ORIGINS.append(f"https://{KOYEB_PUBLIC_DOMAIN}")
if CUSTOM_DOMAIN:
    CORS_ALLOWED_ORIGINS.append(f"https://{CUSTOM_DOMAIN}")
    CORS_ALLOWED_ORIGINS.append(f"https://www.{CUSTOM_DOMAIN}")

CORS_ALLOWED_ORIGIN_REGEXES: list[str] = [
    r"^https://.*\\.vercel\\.app$",
    r"^https://.*\\.up\\.railway\\.app$",
]

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

# Disable automatic slash-appending redirects for POST API routes.
# This prevents POST requests from being converted into 301/307 redirects
# by CommonMiddleware when the URL does not already include a trailing slash.
APPEND_SLASH = False

# ------------------------------------------------------------------
# Security Headers (Koyeb & Production)
# ------------------------------------------------------------------
# HTTPS enforcement in production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = "DENY"
    SECURE_CONTENT_SECURITY_POLICY = {
        "default-src": ("'self'",),
        "script-src": ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net"),
        "style-src": ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net"),
        "img-src": ("'self'", "data:", "https:"),
        "font-src": ("'self'", "data:", "https:"),
        "connect-src": ("'self'", "https://api.stripe.com"),
    }
INSTALLED_APPS = [
    # unfold must come before contrib.admin so it can override templates
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Constance for financial controls
    "constance",
    "constance.backends.database",
    # Third-party
    "whitenoise.runserver_nostatic",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "anymail",
    # Local apps
    "core",
    "users",
    "investments",
    "transactions",
    "api",
    "referrals",
    "cards",
    "chat",
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
# Constance Configuration (Financial Controls)
# ------------------------------------------------------------------
CONSTANCE_BACKEND = "constance.backends.database.DatabaseBackend"

CONSTANCE_CONFIG = {
    "SITE_NAME": ("WolvCapital", "Site name displayed in branding"),
    "MIN_DEPOSIT": (50.00, "Minimum deposit amount in USD"),
    "WITHDRAWAL_FEE": (5.00, "Fixed withdrawal fee in USD"),
    "DAILY_INTEREST_RATE": (0.5, "Daily interest rate as percentage (e.g., 0.5 for 0.5%)"),
    "WITHDRAWAL_FEE_PERCENT": (2.0, "Withdrawal fee as percentage (e.g., 2.0 for 2%)"),
    "MIN_INVESTMENT_AMOUNT": (100.00, "Minimum investment amount in USD"),
    "MAINTENANCE_MODE": (False, "Enable maintenance mode to disable new investments"),
}

CONSTANCE_IGNORE_ADMIN_VERSION_CHECK = True

CONSTANCE_CONFIG_FIELDSETS = {
    "Financial Settings": (
        "MIN_DEPOSIT",
        "WITHDRAWAL_FEE",
        "DAILY_INTEREST_RATE",
        "WITHDRAWAL_FEE_PERCENT",
        "MIN_INVESTMENT_AMOUNT",
    ),
    "System Settings": ("SITE_NAME", "MAINTENANCE_MODE"),
}

# ------------------------------------------------------------------
# Django Unfold Configuration (Modern Dashboard UI)
# ------------------------------------------------------------------
UNFOLD = {
    "SITE_TITLE": "WolvCapital Command Center",
    "SITE_HEADER": "WolvCapital Administration",
    "SITE_URL": "/",
    "SITE_ICON": {
        "light": "/static/admin/img/logo-light.svg",
        "dark": "/static/admin/img/logo-dark.svg",
    },
    "SITE_LOGO": {
        "light": "/static/admin/img/logo-light.svg",
        "dark": "/static/admin/img/logo-dark.svg",
    },
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "32x32",
            "href": "/static/admin/img/favicon-32x32.png",
            "type": "image/png",
        },
    ],
    "SHOW_HISTORY": True,
    "SHOW_ACTIONS_CONFIRM": True,
    "SHOW_VIEW_ON_SITE": True,
    "THEME": "dark",
    "STYLES": [
        lambda request: "/static/admin/css/custom.css" if request.user.is_superuser else "",
    ],
    "SCRIPTS": [
        lambda request: "/static/admin/js/custom.js" if request.user.is_superuser else "",
    ],
    "COLORS": {
        "primary": {
            "50": "245 243 255",
            "100": "241 237 252",
            "200": "233 230 255",
            "300": "216 207 255",
            "400": "196 181 253",
            "500": "168 147 255",
            "600": "147 128 255",
            "700": "126 105 255",
            "800": "110 89 255",
            "900": "88 28 135",
            "950": "59 7 100",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇺🇸",
                "fr": "🇫🇷",
                "es": "🇪🇸",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Dashboard",
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": "Dashboard",
                        "icon": "dashboard",
                        "link": "/admin/",
                    },
                    {
                        "title": "System Status",
                        "icon": "settings",
                        "link": "/admin/system-status/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
            {
                "title": "Financial Operations",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Transactions",
                        "icon": "payment",
                        "link": "/admin/transactions/transaction/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": "Virtual Cards",
                        "icon": "credit_card",
                        "link": "/admin/transactions/virtualcard/",
                    },
                    {
                        "title": "Crypto Wallets",
                        "icon": "account_balance_wallet",
                        "link": "/admin/transactions/cryptocurrencywallet/",
                    },
                    {
                        "title": "Financial Settings",
                        "icon": "settings",
                        "link": "/admin/constance/config/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
            {
                "title": "User Management",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Users",
                        "icon": "people",
                        "link": "/admin/users/user/",
                    },
                    {
                        "title": "User Profiles",
                        "icon": "person",
                        "link": "/admin/users/userprofile/",
                    },
                    {
                        "title": "User Wallets",
                        "icon": "account_balance",
                        "link": "/admin/users/userwallet/",
                    },
                ],
            },
            {
                "title": "KYC Verification",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "KYC Applications",
                        "icon": "verified_user",
                        "link": "/admin/users/kycapplication/",
                    },
                    {
                        "title": "KYC Documents",
                        "icon": "description",
                        "link": "/admin/users/kycdocument/",
                    },
                ],
            },
            {
                "title": "Investments",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Investment Plans",
                        "icon": "trending_up",
                        "link": "/admin/investments/investmentplan/",
                    },
                    {
                        "title": "User Investments",
                        "icon": "savings",
                        "link": "/admin/investments/userinvestment/",
                    },
                ],
            },
            {
                "title": "Communications",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Send Email",
                        "icon": "mail",
                        "link": "/admin/users/user/send-email/",
                    },
                    {
                        "title": "Email Inbox",
                        "icon": "inbox",
                        "link": "/admin/core/emailinbox/",
                    },
                    {
                        "title": "Email Templates",
                        "icon": "edit_note",
                        "link": "/admin/core/emailtemplate/",
                    },
                    {
                        "title": "Support Requests",
                        "icon": "support_agent",
                        "link": "/admin/core/supportrequest/",
                    },
                ],
            },
            {
                "title": "Referrals",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Referral Codes",
                        "icon": "share",
                        "link": "/admin/referrals/referralcode/",
                    },
                    {
                        "title": "Referrals",
                        "icon": "group_add",
                        "link": "/admin/referrals/referral/",
                    },
                    {
                        "title": "Referral Rewards",
                        "icon": "card_giftcard",
                        "link": "/admin/referrals/referralreward/",
                    },
                ],
            },
        ],
    },
    "TABS": [
        {
            "models": [
                "users.user",
                "users.profile",
                "users.userwallet",
            ],
            "items": [
                {
                    "title": "Users",
                    "link": "/admin/users/user/",
                },
                {
                    "title": "Profiles",
                    "link": "/admin/users/userprofile/",
                },
                {
                    "title": "Wallets",
                    "link": "/admin/users/userwallet/",
                },
            ],
        },
    ],
}

# ------------------------------------------------------------------
# REST Framework Configuration
# ------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "wolvcapital.authentication.RlsJwtAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}

# ------------------------------------------------------------------
# Simple JWT Configuration
# ------------------------------------------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
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
    "core.middleware.RequestIDMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    # 1. Authentication must happen first
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    # 2. Custom middlewares that need the 'user' attribute
    "wolvcapital.middleware.RequestIDMiddleware",
    "wolvcapital.middleware.LanguageMiddleware",
    "wolvcapital.middleware.PostgresRlsSessionMiddleware",
    # 3. Remaining standard Django and Third-party apps
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]
# ------------------------------------------------------------------
# Database (PostgreSQL via DATABASE_URL)
# ------------------------------------------------------------------
DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

DATABASES = {
    "default": dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        ssl_require=not DATABASE_URL.startswith("sqlite"),
    ),
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
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

TESTING = any(arg in os.environ.get("PYTEST_CURRENT_TEST", "") for arg in ["::"]) or any(
    c in " ".join(sys.argv) for c in ["test", "pytest"]
)

BRAND = {
    "name": "WolvCapital",
    "domain": "wolvcapital.com",
    "primary": "#000000",
    "logo_svg": "logo.svg",
}


STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

MEDIA_URL = "/media/"
MEDIA_ROOT_PATH = BASE_DIR / "media"
MEDIA_ROOT = str(MEDIA_ROOT_PATH)

# ------------------------------------------------------------------
# Logging Configuration (Production Silent Logging)
# ------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": "django.log",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console", "file"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

# ------------------------------------------------------------------
# Auth / Allauth
# ------------------------------------------------------------------
AUTH_USER_MODEL = "users.User"  # Always app_label.ModelName

# Authentication backends
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Ensure DJANGO_SETTINGS_MODULE is set for shell/tests
if not os.environ.get("DJANGO_SETTINGS_MODULE"):
    os.environ["DJANGO_SETTINGS_MODULE"] = "wolvcapital.settings"

# Frontend URLs (Next.js handles all user-facing pages)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

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

# Anymail configuration (Resend)
ANYMAIL = {
    "RESEND_API_KEY": os.getenv("RESEND_API_KEY"),
}

# Email backend selection based on environment
email_backend_override = os.getenv("EMAIL_BACKEND")
if email_backend_override:
    EMAIL_BACKEND = email_backend_override
else:
    if DEBUG:
        # Development: Print emails to console
        EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    elif RESEND_API_KEY:
        # Production: Prefer Resend (Anymail) if configured
        EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"
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
EMAIL_PORT = int(str(os.getenv("SMTP_PORT") or os.getenv("EMAIL_PORT") or "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_USER") or os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS") or os.getenv("EMAIL_HOST_PASSWORD")
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
        "legal@wolvcapital.com,admin@wolvcapital.com",
    ).split(",")
    if email.strip()
]

# Base URLs for backend and public-facing site
PUBLIC_SITE_URL = os.getenv("PUBLIC_SITE_URL", "https://wolvcapital.com")

# Site URL for email links
# NOTE: Must always be a string (used in email templates/headers).
SITE_URL: str = os.getenv("SITE_URL") or PUBLIC_SITE_URL
SITE_URL = str(SITE_URL)

ADMIN_SITE_URL = os.getenv("ADMIN_SITE_URL", SITE_URL)

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
INBOX_SYNC_LIMIT = int(os.getenv("INBOX_SYNC_LIMIT", "200"))  # Max emails per sync
INBOX_AUTO_SYNC = os.getenv("INBOX_AUTO_SYNC", "TRUE").lower() == "true"  # Enable cron sync

# ------------------------------------------------------------------
# I18N / TZ
# ------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Supported languages matching frontend i18n
LANGUAGES = [
    ("en", "English"),
    ("de", "German"),
    ("es", "Spanish"),
    ("fr", "French"),
    ("it", "Italian"),
    ("pt", "Portuguese"),
    ("ru", "Russian"),
    ("no", "Norwegian"),
]

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]

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

        from core.middleware import get_request_id

        # local import to avoid circular
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
        # Suppress verbose Django loggers to avoid Railway rate limits
        "django.server": {
            "handlers": ["console"],
            "level": "WARNING",  # Only log warnings/errors, not every HTTP request
            "propagate": False,
        },
        "django.db": {
            "handlers": ["console"],
            "level": "WARNING",  # Suppress database query logs
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "WARNING",  # Suppress detailed DB backend logs
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "WARNING",  # Only log warnings/errors for requests
            "propagate": False,
        },
        "django.security": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        # Suppress verbose third-party loggers
        "rest_framework": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "urllib3": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "asyncio": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "google": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        # Application loggers
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
# Enable security features only in production (when DEBUG=False)
# In development (DEBUG=True), these are intentionally disabled for localhost testing

# SSL/HTTPS redirect - enabled in production via environment variable or when DEBUG=False
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=not DEBUG)

# Secure cookies - overrideable via env for deployments
SESSION_COOKIE_SECURE = env.bool("SESSION_COOKIE_SECURE", default=not DEBUG)
CSRF_COOKIE_SECURE = env.bool("CSRF_COOKIE_SECURE", default=not DEBUG)

# HSTS Security (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Additional security headers
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_BROWSER_XSS_FILTER = True

# Additional cookie security
# NOTE: CSRF cookie must be readable by frontend to set X-CSRFToken.
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_HTTPONLY = True

# ------------------------------------------------------------------
# Cookie / CSRF tweaks for cross-site frontend
# ------------------------------------------------------------------
SESSION_COOKIE_SAMESITE = env(
    "SESSION_COOKIE_SAMESITE",
    default=("None" if not DEBUG else "Lax"),
)
CSRF_COOKIE_SAMESITE = env(
    "CSRF_COOKIE_SAMESITE",
    default=("None" if not DEBUG else "Lax"),
)
CSRF_USE_SESSIONS = False

# Session basics
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # Use database-backed sessions
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = True  # Save session on every request to maintain login
SESSION_COOKIE_NAME = "wolvcapital_sessionid"
SESSION_COOKIE_DOMAIN = None  # Let Django handle this automatically
# ... last existing line in settings.py ...

TRUSTPILOT_BCC_ADDRESS = "wolvcapital.com+bebbe29c9e@invite.trustpilot.com"

# ------------------------------------------------------------------
# Djoser Configuration
# ------------------------------------------------------------------
DJOSER = {
    "LOGIN_FIELD": "email",
    "USER_CREATE_PASSWORD_RETYPE": False,
    "SERIALIZERS": {},
}
