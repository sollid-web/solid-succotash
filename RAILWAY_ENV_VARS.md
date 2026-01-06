# Railway Environment Variables Reference

Copy and configure these environment variables in your Railway dashboard.

## 🔧 How to Set Variables in Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project → Django service
3. Click **"Variables"** tab
4. Click **"+ New Variable"**
5. Paste variable name and value
6. Click **"Add"**

## 📋 Required Variables

### Django Core Settings

```bash
# CRITICAL: Generate a unique 50+ character random string
# Use: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY=django-insecure-REPLACE-WITH-RANDOM-50-CHAR-STRING

# Production mode (always 0 for Railway)
DEBUG=0

# Django settings module
DJANGO_SETTINGS_MODULE=wolvcapital.settings
```

### Database Configuration

```bash
# Railway auto-generates this when you add PostgreSQL
# Reference the PostgreSQL service variable
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Domain & CORS Settings

```bash
# Update with your actual Railway domain after deployment
# Format: your-service-name-production.up.railway.app
ALLOWED_HOSTS=wolvcapital-production.up.railway.app,api.wolvcapital.com

# Frontend domains (update with your Vercel domain)
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com

# Must include ALL domains that will make requests
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://wolvcapital-production.up.railway.app,https://api.wolvcapital.com

# Custom domain for API (optional, after DNS setup)
CUSTOM_DOMAIN=api.wolvcapital.com
```

### Application URLs

```bash
# Next.js frontend URL (where users access the site)
FRONTEND_URL=https://wolvcapital.com
PUBLIC_SITE_URL=https://wolvcapital.com

# Django backend URL (where admins access Django admin)
ADMIN_SITE_URL=https://api.wolvcapital.com
```

### Email Configuration (Resend)

```bash
# Get API key from https://resend.com/api-keys
# Format: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE

# Sender email (must be verified in Resend)
DEFAULT_FROM_EMAIL=WolvCapital <support@mail.wolvcapital.com>

# Optional: Server error emails
SERVER_EMAIL=server@wolvcapital.com

# Optional: Admin notification email
ADMIN_EMAIL=admin@wolvcapital.com
```

### Performance Settings

```bash
# Number of Gunicorn worker processes
# Formula: (2 * CPU cores) + 1
# Railway Starter: 1-2 workers recommended
WEB_CONCURRENCY=2
```

## 🔐 Optional Security Variables

```bash
# Force HTTPS redirects (Railway handles SSL automatically)
SECURE_SSL_REDIRECT=1

# Session cookie security (Railway uses HTTPS)
SESSION_COOKIE_SECURE=1
CSRF_COOKIE_SECURE=1

# HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=1
```

## 🌍 Optional Feature Flags

```bash
# Enable admin notifications for new transactions
ENABLE_ADMIN_NOTIFICATIONS=1

# Enable user email notifications
ENABLE_USER_NOTIFICATIONS=1

# Enable referral system (if implemented)
ENABLE_REFERRALS=0
```

## 📊 Complete Production Configuration

Here's a complete copy-paste template for Railway:

```bash
# === Django Core ===
SECRET_KEY=<generate-with-command-below>
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings

# === Database ===
DATABASE_URL=${{Postgres.DATABASE_URL}}

# === Domains ===
ALLOWED_HOSTS=wolvcapital-production.up.railway.app,api.wolvcapital.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://wolvcapital-production.up.railway.app,https://api.wolvcapital.com
CUSTOM_DOMAIN=api.wolvcapital.com

# === Application URLs ===
FRONTEND_URL=https://wolvcapital.com
PUBLIC_SITE_URL=https://wolvcapital.com
ADMIN_SITE_URL=https://api.wolvcapital.com

# === Email (Resend) ===
RESEND_API_KEY=re_YOUR_API_KEY_HERE
DEFAULT_FROM_EMAIL=WolvCapital <support@mail.wolvcapital.com>
SERVER_EMAIL=server@wolvcapital.com
ADMIN_EMAIL=admin@wolvcapital.com

# === Performance ===
WEB_CONCURRENCY=2

# === Security ===
SECURE_SSL_REDIRECT=1
SESSION_COOKIE_SECURE=1
CSRF_COOKIE_SECURE=1
```

## 🔑 Generate SECRET_KEY

**Option 1: Python Command**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Option 2: Online Generator**
```bash
# Use: https://djecrety.ir/
# Generate a new key and copy it
```

**Option 3: OpenSSL**
```bash
openssl rand -base64 50
```

## 🎯 Variable Priorities

### Must Set Before First Deploy
1. `SECRET_KEY` - Security critical
2. `DEBUG=0` - Production safety
3. `DATABASE_URL` - Database connection
4. `ALLOWED_HOSTS` - HTTP host validation
5. `RESEND_API_KEY` - Email functionality

### Set After Initial Deploy
1. `CORS_ALLOWED_ORIGINS` - After frontend deployed
2. `CUSTOM_DOMAIN` - After DNS configured
3. `CSRF_TRUSTED_ORIGINS` - After testing domains

### Optional Enhancements
1. `WEB_CONCURRENCY` - Performance tuning
2. `ENABLE_*` flags - Feature toggles
3. Security headers - HSTS, etc.

## 🔄 Updating Variables

**After changing variables in Railway**:
1. Railway automatically redeploys your service
2. New deployment uses updated variables
3. No manual restart needed

**To force redeploy without changes**:
```bash
railway up --detach
```

## 📝 Variable Naming Conventions

- `*_URL` - Full URLs with protocol (https://)
- `*_ORIGINS` - Comma-separated list of domains
- `*_HOSTS` - Comma-separated hostnames (no protocol)
- `*_EMAIL` - Email addresses
- `ENABLE_*` - Boolean flags (0 or 1)

## 🧪 Testing Variables

After deployment, verify settings:

```bash
# Via Railway CLI
railway run python manage.py check --deploy

# Check specific setting
railway run python manage.py shell
>>> from django.conf import settings
>>> print(settings.DEBUG)  # Should be False
>>> print(settings.ALLOWED_HOSTS)
>>> print(settings.DATABASES['default']['NAME'])
```

## ⚠️ Common Mistakes

1. **Forgetting to update ALLOWED_HOSTS** after getting Railway domain
   - Symptom: 400 Bad Request errors
   - Fix: Add Railway domain to ALLOWED_HOSTS

2. **Mismatched CORS and CSRF origins**
   - Symptom: CSRF verification failed
   - Fix: Ensure all frontend domains in both variables

3. **Missing DATABASE_URL reference**
   - Symptom: Database connection errors
   - Fix: Use `${{Postgres.DATABASE_URL}}` syntax

4. **DEBUG=1 in production**
   - Symptom: Security warnings, sensitive data exposed
   - Fix: Always set DEBUG=0 for production

## 🔗 Related Documentation

- [Railway Variables Docs](https://docs.railway.app/develop/variables)
- [Django Settings Reference](https://docs.djangoproject.com/en/5.0/ref/settings/)
- [WolvCapital Deployment Guide](./RAILWAY_DEPLOYMENT.md)

---

**Quick Start Command**:
```bash
# Set all variables at once via Railway CLI
railway variables set SECRET_KEY=<your-key> DEBUG=0 DJANGO_SETTINGS_MODULE=wolvcapital.settings
```
