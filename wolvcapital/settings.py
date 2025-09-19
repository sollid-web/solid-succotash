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
