# Railway Deployment - Quick Start

Deploy WolvCapital to Railway in 15 minutes.

## ⚡ Prerequisites

- Railway account ([signup here](https://railway.app))
- GitHub repository connected
- Resend API key ([get here](https://resend.com/api-keys))

## 🚀 Deployment Steps

### 1. Create Railway Project (2 min)

```bash
# Install Railway CLI (optional but recommended)
npm i -g @railway/cli

# Login
railway login

# Initialize in project directory
cd e:\solid-web\solid-succotash
railway init
```

**Or via Dashboard**:
1. Go to https://railway.app/new
2. Select "Deploy from GitHub repo"
3. Choose `solid-succotash` repository

### 2. Add PostgreSQL Database (1 min)

```bash
# Via CLI
railway add --database postgresql

# Or via Dashboard
# Click "+ New" → "Database" → "PostgreSQL"
```

### 3. Set Environment Variables (5 min)

```bash
# Generate SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Set variables via CLI
railway variables set SECRET_KEY="<generated-key>"
railway variables set DEBUG="0"
railway variables set DJANGO_SETTINGS_MODULE="wolvcapital.settings"
railway variables set RESEND_API_KEY="re_YOUR_KEY"
railway variables set DEFAULT_FROM_EMAIL="WolvCapital <support@wolvcapital.com>"
railway variables set WEB_CONCURRENCY="2"
```

**Critical Variables**:
- ✅ `SECRET_KEY` - Generated above
- ✅ `DEBUG=0` - Production mode
- ✅ `RESEND_API_KEY` - From resend.com
- ✅ `DATABASE_URL` - Auto-set by Railway

### 4. Deploy (2 min)

```bash
# Via CLI
railway up

# Or push to GitHub
git add .
git commit -m "Configure Railway deployment"
git push origin main
```

Railway will automatically:
- Install dependencies
- Run migrations
- Seed investment plans
- Start Gunicorn server

### 5. Get Your Domain & Update Settings (3 min)

After deployment completes:

```bash
# Get your Railway domain
railway domain

# Example output: wolvcapital-production.up.railway.app
```

Update these variables:

```bash
railway variables set ALLOWED_HOSTS="wolvcapital-production.up.railway.app"
railway variables set CORS_ALLOWED_ORIGINS="https://wolvcapital.com"
railway variables set CSRF_TRUSTED_ORIGINS="https://wolvcapital.com,https://wolvcapital-production.up.railway.app"
railway variables set FRONTEND_URL="https://wolvcapital.com"
railway variables set PUBLIC_SITE_URL="https://wolvcapital.com"
railway variables set ADMIN_SITE_URL="https://wolvcapital-production.up.railway.app"
```

### 6. Create Admin User (2 min)

```bash
railway run python manage.py createsuperuser
```

Enter:
- Email: your.email@example.com
- Password: (strong password)
- Confirm password

## ✅ Verify Deployment

### Test Health Endpoint

```bash
curl https://wolvcapital-production.up.railway.app/healthz/
```

Expected response:
```json
{"status": "ok", "environment": "production"}
```

### Check Investment Plans

```bash
railway run python manage.py shell -c "from investments.models import InvestmentPlan; print(f'Plans: {InvestmentPlan.objects.count()}')"
```

Expected: `Plans: 4`

### Access Admin Panel

Visit: `https://wolvcapital-production.up.railway.app/admin/`

Login with superuser credentials.

## 🌐 Add Custom Domain (Optional)

### 1. Configure in Railway

```bash
railway domain add api.wolvcapital.com
```

Railway provides DNS records (CNAME).

### 2. Update DNS

In your domain registrar (e.g., Namecheap, Cloudflare):

```
Type: CNAME
Name: api
Value: wolvcapital-production.up.railway.app
TTL: 3600
```

### 3. Update Environment Variables

```bash
railway variables set ALLOWED_HOSTS="api.wolvcapital.com,wolvcapital-production.up.railway.app"
railway variables set ADMIN_SITE_URL="https://api.wolvcapital.com"
```

DNS propagation takes 5-60 minutes.

## 📊 View Logs

```bash
# Real-time logs
railway logs

# Or via dashboard
# Project → Service → Deployments → View Logs
```

## 🔧 Common Issues

### 1. Migration Failures

```bash
railway run python manage.py migrate --noinput
railway run python manage.py seed_plans
```

### 2. Missing Investment Plans

```bash
railway run python manage.py seed_plans
```

### 3. Static Files Not Loading

```bash
railway run python manage.py collectstatic --noinput
```

### 4. CORS Errors

Check frontend domain is in `CORS_ALLOWED_ORIGINS`:

```bash
railway variables get CORS_ALLOWED_ORIGINS
```

Should include your Vercel domain (e.g., `https://wolvcapital.com`).

### 5. CSRF Verification Failed

Ensure frontend domain in `CSRF_TRUSTED_ORIGINS`:

```bash
railway variables set CSRF_TRUSTED_ORIGINS="https://wolvcapital.com,https://wolvcapital-production.up.railway.app"
```

## 📱 Next Steps

After successful deployment:

1. ✅ **Deploy Frontend**: Deploy Next.js to Vercel
2. ✅ **Configure Domains**: Set up custom domains
3. ✅ **Test Email**: Send test transaction notification
4. ✅ **Create Test Users**: Test full user workflow
5. ✅ **Enable Monitoring**: Set up error tracking (optional)

## 📚 Full Documentation

- [Complete Railway Guide](./RAILWAY_DEPLOYMENT.md)
- [Environment Variables Reference](./RAILWAY_ENV_VARS.md)
- [Project Architecture](./ARCHITECTURE_DIAGRAM.md)

## 🆘 Get Help

- **Railway Logs**: `railway logs`
- **Railway Support**: [Discord](https://discord.gg/railway)
- **Django Shell**: `railway run python manage.py shell`

---

**Deployment Time**: ~15 minutes
**Cost**: $5-20/month (Railway Hobby/Pro plan)
**Scaling**: Automatic with Railway
