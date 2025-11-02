# Deployment Guide: Django (Render) + Next.js (Vercel)

This guide walks you through deploying WolvCapital with a separated architecture:
- **Backend (Django)**: Deployed to Render
- **Frontend (Next.js)**: Deployed to Vercel

## Prerequisites

- [ ] GitHub account with repository access
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)
- [ ] PostgreSQL database on Render

---

## Part 1: Deploy Django Backend to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `wolvcapital-db`
   - **Database**: `wolvcapital`
   - **User**: `wolvcapital`
   - **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
   - **Plan**: Free or paid tier
4. Click **Create Database**
5. **Save the Internal Database URL** (starts with `postgresql://...`)

### Step 2: Deploy Django Web Service

1. In Render dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `wolvcapital-api`
   - **Region**: Same as database
   - **Branch**: `main` or your deployment branch
   - **Root Directory**: Leave empty (project root)
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: `bash start.sh`
   - **Plan**: Free or paid tier

### Step 3: Configure Environment Variables

In the **Environment** section, add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `SECRET_KEY` | (auto-generate) | Click "Generate" button |
| `DEBUG` | `0` | Production mode |
| `DJANGO_SETTINGS_MODULE` | `wolvcapital.settings` | |
| `DATABASE_URL` | (paste Internal Database URL from Step 1) | |
| `ALLOWED_HOSTS` | `wolvcapital-api.onrender.com` | Replace with your Render URL |
| `CORS_ALLOWED_ORIGINS` | `https://wolvcapital.vercel.app` | **Update after deploying frontend** |
| `CSRF_TRUSTED_ORIGINS` | `https://wolvcapital.vercel.app` | **Must match CORS_ALLOWED_ORIGINS** |
| `WEB_CONCURRENCY` | `2` | Gunicorn workers |

**Optional Email Settings** (if using Gmail):
| Key | Value |
|-----|-------|
| `EMAIL_BACKEND` | `django.core.mail.backends.smtp.EmailBackend` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USE_TLS` | `True` |
| `EMAIL_HOST_USER` | `your-email@gmail.com` |
| `EMAIL_HOST_PASSWORD` | `your-app-password` |
| `DEFAULT_FROM_EMAIL` | `noreply@yourdomain.com` |

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically deploy from your repository
3. Wait for deployment to complete (~3-5 minutes)
4. **Note your backend URL**: `https://wolvcapital-api.onrender.com`

### Step 5: Run Database Migrations

After first deployment:

1. Go to your web service dashboard
2. Click **Shell** tab
3. Run:
   ```bash
   python manage.py migrate
   python manage.py seed_plans
   python manage.py createsuperuser
   ```

### Step 6: Test Backend API

Visit these URLs to verify deployment:
- Health check: `https://wolvcapital-api.onrender.com/healthz/`
- Admin panel: `https://wolvcapital-api.onrender.com/admin/`
- API plans: `https://wolvcapital-api.onrender.com/api/plans/`

---

## Part 2: Deploy Next.js Frontend to Vercel

### Step 1: Prepare Frontend

1. Make sure `frontend/vercel.json` exists with correct API URL
2. Update `NEXT_PUBLIC_API_URL` in `vercel.json` with your Render backend URL:
   ```json
   {
     "env": {
       "NEXT_PUBLIC_API_URL": {
         "value": "https://wolvcapital-api.onrender.com"
       }
     }
   }
   ```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Follow prompts:
   - **Set up and deploy?** `Y`
   - **Which scope?** Choose your account
   - **Link to existing project?** `N`
   - **Project name?** `wolvcapital`
   - **Directory?** `./` (current directory)
   - **Override settings?** `N`

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. Add Environment Variables:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://wolvcapital-api.onrender.com`

5. Click **Deploy**

### Step 3: Note Your Frontend URL

After deployment completes, Vercel will provide:
- **Production URL**: `https://wolvcapital.vercel.app` (or similar)
- **Preview URLs**: For each branch/PR

### Step 4: Update Django CORS Settings

**IMPORTANT**: Go back to Render and update these environment variables:

1. Go to Render dashboard → Your web service
2. Update environment variables:
   - `CORS_ALLOWED_ORIGINS`: `https://wolvcapital.vercel.app,https://www.wolvcapital.vercel.app`
   - `CSRF_TRUSTED_ORIGINS`: `https://wolvcapital.vercel.app,https://www.wolvcapital.vercel.app`

3. Click **Save Changes** (triggers automatic redeploy)

### Step 5: Test Integration

1. Visit your Vercel frontend URL
2. Try these actions:
   - View investment plans (should load from API)
   - Create an account
   - Submit a deposit request
3. Verify data appears in Django admin

---

## Part 3: Custom Domain Setup (Optional)

### For Django Backend (Render)

1. In Render dashboard, go to your web service
2. Click **Settings** → **Custom Domain**
3. Add domain: `api.yourdomain.com`
4. Follow DNS configuration instructions
5. Update environment variables:
   - `ALLOWED_HOSTS`: Add `api.yourdomain.com`
   - Keep `wolvcapital-api.onrender.com` for health checks

### For Next.js Frontend (Vercel)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add domains:
   - `yourdomain.com`
   - `www.yourdomain.com`
4. Follow DNS configuration instructions
5. Update Django CORS settings:
   ```
   CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
   ```

---

## Part 4: Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments from Git:

**Render (Backend)**:
- Deploys automatically on push to `main` branch
- Configure in **Settings** → **Build & Deploy**

**Vercel (Frontend)**:
- Production: Deploys on push to `main` branch
- Preview: Deploys on push to any branch
- Configure in **Settings** → **Git**

### Manual Deployments

**Render**:
```bash
# Trigger manual deploy in dashboard
# Or use Render CLI
render deploy
```

**Vercel**:
```bash
cd frontend
vercel --prod  # Production deployment
vercel         # Preview deployment
```

---

## Part 5: Monitoring & Logs

### Render (Django Backend)

1. **Logs**: Dashboard → Logs tab (real-time)
2. **Metrics**: Monitor CPU, memory, requests
3. **Health Checks**: `/healthz/` endpoint checked every 30s

### Vercel (Next.js Frontend)

1. **Logs**: Dashboard → Deployments → Select deployment → Build Logs
2. **Analytics**: Enable Vercel Analytics in project settings
3. **Performance**: Monitor Web Vitals

---

## Part 6: Post-Deployment Checklist

- [ ] Backend health check returns 200: `https://wolvcapital-api.onrender.com/healthz/`
- [ ] Django admin accessible: `https://wolvcapital-api.onrender.com/admin/`
- [ ] API endpoints returning data: `https://wolvcapital-api.onrender.com/api/plans/`
- [ ] Frontend loads: `https://wolvcapital.vercel.app`
- [ ] Frontend can fetch data from backend API
- [ ] CORS configured correctly (no console errors)
- [ ] Database migrations applied
- [ ] Investment plans seeded (`seed_plans` command)
- [ ] Admin user created
- [ ] Email notifications working (if configured)
- [ ] Custom domains configured (if applicable)
- [ ] SSL/HTTPS working on both services
- [ ] Environment variables secured (not in public repo)

---

## Troubleshooting

### CORS Errors

**Symptom**: Console errors like `Access-Control-Allow-Origin`

**Solution**:
1. Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
2. Check for typos (must be exact match, including `https://`)
3. No trailing slashes in URLs
4. Redeploy backend after changes

### 502 Bad Gateway (Render)

**Symptom**: Backend returns 502 error

**Solutions**:
1. Check logs in Render dashboard
2. Verify `start.sh` script is executable
3. Check `DATABASE_URL` is correct
4. Ensure all dependencies in `requirements.txt`
5. Verify Python version compatibility

### Frontend Can't Connect to Backend

**Symptom**: API requests fail or timeout

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check backend is running (visit `/healthz/`)
3. Check CORS settings
4. Open browser DevTools → Network tab to see request details

### Database Connection Failed

**Symptom**: Django can't connect to PostgreSQL

**Solutions**:
1. Verify `DATABASE_URL` environment variable
2. Check database is running in Render
3. Ensure `psycopg2-binary` is in `requirements.txt`
4. Check database region matches web service region

### Build Failures

**Render (Django)**:
- Check Python version in logs
- Verify all dependencies have compatible versions
- Check for typos in `requirements.txt`

**Vercel (Next.js)**:
- Check Node.js version
- Verify `package.json` syntax
- Check for missing dependencies

---

## Environment Variable Reference

### Django Backend (Render)

**Required**:
```bash
SECRET_KEY=<auto-generated>
DEBUG=0
DATABASE_URL=postgresql://...
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.vercel.app
CSRF_TRUSTED_ORIGINS=https://wolvcapital.vercel.app
```

**Optional**:
```bash
WEB_CONCURRENCY=2
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

### Next.js Frontend (Vercel)

**Required**:
```bash
NEXT_PUBLIC_API_URL=https://wolvcapital-api.onrender.com
```

---

## Cost Estimates

### Free Tier (Development/Testing)

- **Render**: Free web service + Free PostgreSQL (90 days)
- **Vercel**: Unlimited personal projects
- **Total**: $0/month (with limitations)

**Limitations**:
- Render free tier spins down after 15 min of inactivity
- PostgreSQL expires after 90 days on free tier
- Limited bandwidth and build minutes

### Production Tier

- **Render**: 
  - Web Service: $7/month (Starter)
  - PostgreSQL: $7/month (Starter - 256MB RAM)
- **Vercel**: 
  - Pro: $20/month (per user)
- **Total**: ~$34/month minimum

---

## Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Django CORS**: https://github.com/adamchainz/django-cors-headers
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Ready to deploy!** Follow the steps in order, and you'll have a fully separated, production-ready architecture. 🚀
