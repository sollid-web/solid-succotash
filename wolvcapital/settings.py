# ---------- Render / Production Hardening ----------
from __future__ import annotations

import os
import sys
from pathlib import Path
from urllib.parse import urlparse

# Load env file (optional locally)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Optional DB URL parser
try:
    import dj_database_url  # pip install dj-database-url
except Exception:  # pragma: no cover
    dj_database_url = None  # type: ignore

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# Core flags / secrets
# ------------------------------------------------------------------
DEBUG = os.getenv("DEBUG", "0") == "1"  # default secure (False)
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "wolvcapital-secure-2025-k8j9#mN2$pQ7!vX3&bR6@wE9*tY5^hU8%fG4+cZ1-nA0=sD7~lM3",
)

# Render-provided values
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL")
RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")
CUSTOM_DOMAIN = os.getenv("CUSTOM_DOMAIN")  # comma-separated

# ------------------------------------------------------------------
# Hosts & CSRF
# ------------------------------------------------------------------
ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1", "testserver", ".onrender.com"]
CSRF_TRUSTED_ORIGINS: list[str] = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# GitHub Codespaces support
CODESPACES_DOMAIN = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
IN_CODESPACES = bool(CODESPACES_DOMAIN or os.getenv("CODESPACES") or os.getenv("GITHUB_CODESPACES"))
if IN_CODESPACES:
    ALLOWED_HOSTS += [".app.github.dev"]
    CSRF_TRUSTED_ORIGINS += ["https://*.app.github.dev"]
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = None  # allow cookies in embedded preview

# Render explicit URL (e.g. https://solid-succotash-654g.onrender.com)
if RENDER_EXTERNAL_URL:
    p = urlparse(RENDER_EXTERNAL_URL)
    if p.hostname and p.hostname not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(p.hostname)
    if RENDER_EXTERNAL_URL not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(RENDER_EXTERNAL_URL)

# Render hostname fallback
if RENDER_EXTERNAL_HOSTNAME and RENDER_EXTERNAL_HOSTNAME not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
    https_origin = f"https://{RENDER_EXTERNAL_HOSTNAME}"
    if https_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(https_origin)

# Custom domain(s)
if CUSTOM_DOMAIN:
    for d in [x.strip() for x in CUSTOM_DOMAIN.split(",") if x.strip()]:
        if d not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(d)
        # also trust www/apex variants
        alt = d[4:] if d.startswith("www.") else f"www.{d}"
        if alt not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(alt)
        for host in {d, alt}:
            origin = f"https://{host}"
            if origin not in CSRF_TRUSTED_ORIGINS:
                CSRF_TRUSTED_ORIGINS.append(origin)

# Extra overrides via env (comma-separated)
extra_hosts = os.getenv("ALLOWED_HOSTS_EXTRA", "")
if extra_hosts:
    ALLOWED_HOSTS += [h.strip() for h in extra_hosts.split(",") if h.strip()]

extra_origins = os.getenv("CSRF_TRUSTED_ORIGINS_EXTRA", "")
if extra_origins:
    CSRF_TRUSTED_ORIGINS += [o.strip() for o in extra_origins.split(",") if o.strip()]

# Trust proxy TLS
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ------------------------------------------------------------------
# Installed apps / middleware
# ------------------------------------------------------------------
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",  # required by allauth

    # Third-party
    "whitenoise.runserver_nostatic",
    "allauth",
    "allauth.account",
    # "allauth.socialaccount",  # enable if needed

    # Local apps
    "core",
    "users",
    "investments",
    "transactions",
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "wolvcapital.middleware.RequestIDMiddleware",  # ensure this exists or remove
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
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
        p = urlparse(os.environ["DATABASE_URL"])
        db_name = p.path.lstrip("/") if p.path else ""
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.postgresql",
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
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ------------------------------------------------------------------
# Templates
# ------------------------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",  # required by allauth
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.i18n",
                "core.context_processors.brand_context",
            ],
        },
    },
]

# ------------------------------------------------------------------
# URL / WSGI
# ------------------------------------------------------------------
ROOT_URLCONF = "wolvcapital.urls"
WSGI_APPLICATION = "wolvcapital.wsgi.application"

# ------------------------------------------------------------------
# Static & media (WhiteNoise)
# ------------------------------------------------------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

TESTING = any(a in " ".join(sys.argv) for a in ["test", "pytest"])
if not DEBUG and not TESTING:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    WHITENOISE_MANIFEST_STRICT = False

# ------------------------------------------------------------------
# Branding
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
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]
SITE_ID = 1
LOGIN_URL = "/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"  # change to "mandatory" if you require it
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True

# ------------------------------------------------------------------
# Email (SendGrid)
# ------------------------------------------------------------------
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"  # pip install django-sendgrid-v5
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
SENDGRID_SANDBOX_MODE_IN_DEBUG = False
SENDGRID_ECHO_TO_STDOUT = True

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@wolvcapital.com")
SERVER_EMAIL = DEFAULT_FROM_EMAIL

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@wolvcapital.com")
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "support@wolvcapital.com")
COMPLIANCE_EMAIL = os.getenv("COMPLIANCE_EMAIL", "compliance@wolvcapital.com")
LEGAL_EMAIL = os.getenv("LEGAL_EMAIL", "legal@wolvcapital.com")
PRIVACY_EMAIL = os.getenv("PRIVACY_EMAIL", "privacy@wolvcapital.com")
MARKETING_EMAIL = os.getenv("MARKETING_EMAIL", "marketing@wolvcapital.com")

if not SENDGRID_API_KEY:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    # Light signal in logs; avoid printing full secrets
    print(f"✅ SendGrid configured (key starts with: {SENDGRID_API_KEY[:10]}...)")

# ------------------------------------------------------------------
# I18N / TZ
# ------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = os.getenv("LOG_FORMAT", "json")  # 'json' or 'plain'


class JsonFormatter:
    def format(self, record) -> str:  # pragma: no cover
        import datetime
        import json
        from wolvcapital.middleware import get_request_id  # avoid circular

        rid = get_request_id()
        data = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": datetime.datetime.now(datetime.UTC).isoformat(),
        }
        if rid:
            data["request_id"] = rid
        if record.exc_info:
            import traceback
            data["exc"] = "".join(traceback.format_exception(*record.exc_info))
        return json.dumps(data, ensure_ascii=False)


if LOG_FORMAT == "json" and not DEBUG:
    SIMPLE_FORMATTER = {"()": JsonFormatter}
else:
    SIMPLE_FORMATTER = {
        "format": "[%(asctime)s] %(levelname)s %(name)s: %(message)s",
        "datefmt": "%Y-%m-%dT%H:%M:%SZ",
    }

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"simple": SIMPLE_FORMATTER},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "simple"}},
    "root": {"handlers": ["console"], "level": LOG_LEVEL},
    "loggers": {
        "django": {"handlers": ["console"], "level": LOG_LEVEL, "propagate": False},
        "wolvcapital": {"handlers": ["console"], "level": LOG_LEVEL, "propagate": False},
    },
}

# ------------------------------------------------------------------
# Security (production)
# ------------------------------------------------------------------
SECURE_SSL_REDIRECT = not DEBUG and not IN_CODESPACES and "pytest" not in " ".join(sys.argv)
SESSION_COOKIE_SECURE = not DEBUG and not IN_CODESPACES
CSRF_COOKIE_SECURE = not DEBUG and not IN_CODESPACES

SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_BROWSER_XSS_FILTER = True

# Cookie security
CSRF_COOKIE_HTTPONLY = True      # keep cookie unreadable to JS (safer)
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_USE_SESSIONS = False

# Sessions
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = True
SESSION_COOKIE_NAME = "wolvcapital_sessionid"
SESSION_COOKIE_DOMAIN = None
