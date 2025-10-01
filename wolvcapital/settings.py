# ---------- Render / Production Hardening ----------
import os
from pathlib import Path
from urllib.parse import urlparse
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------
# Core flags / secrets
# ------------------------------------------------------------------
DEBUG = os.getenv("DEBUG", "0") == "1"
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-change-me")

# Render injects this, e.g. https://solid-succotash-654g.onrender.com
RENDER_EXTERNAL_URL = os.getenv("RENDER_EXTERNAL_URL")
CUSTOM_DOMAIN = os.getenv("CUSTOM_DOMAIN")  # optional

# ------------------------------------------------------------------
# Hosts & CSRF
# ------------------------------------------------------------------
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
CSRF_TRUSTED_ORIGINS = []

if RENDER_EXTERNAL_URL:
    p = urlparse(RENDER_EXTERNAL_URL)
    if p.hostname:
        ALLOWED_HOSTS.append(p.hostname)
    # CSRF expects full origins with scheme
    CSRF_TRUSTED_ORIGINS.append(RENDER_EXTERNAL_URL)

if CUSTOM_DOMAIN:
    ALLOWED_HOSTS.append(CUSTOM_DOMAIN)
    CSRF_TRUSTED_ORIGINS.append(f"https://{CUSTOM_DOMAIN}")

# Optional extras
extra_hosts = os.getenv("ALLOWED_HOSTS_EXTRA", "")
if extra_hosts:
    ALLOWED_HOSTS += [h.strip() for h in extra_hosts.split(",") if h.strip()]

extra_origins = os.getenv("CSRF_TRUSTED_ORIGINS_EXTRA", "")
if extra_origins:
    CSRF_TRUSTED_ORIGINS += [o.strip() for o in extra_origins.split(",") if o.strip()]

# Trust Render's TLS termination
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
    "whitenoise.runserver_nostatic",  # keeps runserver simple + consistent
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
    "whitenoise.middleware.WhiteNoiseMiddleware",  # serve static files
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "wolvcapital.urls"
WSGI_APPLICATION = "wolvcapital.wsgi.application"
ASGI_APPLICATION = "wolvcapital.asgi.application"

# ------------------------------------------------------------------
# Database (Postgres in prod, SQLite locally)
# ------------------------------------------------------------------
if os.getenv("DATABASE_URL"):
    DATABASES = {
        "default": dj_database_url.parse(
            os.environ["DATABASE_URL"], conn_max_age=600, ssl_require=True
        )
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
            ],
        },
    },
]

# ------------------------------------------------------------------
# Static & media
# ------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# If you DON'T have a ./static folder, keep this line commented to avoid W004:
# STATICFILES_DIRS = [BASE_DIR / "static"]

if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ------------------------------------------------------------------
# Auth / Allauth
# ------------------------------------------------------------------
AUTH_USER_MODEL = "users.User"
LOGIN_REDIRECT_URL = "/dashboard/"
LOGOUT_REDIRECT_URL = "/"

SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = True
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"

# ------------------------------------------------------------------
# Email (dev default; switch to SMTP provider in prod)
# ------------------------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ------------------------------------------------------------------
# I18N / TZ
# ------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------------
# Prod hardening (safe defaults)
# ------------------------------------------------------------------
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Enable HSTS after confirming HTTPS works end-to-end
    SECURE_HSTS_SECONDS = int(os.getenv("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    X_FRAME_OPTIONS = "DENY"
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# CSRF approach (cookie readable; simplest for fetch/axios)
CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False

# Session basics
SESSION_COOKIE_AGE = 60 * 60 * 24 * 7  # 7 days
SESSION_SAVE_EVERY_REQUEST = False
