# ---------- Render / Production Hardening ----------
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file if it exists
env_file = BASE_DIR / ".env"
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key.strip(), value.strip())

# Base flags
DEBUG = os.getenv("DEBUG", "0") == "1"
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-change-me")  # replaced in Render env
RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME")  # Render injects this
CUSTOM_DOMAIN = os.getenv("CUSTOM_DOMAIN")  # optional: e.g., "example.com"

# Hosts & CSRF
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)
if CUSTOM_DOMAIN:
    ALLOWED_HOSTS.append(CUSTOM_DOMAIN)

# Optional: allow manually-specified extra hosts via env
extra_hosts = os.getenv("ALLOWED_HOSTS_EXTRA", "")
if extra_hosts:
    ALLOWED_HOSTS.extend([host.strip() for host in extra_hosts.split(",")])

# Keep Railway compatibility (optional)
RAILWAY_HOSTS = [".railway.app", ".up.railway.app"]
if "RAILWAY_ENVIRONMENT" in os.environ:
    ALLOWED_HOSTS.extend(RAILWAY_HOSTS)
    if "RAILWAY_PUBLIC_DOMAIN" in os.environ:
        ALLOWED_HOSTS.append(os.environ["RAILWAY_PUBLIC_DOMAIN"])

CSRF_TRUSTED_ORIGINS = []
if RENDER_EXTERNAL_HOSTNAME:
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_EXTERNAL_HOSTNAME}")
if CUSTOM_DOMAIN:
    CSRF_TRUSTED_ORIGINS.append(f"https://{CUSTOM_DOMAIN}")

# Extra trusted origins from env (comma-separated)
extra_origins = os.getenv("CSRF_TRUSTED_ORIGINS", "")
if extra_origins:
    CSRF_TRUSTED_ORIGINS.extend([origin.strip() for origin in extra_origins.split(",")])

# Railway convenience
if "RAILWAY_ENVIRONMENT" in os.environ:
    if "RAILWAY_PUBLIC_DOMAIN" in os.environ:
        domain = os.environ["RAILWAY_PUBLIC_DOMAIN"]
        CSRF_TRUSTED_ORIGINS.append(f"https://{domain}")

# Trust Render's TLS termination
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Production-only security
if not DEBUG:
    # Force HTTPS & HSTS (enable only when ALL traffic is HTTPS)
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))  # 1y
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Cookies over HTTPS only
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Extra headers
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
    X_FRAME_OPTIONS = "DENY"
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    # Django default: SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
    
    # Session and CSRF settings for production
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    CSRF_COOKIE_SAMESITE = 'Strict'
    SESSION_COOKIE_SAMESITE = 'Strict'
    CSRF_USE_SESSIONS = True
    
    # Helps allauth build correct absolute URLs in emails
    ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"

# Session basics (optional but recommended)
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = False

# --- INSTALLED_APPS ---
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",

    # Third-party apps
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "whitenoise.runserver_nostatic",  # WhiteNoise for static files

    # Local apps
    "core",
    "users",
    "investments",
    "transactions",
    "api",
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # For static files in production
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

# --- DATABASES ---
# Default to SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    # For production, you can manually configure database settings
    # Example for PostgreSQL:
    # DATABASES = {
    #     "default": {
    #         "ENGINE": "django.db.backends.postgresql",
    #         "NAME": os.getenv("DB_NAME"),
    #         "USER": os.getenv("DB_USER"),
    #         "PASSWORD": os.getenv("DB_PASSWORD"),
    #         "HOST": os.getenv("DB_HOST", "localhost"),
    #         "PORT": os.getenv("DB_PORT", "5432"),
    #     }
    # }
    pass

# Use SQLite for local development (fallback)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# --- TEMPLATES ---
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
            ],
        },
    },
]

# --- STATIC FILES ---
# Static files (WhiteNoise)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# --- MEDIA FILES ---
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- AUTHENTICATION ---
# AUTH_USER_MODEL = "users.User"  # Commented out - using Django's default User model
AUTH_USER_MODEL = "users.User"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"

# Django Allauth settings
SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_LOGOUT_ON_GET = True

# Email settings (for development)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# --- INTERNATIONALIZATION ---
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- DEFAULT AUTO FIELD ---
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- CORE ENTRYPOINTS ---
# Required so Django knows where the root URL configuration and WSGI/ASGI apps live.
ROOT_URLCONF = "wolvcapital.urls"
WSGI_APPLICATION = "wolvcapital.wsgi.application"
ASGI_APPLICATION = "wolvcapital.asgi.application"
