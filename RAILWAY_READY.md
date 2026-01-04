# 🚂 Railway Deployment - Complete Summary

Your WolvCapital project is now ready for Railway deployment!

## ✅ What's Been Prepared

### Configuration Files Created
1. ✅ **railway.json** - Railway deployment configuration
2. ✅ **nixpacks.toml** - Python build configuration
3. ✅ **railway_check.sh** - Pre-deployment validation (Linux/Mac)
4. ✅ **railway_check.ps1** - Pre-deployment validation (Windows)

### Documentation Created
1. ✅ **RAILWAY_DEPLOYMENT.md** - Complete deployment guide (15+ pages)
2. ✅ **RAILWAY_QUICK_START.md** - Fast 15-minute deployment
3. ✅ **RAILWAY_ENV_VARS.md** - Environment variables reference
4. ✅ **RAILWAY_VS_RENDER.md** - Platform comparison guide

## 🚀 Quick Deploy (Choose One Method)

### Method 1: Railway CLI (Recommended - Fastest)
```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add PostgreSQL database
railway add --database postgresql

# Set critical environment variables
railway variables set SECRET_KEY="<generate-this>"
railway variables set DEBUG="0"
railway variables set RESEND_API_KEY="re_YOUR_KEY"

# Deploy!
railway up
```

**Time**: 5 minutes
**Difficulty**: Easy

### Method 2: GitHub Integration (Most Popular)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `solid-succotash` repository
4. Add PostgreSQL database (+ New → Database → PostgreSQL)
5. Configure environment variables (see RAILWAY_ENV_VARS.md)
6. Railway auto-deploys on git push

**Time**: 10 minutes
**Difficulty**: Easy

### Method 3: Railway Dashboard (Manual)
1. Create new project at railway.app
2. Add PostgreSQL service
3. Add Django web service
4. Link GitHub repository
5. Configure build/start commands
6. Set environment variables
7. Deploy

**Time**: 15 minutes
**Difficulty**: Medium

## 📋 Pre-Deployment Checklist

Run the validation script before deploying:

### Windows (PowerShell)
```powershell
.\railway_check.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x railway_check.sh
./railway_check.sh
```

The script checks:
- ✅ Required files exist
- ✅ Python version configured
- ✅ Django deployment settings valid
- ✅ Dependencies complete
- ✅ Security settings correct
- ✅ Railway configuration valid

## 🔑 Critical Environment Variables

**Must set before first deploy**:

```bash
SECRET_KEY=<50-char-random-string>       # Generate with Django command
DEBUG=0                                   # Production mode
DATABASE_URL=${{Postgres.DATABASE_URL}}   # Auto-set by Railway
RESEND_API_KEY=re_YOUR_KEY               # From resend.com
```

**Generate SECRET_KEY**:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

See [RAILWAY_ENV_VARS.md](./RAILWAY_ENV_VARS.md) for complete list.

## 🎯 Deployment Flow

```
Local Development
     ↓
Git Push to GitHub
     ↓
Railway Auto-Detects Push
     ↓
Build Phase (pip install, collectstatic)
     ↓
Start Phase (migrations, seed_plans, gunicorn)
     ↓
Health Check (/healthz/)
     ↓
✅ Live on Railway!
```

## 📊 What Happens During Deployment

### Build Phase (2-3 minutes)
```bash
1. Railway pulls code from GitHub
2. Detects Python project (Nixpacks)
3. Installs Python 3.11
4. Runs: pip install -r requirements.txt
5. Runs: python manage.py collectstatic --noinput
```

### Startup Phase (1-2 minutes)
```bash
1. Executes: bash start.sh
2. Runs database migrations
3. Seeds investment plans (4 plans created)
4. Starts Gunicorn with 2 workers
5. Health check at /healthz/
```

### Total Time: ~5 minutes for first deploy

## 🌐 After Deployment

### 1. Get Your Railway Domain
```bash
railway domain
# Example: wolvcapital-production.up.railway.app
```

### 2. Test Health Endpoint
```bash
curl https://wolvcapital-production.up.railway.app/healthz/
```

Expected response:
```json
{"status": "ok", "environment": "production"}
```

### 3. Create Admin User
```bash
railway run python manage.py createsuperuser
```

### 4. Access Admin Panel
Visit: `https://your-app.up.railway.app/admin/`

### 5. Verify Investment Plans
```bash
railway run python manage.py shell -c "from investments.models import InvestmentPlan; print(f'Plans: {InvestmentPlan.objects.count()}')"
```

Should output: `Plans: 4`

## 🔧 Configuration Updates

After getting your Railway domain, update these variables:

```bash
railway variables set ALLOWED_HOSTS="your-app.up.railway.app"
railway variables set CORS_ALLOWED_ORIGINS="https://wolvcapital.com"
railway variables set CSRF_TRUSTED_ORIGINS="https://wolvcapital.com,https://your-app.up.railway.app"
railway variables set FRONTEND_URL="https://wolvcapital.com"
railway variables set PUBLIC_SITE_URL="https://wolvcapital.com"
railway variables set ADMIN_SITE_URL="https://your-app.up.railway.app"
```

## 🌐 Custom Domain Setup (Optional)

### Add Custom Domain
```bash
railway domain add api.wolvcapital.com
```

### Update DNS
In your domain registrar:
```
Type: CNAME
Name: api
Value: your-app.up.railway.app
TTL: 3600
```

### Update Variables
```bash
railway variables set ALLOWED_HOSTS="api.wolvcapital.com,your-app.up.railway.app"
railway variables set ADMIN_SITE_URL="https://api.wolvcapital.com"
```

DNS propagation: 5-60 minutes

## 📱 Frontend Deployment (Next.js on Vercel)

After backend is live:

1. Deploy Next.js to Vercel
2. Set `NEXT_PUBLIC_API_URL=https://api.wolvcapital.com`
3. Update backend `CORS_ALLOWED_ORIGINS` with Vercel domain
4. Test full-stack integration

See: [Frontend Deployment Guide](./README-NEXTJS.md)

## 📊 Monitoring & Logs

### View Real-Time Logs
```bash
railway logs
```

### Check Service Status
```bash
railway status
```

### View Metrics
```bash
railway metrics
```

### Dashboard
Visit: [Railway Dashboard](https://railway.app/dashboard)
- Deployments history
- Resource usage
- Environment variables
- Database management

## 🔄 Continuous Deployment

Railway automatically deploys when you:
1. Push to `main` branch
2. Merge pull requests
3. Create release tags

**Disable auto-deploy**:
```bash
railway service
# Service Settings → Triggers → Disable
```

## 🛠️ Troubleshooting

### Deployment Failed
```bash
# View detailed logs
railway logs --tail

# Check build logs
railway logs --build

# Re-deploy
railway up --detach
```

### Migration Issues
```bash
railway run python manage.py migrate --noinput
railway run python manage.py showmigrations
```

### Static Files Missing
```bash
railway run python manage.py collectstatic --noinput
```

### Database Connection Failed
```bash
# Check DATABASE_URL is set
railway variables get DATABASE_URL

# Verify PostgreSQL service is running
railway status
```

### 502 Bad Gateway
Common causes:
- Gunicorn not starting
- Health check failing
- Port binding issue

Check:
```bash
railway logs | grep -i error
```

## 💰 Cost Management

### Monitor Usage
```bash
railway usage
```

### Optimize Costs
1. Use Hobby plan for development ($5/month)
2. Upgrade to Pro for production ($20/month)
3. Monitor with `railway usage`
4. Set usage alerts in dashboard

### Estimated Monthly Cost
- **Development**: $5-10 (Hobby plan)
- **Production**: $20-30 (Pro plan)
- **Database**: Included
- **Bandwidth**: Included

## 📚 Documentation Reference

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md) | 15-min deploy guide | Before first deploy |
| [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) | Complete reference | Detailed setup |
| [RAILWAY_ENV_VARS.md](./RAILWAY_ENV_VARS.md) | Environment variables | Configuration |
| [RAILWAY_VS_RENDER.md](./RAILWAY_VS_RENDER.md) | Platform comparison | Choosing platform |
| [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) | System architecture | Understanding project |

## 🆘 Support & Resources

### Railway Support
- [Documentation](https://docs.railway.app)
- [Discord Community](https://discord.gg/railway)
- [Status Page](https://status.railway.app)
- [Railway Blog](https://blog.railway.app)

### WolvCapital Support
- GitHub Issues
- Project documentation
- README files

## ✅ Final Checklist

Before going live:

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] All environment variables set
- [ ] First deployment successful
- [ ] Health check passing
- [ ] Admin user created
- [ ] Investment plans seeded (4 plans)
- [ ] Static files serving
- [ ] Frontend deployed (Vercel)
- [ ] Custom domains configured
- [ ] DNS updated and propagated
- [ ] Email system tested (Resend)
- [ ] End-to-end user flow tested
- [ ] Admin approval workflow tested
- [ ] Monitoring setup
- [ ] Backup strategy planned

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ `/healthz/` returns `{"status": "ok"}`
2. ✅ Django admin accessible
3. ✅ API endpoints respond correctly
4. ✅ Database queries work
5. ✅ Static files load
6. ✅ CORS configured properly
7. ✅ Email notifications send
8. ✅ Frontend connects to backend
9. ✅ No errors in Railway logs
10. ✅ Custom domains working (if configured)

## 🚀 Next Steps

1. **Run validation**: `.\railway_check.ps1`
2. **Follow quick start**: See [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md)
3. **Deploy**: `railway up`
4. **Test**: Visit your Railway domain
5. **Configure custom domain**: (optional)
6. **Deploy frontend**: Vercel deployment
7. **Go live**: Update DNS, test everything
8. **Monitor**: Check logs and metrics

## 🎯 Deployment Commands Summary

```bash
# Initial setup
npm install -g @railway/cli
railway login
railway init

# Add database
railway add --database postgresql

# Set variables (critical ones)
railway variables set SECRET_KEY="<generated-key>"
railway variables set DEBUG="0"
railway variables set RESEND_API_KEY="re_YOUR_KEY"

# Deploy
railway up

# Monitor
railway logs
railway status

# Manage
railway run python manage.py createsuperuser
railway run python manage.py shell
railway domain

# View domain
railway open
```

---

**Ready to deploy?** Start with [RAILWAY_QUICK_START.md](./RAILWAY_QUICK_START.md)!

**Questions?** Check [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for detailed guidance.

**Need help?** Join [Railway Discord](https://discord.gg/railway)

Good luck with your deployment! 🚀
