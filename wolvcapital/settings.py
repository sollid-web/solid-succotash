# --- Environment / DEBUG ---
import environ
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY", default="django-insecure-change-me-in-production")

# Never hardcode DEBUG True in production.
DEBUG = os.environ.get("DEBUG", "0") == "1"

# --- Render/Railway host detection (FIXED) ---
# Render will inject this at runtime; we use it to build ALLOWED_HOSTS & CSRF origins.
RENDER_EXTERNAL_HOSTNAME = os.environ.get("RENDER_EXTERNAL_HOSTNAME")

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]
if RENDER_EXTERNAL_HOSTNAME:
    # e.g. solid-succotash-654g.onrender.com
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# Optional: allow manually-specified extra hosts via env
ALLOWED_HOSTS += env.list("ALLOWED_HOSTS_EXTRA", default=[])

# Keep Railway compatibility (optional)
RAILWAY_HOSTS = [".railway.app", ".up.railway.app"]
if "RAILWAY_ENVIRONMENT" in os.environ:
    ALLOWED_HOSTS.extend(RAILWAY_HOSTS)
    if "RAILWAY_PUBLIC_DOMAIN" in os.environ:
        ALLOWED_HOSTS.append(os.environ["RAILWAY_PUBLIC_DOMAIN"])

# --- Proxy/HTTPS trust (apply always, not only in production) ---
# Let Django know requests are HTTPS when Render terminates SSL.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

# --- CSRF trusted origins (FIXED) ---
# Must be full origins including scheme
CSRF_TRUSTED_ORIGINS = []

if RENDER_EXTERNAL_HOSTNAME:
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_EXTERNAL_HOSTNAME}")

# Extra trusted origins from .env (comma-separated)
CSRF_TRUSTED_ORIGINS += env.list("CSRF_TRUSTED_ORIGINS", default=[])

# Railway convenience
if "RAILWAY_ENVIRONMENT" in os.environ:
    # Django needs concrete origins, not wildcards; these help only if you set a concrete public domain.
    if "RAILWAY_PUBLIC_DOMAIN" in os.environ:
        domain = os.environ["RAILWAY_PUBLIC_DOMAIN"]
        CSRF_TRUSTED_ORIGINS.append(f"https://{domain}")

# --- Production security hardening ---
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SESSION_COOKIE_AGE = 3600
    SESSION_EXPIRE_AT_BROWSER_CLOSE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_AGE = 3600
    CSRF_USE_SESSIONS = True

    # Helps allauth build correct absolute URLs in emails
    ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"

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
DATABASES = {
    "default": env.db("DATABASE_URL", default="sqlite:///db.sqlite3")
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
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# --- MEDIA FILES ---
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# --- AUTHENTICATION ---
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
