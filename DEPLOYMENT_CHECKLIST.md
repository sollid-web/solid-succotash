# WolvCapital Deployment Checklist

## ✅ Pre-Deployment (COMPLETED)
- [x] Code committed to Git
- [x] Code pushed to GitHub (main branch)
- [x] render.yaml configured
- [x] requirements.txt up to date
- [x] start.sh configured
- [x] Migrations prepared

## 🚀 Render.com Deployment Steps

### 1. Create Web Service
Go to: https://dashboard.render.com/

**Option A: Use Blueprint (Easiest)**
1. Click "New +" → "Blueprint"
2. Select repository: `radical-workspace/solid-succotash`
3. Render detects `render.yaml` automatically
4. Review configuration
5. Click "Apply"

**Option B: Manual Setup**
1. Click "New +" → "Web Service"
2. Connect GitHub repository: `radical-workspace/solid-succotash`
3. Configure:
   - Name: `wolvcapital`
   - Environment: `Python 3`
   - Branch: `main`
   - Build Command: `pip install --upgrade pip && pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Start Command: `bash start.sh`

### 2. Configure Environment Variables

**Required Variables:**
```bash
DEBUG=0
SECRET_KEY=<generate-using-command-below>
DJANGO_SETTINGS_MODULE=wolvcapital.settings
WEB_CONCURRENCY=2
```

**Generate SECRET_KEY locally:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Optional Email Variables (for notifications):**
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 3. Create PostgreSQL Database

In Render Dashboard:
1. Scroll to "Add Database" section
2. Click "Create Database"
3. Name: `wolvcapital-db`
4. Region: Same as your web service
5. `DATABASE_URL` is automatically connected

### 4. Deploy!

Click "Create Web Service" or "Apply" (for blueprint)

## 📋 Post-Deployment Tasks

### Access Render Shell
In your Render dashboard → Service → "Shell" tab

### Run Initial Setup Commands

1. **Run Migrations:**
```bash
python manage.py migrate
```

2. **Create Investment Plans:**
```bash
python manage.py seed_plans
```

3. **Create Superuser (Admin Account):**
```bash
python manage.py createsuperuser
```
- Enter email, password when prompted
- This creates your admin account

4. **Verify Database:**
```bash
python manage.py verify_db
```

## 🔍 Verification Checklist

After deployment completes:

- [ ] Service status shows "Live" (green)
- [ ] Visit your app URL: `https://your-app.onrender.com`
- [ ] Homepage loads correctly
- [ ] Admin login works: `https://your-app.onrender.com/admin/`
- [ ] User signup works
- [ ] Dashboard accessible after login
- [ ] Investment plans display on `/plans/` page
- [ ] Static files (CSS/images) load properly

## 🐛 Troubleshooting

### If you see "Bad Request (400)":
1. Check `DEBUG=0` (not "False")
2. Verify `SECRET_KEY` is set
3. Check logs in Render dashboard
4. Ensure `RENDER_EXTERNAL_HOSTNAME` is detected

### If database connection fails:
1. Verify PostgreSQL database is running
2. Check `DATABASE_URL` is set automatically
3. Run migrations again

### If static files don't load:
1. Check build logs for collectstatic errors
2. Verify WhiteNoise in requirements.txt
3. Check `STATIC_ROOT` in settings.py

### View Logs:
In Render dashboard → Your Service → "Logs" tab

## 📧 Getting Help

- Render Docs: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/5.0/howto/deployment/
- Check GitHub Issues: https://github.com/radical-workspace/solid-succotash/issues

## 🎉 Success Indicators

Your deployment is successful when:
1. ✅ Service shows "Live" status
2. ✅ Homepage loads at your Render URL
3. ✅ Admin panel accessible with superuser credentials
4. ✅ Users can sign up and log in
5. ✅ Investment plans are visible
6. ✅ No errors in Render logs

## 🔐 Security Reminders

After deployment:
- [ ] Change default SECRET_KEY if using example
- [ ] Set up email backend for notifications
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic on Render)
- [ ] Test all approval workflows
- [ ] Review Django security checklist

## 📊 Monitoring

Set up monitoring in Render:
- Enable "Health Check" endpoint
- Set up alerts for downtime
- Monitor database usage
- Track deployment frequency

---

**Your repository:** https://github.com/radical-workspace/solid-succotash
**Latest commit:** a8c137d - "Prepare for deployment - Updated settings and migrations"
**Deployment Date:** October 2, 2025
