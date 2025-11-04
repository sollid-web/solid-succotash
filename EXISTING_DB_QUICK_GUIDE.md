# Quick Guide: Using Existing Database

## Step 1: Verify Database Name in Render Dashboard
1. Go to Render Dashboard → Databases
2. Note the exact name of your existing database
3. If it's NOT named `wolvcapital-db`, update render.yaml

## Step 2: Deploy New Django Service  
Your render.yaml is already configured correctly:
- Will connect to existing `wolvcapital-db`
- Will preserve all existing data
- Will only add new migrations if needed

## Step 3: What to Expect During Deployment

### ✅ Safe Operations:
- Database migrations (only new ones applied)
- Static file collection
- Admin user verification (existing admins preserved)
- Investment plans check (existing plans preserved)

### ⚠️ Monitor These Logs:
```bash
📦 Running migrations...
✅ Migrations completed successfully
💰 Seeding investment plans...
✅ Investment plans seed attempt succeeded (or "already exist")
👤 Setting up admin user...  
✅ Admin user already exists: admin@wolvcapital.com
```

## Step 4: Verify Data After Deployment

### Test API with Existing Data:
```bash
# Should return existing investment plans
curl https://api.wolvcapital.com/api/plans/

# Should work with existing admin
https://api.wolvcapital.com/admin/
```

### Check Preserved Data:
- Users → Should see existing customer accounts
- Investment Plans → Should see existing plans  
- Transactions → Should see existing transaction history
- User Investments → Should see active investments

## Alternative: Manual Database Connection

If you prefer manual control, get your database connection string:

1. **Render Dashboard** → Your existing database → **Info** tab
2. **Copy "Internal Database URL"**:
   ```
   postgresql://user:pass@host:port/wolvcapital
   ```
3. **Set as environment variable** in new service:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/wolvcapital
   ```

## Database Migration Safety

Your `start.sh` is designed to be safe with existing databases:

- **Migrations**: Only applies NEW migrations, won't touch existing data
- **Seeding**: Checks if data exists before creating (uses `get_or_create`)
- **Admin**: Checks if admin exists before creating new one
- **Retry Logic**: Handles temporary connection issues

## Benefits of Using Existing Database

✅ **All user accounts preserved** - customers keep access  
✅ **Investment history intact** - no financial data lost  
✅ **Transaction records preserved** - complete audit trail  
✅ **Seamless transition** - users won't notice backend change  
✅ **No migration headaches** - existing data structure compatible  
✅ **Cost effective** - one database for entire platform  

## Checklist Before Deployment

- [ ] Existing database name matches `render.yaml` (`wolvcapital-db`)
- [ ] Database is healthy and accessible in Render dashboard
- [ ] Backup exists (Render auto-backups, but good to verify)
- [ ] Ready to monitor deployment logs for successful connection

## Your Next Steps

1. **Deploy Django service** using existing render.yaml
2. **Monitor logs** for successful database connection and migrations  
3. **Test API endpoints** to verify data access
4. **Check admin panel** to confirm existing data visible
5. **Update frontend** to use new API domain

**Bottom Line**: Your render.yaml is perfectly configured to use your existing database safely! 🎉