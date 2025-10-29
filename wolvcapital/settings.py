# ---------- Render / Production Hardening ----------
import os
from pathlib import Path
from urllib.parse import urlparse

# dj-database-url is optional in some environments; try to import and fall back gracefully.
try:
    import dj_database_url
except Exception:
    dj_database_url = None

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# Core flags / secrets
# ------------------------------------------------------------------
DEBUG = os.getenv("DEBUG", "0") == "1"  # Default to False for production

# Generate a secure secret key (50+ chars, high entropy)
default_secret = "wolvcapital-secure-2025-k8j9#mN2$pQ7!vX3&bR6@wE9*tY5^hU8%fG4+cZ1-nA0=sD7~lM3"
SECRET_KEY = os.getenv("SECRET_KEY", default_secret)

# Render injects this, e.g. https://solid-succotash-654g.onrender.com
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL")
# Render commonly exposes the hostname via this env var
RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")
CUSTOM_DOMAIN = os.getenv("CUSTOM_DOMAIN")  # optional, supports comma-separated list

# ------------------------------------------------------------------
# Hosts & CSRF
# ------------------------------------------------------------------
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "testserver"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:8000", "http://127.0.0.1:8000"]

# --- GitHub Codespaces support ---
CODESPACES_DOMAIN = os.getenv("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
IN_CODESPACES = bool(CODESPACES_DOMAIN or os.getenv("CODESPACES") or os.getenv("GITHUB_CODESPACES"))

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
        # If caller supplied bare apex, also trust the www subdomain (and vice versa)
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

extra_hosts = os.getenv("ALLOWED_HOSTS_EXTRA", "")
if extra_hosts:
    ALLOWED_HOSTS += [h.strip() for h in extra_hosts.split(",") if h.strip()]

extra_origins = os.getenv("CSRF_TRUSTED_ORIGINS_EXTRA", "")
if extra_origins:
    CSRF_TRUSTED_ORIGINS += [o.strip() for o in extra_origins.split(",") if o.strip()]

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
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
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
    "wolvcapital.middleware.RequestIDMiddleware",
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
        # Minimal fallback parser for DATABASE_URL when dj-database-url isn't installed.
        # Supports common PostgreSQL URLs like: postgres://user:pass@host:port/dbname
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
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Ensure STATIC_ROOT exists so whitenoise/tests don't warn about missing directory
STATIC_ROOT.mkdir(parents=True, exist_ok=True)

TESTING = any(arg in os.environ.get("PYTEST_CURRENT_TEST", "") for arg in ["::"]) or any(
    c in " ".join(os.sys.argv) for c in ["test", "pytest"]
)

if not DEBUG and not TESTING:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
    # Avoid hard 500s if a static path is referenced but missing in the manifest.
    # WhiteNoise will fall back to the un-hashed file path instead of raising ValueError.
    WHITENOISE_MANIFEST_STRICT = False

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

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

# Explicit login/logout redirect flow
LOGIN_URL = "/login/"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"

SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True

# ------------------------------------------------------------------
# Email Configuration
# ------------------------------------------------------------------
# Email backend selection based on environment
email_backend_override = os.getenv("EMAIL_BACKEND")
if email_backend_override:
    EMAIL_BACKEND = email_backend_override
elif DEBUG:
    # Development: Print emails to console
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    # Production: Use SMTP
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# SMTP Configuration (for production)
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "False").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")

# Default from email
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "WolvCapital <noreply@wolvcapital.com>")
SERVER_EMAIL = DEFAULT_FROM_EMAIL

# Email timeout (30 seconds)
EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "30"))

# Email subject prefix
EMAIL_SUBJECT_PREFIX = os.getenv("EMAIL_SUBJECT_PREFIX", "[WolvCapital] ")

# Site URL for email templates
SITE_URL = os.getenv("SITE_URL", "https://wolvcapital.com")
if RENDER_EXTERNAL_URL:
    SITE_URL = RENDER_EXTERNAL_URL
elif IN_CODESPACES and CODESPACES_DOMAIN:
    SITE_URL = f"https://{os.getenv('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN', '')}"

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

    Produces a single-line JSON object with level, message, logger, and timestamp.
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
    SIMPLE_FORMATTER = {
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
        "django": {"handlers": ["console"], "level": LOG_LEVEL, "propagate": False},
        "wolvcapital": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
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
SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1 year
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
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # Use database-backed sessions
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = True  # Save session on every request to maintain login
SESSION_COOKIE_NAME = "wolvcapital_sessionid"
SESSION_COOKIE_DOMAIN = None  # Let Django handle this automatically
