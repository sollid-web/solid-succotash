# WolvCapital Production Readiness Checklist ✅

## 🔒 Security & Environment Variables (CRITICAL)

### ✅ Completed Security Fixes:
- [x] **Hardcoded secret key removed** - Now requires `SECRET_KEY` environment variable
- [x] **Admin user creation secured** - Requires `CREATE_INITIAL_ADMIN=1` and `INITIAL_ADMIN_PASSWORD`
- [x] **Crypto wallet addresses secured** - No longer hardcoded, requires environment variables
- [x] **Production-ready start.sh script** - Conditional setup based on environment flags

### 🛡️ Required Environment Variables for Production:

**Critical Security Variables:**
```bash
SECRET_KEY=<generate-with-secrets.token_urlsafe(50)>
INITIAL_ADMIN_PASSWORD=<strong-password>  # Only for initial deployment
DATABASE_URL=<postgresql-connection-string>
```

**Email Configuration:**
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=<sendgrid-api-key>
EMAIL_USE_TLS=true
EMAIL_PORT=587
DEFAULT_FROM_EMAIL="WolvCapital <noreply@wolvcapital.com>"
```

**Domain & CORS Configuration:**
```bash
CORS_ALLOWED_ORIGINS="https://wolvcapital.com,https://www.wolvcapital.com"
CSRF_TRUSTED_ORIGINS="https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com"
ALLOWED_HOSTS="api.wolvcapital.com,wolvcapital-api.onrender.com"
CUSTOM_DOMAIN="wolvcapital.com,api.wolvcapital.com"
```

**Conditional Setup Flags (set to 0 after initial deployment):**
```bash
CREATE_INITIAL_ADMIN=0  # Set to 1 only for initial deployment
SETUP_CRYPTO_WALLETS=0  # Set to 1 only when wallet addresses are configured
```

**Crypto Wallet Addresses (when SETUP_CRYPTO_WALLETS=1):**
```bash
BTC_WALLET_ADDRESS=<real-btc-address>
ETH_WALLET_ADDRESS=<real-eth-address>
USDT_WALLET_ADDRESS=<real-usdt-address>
USDC_WALLET_ADDRESS=<real-usdc-address>
```

## 🚀 Deployment Status

### ✅ Backend (Django API) - Ready for Render.com:
- [x] **render.yaml configured** with secure environment variables
- [x] **start.sh script hardened** - No hardcoded credentials
- [x] **Database migrations verified** - All migrations up to date
- [x] **Static files collection tested** - Works with WhiteNoise
- [x] **Health check endpoint** available at `/healthz/`
- [x] **Security settings configured** for production
- [x] **Gunicorn configuration optimized**

### ✅ Frontend (Next.js) - Ready for Vercel:
- [x] **vercel.json configured** for Next.js framework
- [x] **Build process validated** - Next.js builds successfully
- [x] **Environment variables configured** for production domains
- [x] **CORS settings aligned** with backend configuration

## 📋 Pre-Deployment Steps

### 1. Generate Secret Key
```python
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 2. Set Initial Admin Password
```bash
# Generate strong password
openssl rand -base64 32
```

### 3. Configure Real Crypto Wallets (if using crypto deposits)
- Generate real wallet addresses for each supported cryptocurrency
- Test wallet accessibility and ownership
- Update environment variables accordingly

## 🌐 Deployment Commands

### Backend to Render.com:
1. **Create PostgreSQL database** on Render
2. **Create web service** from GitHub repository
3. **Set environment variables** (see list above)
4. **Deploy** - Render will run `start.sh` automatically

### Frontend to Vercel:
```bash
cd frontend
vercel --prod
```

### Post-Deployment:
1. **Update CORS_ALLOWED_ORIGINS** with actual frontend domain
2. **Set CREATE_INITIAL_ADMIN=0** to disable admin creation
3. **Test all endpoints** and functionality
4. **Monitor logs** for any errors

## 🔍 Health Checks

### Django API Health:
- `/healthz/` - Basic health check
- `/admin/` - Django admin interface
- `/api/plans/` - Public API endpoint

### Security Validation:
```bash
# Test with production settings locally
DEBUG=0 SECRET_KEY=test python manage.py check --deploy
```

## ⚠️ Important Notes

1. **Never commit real SECRET_KEY or passwords** to version control
2. **Set CREATE_INITIAL_ADMIN=0** after initial deployment
3. **Use real crypto wallet addresses** only when ready for live deposits
4. **Monitor email delivery** and SMTP configuration
5. **Test all approval workflows** after deployment

## 🎯 Production-Ready Status: ✅ READY

The WolvCapital platform is now production-ready with:
- ✅ Security hardened
- ✅ Environment variables properly configured
- ✅ Deployment scripts tested
- ✅ Database migrations verified
- ✅ Static files handling configured
- ✅ CORS and domain settings prepared

**Next Steps:** Deploy to Render.com (backend) and Vercel (frontend) following the deployment commands above.