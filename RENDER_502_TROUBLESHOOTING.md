# 🔧 Render.com 502 Bad Gateway Troubleshooting Guide

## 📋 Steps to Diagnose Your Issue

### 1. Access Your Render Logs

1. Go to: https://dashboard.render.com/
2. Click on your service name (`wolvcapital`)
3. Click **"Logs"** tab
4. Look for error messages (especially in red)

### 2. Run Health Check Command

Once you can access the Render Shell:

```bash
python manage.py healthcheck
```

This will check:
- Environment variables
- Database connection
- Django settings
- App imports
- Migration status

---

## 🔍 Common Error Patterns & Solutions

### Error 1: "Database connection failed"

**Symptoms in logs:**
```
OperationalError: could not connect to server
FATAL: password authentication failed
psycopg2.OperationalError
```

**Solution:**
1. Go to Render Dashboard → Your Service → "Environment"
2. Check if `DATABASE_URL` is set (should be auto-set by Render)
3. Go to your PostgreSQL database page
4. Check if database status is "Available" (green)
5. Ensure web service and database are in the **same region**

**If DATABASE_URL is missing:**
- Go to Service → "Environment" → Add environment variable
- Or re-link the database: Settings → Environment → Add Database Link

---

### Error 2: "SECRET_KEY not set"

**Symptoms in logs:**
```
KeyError: 'SECRET_KEY'
ImproperlyConfigured: The SECRET_KEY setting must not be empty
```

**Solution:**
1. Go to Render Dashboard → Your Service → "Environment"
2. Add environment variable:
   - **Key**: `SECRET_KEY`
   - **Value**: `ism+7l(h49h2v4(p9jg_9vlu)-m89nc_&pfztmavk_m4$6iwq*`
3. Click "Save Changes"
4. Service will auto-redeploy

---

### Error 3: "ModuleNotFoundError" or Import Errors

**Symptoms in logs:**
```
ModuleNotFoundError: No module named 'django'
ImportError: cannot import name 'X'
```

**Solution:**
1. Check your build command includes: `pip install -r requirements.txt`
2. In Render Dashboard → Service → "Settings" → Build Command should be:
   ```bash
   pip install --upgrade pip && pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```
3. Click "Manual Deploy" → "Clear build cache & deploy"

---

### Error 4: "Migration failed"

**Symptoms in logs:**
```
django.db.migrations.exceptions.MigrationSchemaMissing
django.db.utils.ProgrammingError
relation "users_profile" does not exist
```

**Solution:**

**Option A: Run migrations manually (Render Shell)**
1. Go to Service → "Shell" tab
2. Run:
   ```bash
   python manage.py migrate --noinput
   python manage.py seed_plans
   ```

**Option B: Reset database (if safe to do)**
1. Go to your PostgreSQL database page
2. Click "Console" tab
3. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
4. Go back to web service and click "Manual Deploy"

---

### Error 5: "Bad Request (400)" instead of 502

**Symptoms:**
Page loads but shows "Bad Request (400)"

**Solution:**
1. Check `ALLOWED_HOSTS` in environment:
   - Render sets `RENDER_EXTERNAL_URL` automatically
   - Your `settings.py` should parse this correctly
   
2. Add to Environment variables:
   ```
   DEBUG=0
   ```
   (Use `0` not `False`)

---

### Error 6: Port binding issues

**Symptoms in logs:**
```
[ERROR] Can't connect to ('0.0.0.0', 10000)
failed to bind to address
```

**Solution:**
Check your `start.sh` - it should use `$PORT` environment variable:
```bash
gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT:-10000}
```

Render automatically sets `PORT` - your app must listen on it.

---

### Error 7: Build succeeds but deploy fails

**Symptoms:**
Build logs show success, but service never becomes "Live"

**Solution:**
1. Check the **start command** is correct:
   ```bash
   bash start.sh
   ```

2. Make sure `start.sh` is executable:
   - Locally run: `chmod +x start.sh`
   - Commit and push

3. Check if `start.sh` has errors:
   - Review the script for syntax errors
   - Test locally first

---

## 🎯 Step-by-Step Fix Procedure

### Step 1: Check Environment Variables
```
Required:
✅ SECRET_KEY (must be set)
✅ DATABASE_URL (auto-set by Render)
✅ DEBUG=0
```

### Step 2: Verify Database
- Database status: "Available" (green)
- Same region as web service
- Linked to web service

### Step 3: Check Build Logs
- Build completed successfully?
- No errors during `pip install`?
- `collectstatic` succeeded?

### Step 4: Check Deploy Logs
- Service starting?
- Migrations running?
- Any Python errors?

### Step 5: Run Health Check
In Render Shell:
```bash
python manage.py healthcheck
```

---

## 🆘 Emergency Quick Fixes

### Quick Fix 1: Redeploy with Clear Cache
1. Go to Service page
2. Click "Manual Deploy" button
3. Select "Clear build cache & deploy"

### Quick Fix 2: Check Service Status
1. Go to Service page
2. Check if service is "Suspended"
3. If suspended, click "Resume"

### Quick Fix 3: Verify Start Command
Settings → Start Command should be:
```bash
bash start.sh
```

### Quick Fix 4: Simplify start.sh (Minimal)
Replace `start.sh` contents with minimal version:
```bash
#!/bin/bash
set -e
python manage.py migrate --noinput
python manage.py collectstatic --noinput
gunicorn wolvcapital.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 2 --timeout 120
```

---

## 📞 Getting More Help

### Share Your Logs
When asking for help, share:
1. Last 50 lines of Deploy logs
2. Last 50 lines of Service logs
3. Environment variables (mask SECRET_KEY)
4. Database status

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com/
- Support: help@render.com

---

## ✅ Checklist Before Asking for Help

- [ ] Checked all environment variables are set
- [ ] Verified database is running and linked
- [ ] Reviewed build logs for errors
- [ ] Reviewed deploy/service logs for errors
- [ ] Tried "Clear build cache & deploy"
- [ ] Ran health check command
- [ ] Checked service is not suspended
- [ ] Verified start command is correct

---

## 🎬 Next Steps

1. **Copy your logs** from Render and share them
2. **Run the health check** in Render Shell
3. **Tell me what errors you see** and I'll provide specific fixes

The most common issue is usually **missing DATABASE_URL** or **SECRET_KEY** not being set.
