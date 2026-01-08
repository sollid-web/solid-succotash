# 🚂 Railway User Reset Fix - CRITICAL

## 🚨 Problem Identified

**Your users are disappearing because Railway is using SQLite on ephemeral storage.** Every time Railway redeploys your app, the SQLite database (`db.sqlite3`) gets wiped, causing all user registrations to vanish.

## ✅ Immediate Fix (5 minutes)

### Step 1: Add PostgreSQL Database to Railway

1. **Go to your Railway project dashboard**
2. **Click "+ New" → "Database" → "PostgreSQL"**
3. **Railway will automatically:**
   - Create a PostgreSQL instance  
   - Generate a `DATABASE_URL` environment variable
   - Link it to your Django service

### Step 2: Redeploy

1. **Your app will automatically redeploy after adding the database**
2. **Wait for deployment to complete**
3. **All future deployments will use persistent PostgreSQL**

### Step 3: Verify Fix

Check your Railway service logs for this message:
```
✅ Using production database: django.db.backends.postgresql
```

If you see this instead, the fix isn't applied:
```
🚨 CRITICAL: Railway production using SQLite!
```

## 🔧 What We Fixed in the Code

### 1. Added Railway Production Guard

`wolvcapital/settings.py` now prevents SQLite fallback in Railway production:

```python
# Guard against SQLite fallback in production environments
if IN_RAILWAY and not DEBUG:
    raise ValueError(
        "Railway production deployment detected without DATABASE_URL! "
        "Add PostgreSQL service and set DATABASE_URL to prevent data loss."
    )
```

### 2. Enhanced Startup Safety Checks

`start.sh` now includes database engine verification:

```bash
# Critical database safety check
if 'sqlite' in db_engine.lower() and Railway detected:
    print("CRITICAL: Railway production using SQLite!")
    exit(1)
```

### 3. Safer Bootstrap Process

`create_render_superuser.py` no longer overwrites existing admin users:

```python
# Only update existing users if they're not already superusers
if user.is_superuser and user.is_staff:
    # Skip password update to avoid overwriting existing account
    action = "skipped (already admin)"
```

### 4. Enhanced Diagnostics

`python manage.py verify_db` now shows:
- Database engine (SQLite vs PostgreSQL)  
- Railway environment detection
- User statistics and admin accounts
- Critical warnings for production SQLite

## 🎯 Why This Happened

1. **Railway uses ephemeral filesystem** - files disappear on redeploy
2. **Your app fell back to SQLite** when `DATABASE_URL` wasn't set
3. **SQLite file gets wiped** on every Railway redeploy/restart
4. **Bootstrap processes create fresh admin users** but lose regular registrations

## 🚀 After the Fix

✅ **Users persist across deployments**  
✅ **Investments and transactions preserved**  
✅ **Admin accounts remain stable**  
✅ **ROI payouts continue working**  

## 🧪 Test Your Fix

After adding PostgreSQL to Railway:

```bash
# In Railway console or locally:
python manage.py verify_db
```

Should show:
```
✅ Using production database: django.db.backends.postgresql
👥 User Statistics: [your users will be preserved]
```

## 📋 Recovery Steps

Once Railway has PostgreSQL:

1. **Your placeholder user account is safe** (won't disappear)
2. **Run the historical investment recreation:**
   ```bash
   railway run python manage.py create_historical_investments \
     --username placeholder-teddybjorn72 \
     --admin-email your-admin@email.com \
     --fund 50000 \
     --investment "VANGUARD|25000|2025-01-01" \
     --investment "HORIZON|15000|2025-02-01"
   ```
3. **Backfill any missing ROI:**
   ```bash
   railway run python manage.py payout_roi \
     --start-date 2025-12-31 \
     --user-email placeholder-teddybjorn72@example.com
   ```

## 🎉 You're Protected

The new safeguards ensure this can **never happen again** - Railway deployments will fail fast with clear error messages if PostgreSQL isn't properly configured, rather than silently losing user data.