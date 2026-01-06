# Render Environment Variables Setup

## Required Environment Variables (Set in Render Dashboard)

### 🔐 Email Configuration

**Recommended (Resend):**
```
RESEND_API_KEY=your-resend-api-key
EMAIL_BACKEND=core.email_backends.resend.ResendEmailBackend
DEFAULT_FROM_EMAIL=WolvCapital <support@mail.wolvcapital.com>
```

**SMTP fallback (SendGrid):**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.your_sendgrid_api_key_here
```

### 👤 Initial Admin Setup (Optional - for first deployment only)
```
CREATE_INITIAL_ADMIN=1
INITIAL_ADMIN_EMAIL=admin@wolvcapital.com
INITIAL_ADMIN_PASSWORD=your_secure_password_here
```

### ₿ Cryptocurrency Wallets (Optional - when ready)
```
SETUP_CRYPTO_WALLETS=1
BTC_WALLET_ADDRESS=your_btc_address
ETH_WALLET_ADDRESS=your_eth_address
USDT_WALLET_ADDRESS=your_usdt_address
USDC_WALLET_ADDRESS=your_usdc_address
```

## 📝 Deployment Checklist

### Before Deployment:
- [ ] GitHub repository pushed with latest changes ✅
- [ ] render.yaml configuration verified ✅
- [ ] requirements.txt up to date ✅
- [ ] start.sh script permissions correct ✅

### During Deployment:
- [ ] Connect GitHub repository to Render
- [ ] Deploy via Blueprint (render.yaml)
- [ ] Set RESEND_API_KEY (recommended) or SMTP fallback vars
- [ ] Optionally set admin user credentials
- [ ] Wait for build to complete (~5-10 minutes)

### After Deployment:
- [ ] Visit https://your-service-name.onrender.com/healthz/
- [ ] Check admin panel at https://your-service-name.onrender.com/admin/
- [ ] Verify investment plans at https://your-service-name.onrender.com/api/plans/
- [ ] Test API endpoints
- [ ] Update frontend CORS settings if needed

## 🔗 Custom Domain Setup (After Initial Deployment)
1. Add custom domain in Render dashboard
2. Update DNS records:
   - api.wolvcapital.com → CNAME → your-service.onrender.com
3. Render will handle SSL certificates automatically

## 🚨 Important Notes
- Database migrations run automatically via start.sh
- Investment plans are seeded on startup
- Static files collected automatically
- Health check endpoint: /healthz/
- Admin interface: /admin/