# Using Your Existing Database with New Django Backend

## Overview
Since you already have a database on Render (`wolvcapital-db`), you can reuse it with your new Django API service. This preserves all your existing data (users, investments, transactions, etc.).

## Method 1: Connect New Service to Existing Database (Recommended)

### Step 1: Deploy New Django Service
1. **Create New Web Service** in Render Dashboard
   - Name: `wolvcapital-api` (or similar)
   - Repository: Your GitHub repo
   - Runtime: Python 3

### Step 2: Connect to Existing Database
Instead of creating a new database, connect to your existing one:

1. **In render.yaml** (already configured correctly):
   ```yaml
   databases:
     - name: wolvcapital-db  # This references your EXISTING database
       databaseName: wolvcapital
       user: wolvcapital
   ```

2. **Environment Variable** (auto-configured):
   ```bash
   DATABASE_URL=postgresql://user:password@host:port/wolvcapital
   ```
   *(Render automatically sets this from your existing database)*

### Step 3: Handle Database Migration Safely

Your `start.sh` script already handles migrations safely:

```bash
# Apply database migrations with retry
echo "📦 Running migrations..."
for i in {1..3}; do
    if python manage.py migrate --noinput; then
        echo "✅ Migrations completed successfully"
        break
    else
        echo "❌ Migration attempt $i failed, retrying in 5 seconds..."
        sleep 5
    fi
done
```

**What this does**:
- Applies any NEW migrations to your existing database
- Preserves existing data
- Only adds new tables/columns if needed
- Safe to run multiple times

### Step 4: Verify Data Preservation

After deployment, check that your data is intact:

1. **Admin Panel**: `https://api.wolvcapital.com/admin/`
2. **Check existing users**: Should see your current users
3. **Check investment plans**: Should see existing plans
4. **Check transactions**: Should see existing transaction data

## Method 2: Use Database Connection String Directly

If you want more control, you can get the database connection details:

### Step 1: Get Database Connection Info
1. **In Render Dashboard**: Go to your existing database service
2. **Navigate to**: Info tab
3. **Copy**: Internal Database URL or Connection String
   ```
   postgresql://user:password@host:port/wolvcapital
   ```

### Step 2: Set as Environment Variable
In your new Django service:
```bash
DATABASE_URL=postgresql://user:password@host:port/wolvcapital
```

## Data Migration Considerations

### Your Existing Data Will Include:
- ✅ **User accounts** (existing customers)
- ✅ **Investment plans** (existing investment options)  
- ✅ **User investments** (active investments)
- ✅ **Transactions** (deposit/withdrawal history)
- ✅ **Admin users** (existing admin accounts)
- ✅ **Cryptocurrency wallets** (deposit addresses)

### What Might Need Updates:
- **Frontend URL references** in email templates
- **CORS settings** (already configured in your render.yaml)
- **Admin notifications** (may reference old frontend URLs)

## Potential Issues and Solutions

### Issue 1: Migration Conflicts
**Symptom**: Migration errors during deployment

**Solution**: 
```bash
# If you need to fake initial migrations (rare)
python manage.py migrate --fake-initial

# Or reset migrations if absolutely necessary
python manage.py migrate users zero
python manage.py migrate users
```

### Issue 2: Different Django Version
**Symptom**: Model compatibility issues

**Solution**: Your current requirements.txt should handle this, but verify:
```bash
# Check Django version compatibility
pip list | grep Django
```

### Issue 3: Missing Data After Migration
**Symptom**: Some tables appear empty

**Solution**: Check if you need to run specific data migrations:
```bash
# Re-seed investment plans if needed
python manage.py seed_plans

# Check existing data
python manage.py shell
>>> from users.models import User
>>> User.objects.count()  # Should show existing users
```

## Database Backup (Recommended Before Migration)

Before connecting your new service, backup your existing database:

### Option A: Render Automatic Backups
- Render automatically backs up PostgreSQL databases
- Check your database dashboard for recent backups

### Option B: Manual Backup
```bash
# Get database connection details from Render dashboard
pg_dump "postgresql://user:password@host:port/wolvcapital" > backup.sql
```

## Environment Variables for Existing Database

Your render.yaml is already correctly configured:

```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: wolvcapital-db  # References EXISTING database
      property: connectionString
```

**Additional required variables**:
```bash
SECRET_KEY=<generate-new-one>
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
```

## Deployment Steps with Existing Database

1. **Deploy New Django Service**:
   - Use your existing render.yaml
   - It will automatically connect to `wolvcapital-db`

2. **Monitor Deployment Logs**:
   - Watch for successful migrations
   - Verify data seeding completes
   - Check for any errors

3. **Test Data Access**:
   ```bash
   # Test API endpoints
   curl https://api.wolvcapital.com/api/plans/
   
   # Should return existing investment plans
   ```

4. **Verify Admin Access**:
   - Login with existing admin credentials
   - Check all existing data is visible

## Verification Checklist

After deployment with existing database:

- [ ] Django service starts without errors
- [ ] Database migrations complete successfully  
- [ ] Existing users visible in admin panel
- [ ] Investment plans API returns existing data
- [ ] No data loss occurred
- [ ] New frontend can access existing data
- [ ] All authentication works with existing users

## Benefits of Reusing Database

✅ **Preserve User Data**: Existing customers keep their accounts
✅ **Maintain Investment History**: All past investments preserved  
✅ **Keep Transaction Records**: Financial history intact
✅ **Seamless Migration**: Users won't notice backend changes
✅ **Cost Effective**: No need for second database
✅ **Faster Deployment**: No data migration needed

## Important Notes

1. **Database Name**: Your render.yaml references `wolvcapital-db` - make sure this matches your actual database name in Render

2. **User Experience**: Since you're only changing the backend architecture, users should experience no disruption

3. **Frontend Compatibility**: Your new Next.js frontend will work with existing data structure

4. **Admin Access**: You can continue using existing admin accounts

Your existing database is perfectly compatible with the new architecture! 🎉