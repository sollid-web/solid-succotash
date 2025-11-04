# Django Deployment on Render - Step by Step

## Prerequisites
✅ Your Django app is already configured with:
- `render.yaml` file
- `start.sh` startup script
- `requirements.txt`
- `Procfile` (backup)

## Step 1: Create Render Account and Connect Repository

1. **Sign up at Render.com**
   - Go to https://render.com
   - Sign up with your GitHub account
   - Grant Render access to your repository

2. **Connect Your Repository**
   - In Render Dashboard, click "New +"
   - Select "Web Service"
   - Connect your GitHub repository `solid-succotash`
   - Grant necessary permissions

## Step 2: Deploy Web Service

1. **Choose Repository and Branch**
   - Select your `solid-succotash` repository
   - Choose `main` branch
   - Select root directory (not a subdirectory)

2. **Service Configuration**
   - **Name**: `wolvcapital-api` (or your preferred name)
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: `bash start.sh`

3. **Instance Type**
   - Choose **Starter** ($7/month) or **Standard** for better performance
   - Starter is fine for initial deployment

## Step 3: Create Database

1. **Add PostgreSQL Database**
   - In Render Dashboard, click "New +"
   - Select "PostgreSQL"
   - **Name**: `wolvcapital-db`
   - **Database Name**: `wolvcapital`
   - **User**: `wolvcapital`
   - Choose **Free** tier initially

2. **Note Database Details**
   - Render will provide connection details
   - These are automatically used via `render.yaml`

## Step 4: Configure Environment Variables

In your Web Service settings, add these environment variables:

### Required Variables
```bash
SECRET_KEY=<click-generate-to-create-random-key>
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings
WEB_CONCURRENCY=2
```

### Domain Configuration
```bash
ALLOWED_HOSTS=wolvcapital-api.onrender.com,api.wolvcapital.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
```

### Database (Auto-configured)
```bash
DATABASE_URL=<automatically-set-from-database-connection>
```

**Important**: For `SECRET_KEY`, click the "Generate" button in Render to create a secure random key.

## Step 5: Deploy and Monitor

1. **Start Deployment**
   - Click "Create Web Service"
   - Render will start building and deploying
   - Monitor the build logs in real-time

2. **Check Build Logs**
   - Look for successful migration messages
   - Verify static files collection
   - Ensure investment plans are seeded
   - Confirm admin user creation

3. **Test Deployment**
   - Once deployed, test the health endpoint:
     ```
     https://your-service-name.onrender.com/healthz/
     ```
   - Should return: `{"status":"ok"}`

## Step 6: Verify Django Admin

1. **Access Admin Panel**
   ```
   https://your-service-name.onrender.com/admin/
   ```

2. **Login with Default Admin**
   - Username: `admin@wolvcapital.com`
   - Password: `admin123`

3. **Change Admin Password**
   - Immediately change the default password
   - Go to Users → admin@wolvcapital.com → Change password

## Step 7: Test API Endpoints

Test these key endpoints:

```bash
# Health check
curl https://your-service-name.onrender.com/healthz/

# Investment plans
curl https://your-service-name.onrender.com/api/plans/

# Admin panel (in browser)
https://your-service-name.onrender.com/admin/
```

## Step 8: Set Up Custom Domain (api.wolvcapital.com)

1. **Add Custom Domain in Render**
   - Go to your web service → Settings
   - Scroll to "Custom Domains"
   - Add: `api.wolvcapital.com`

2. **Get DNS Record from Render**
   - Render will show required DNS record
   - Usually: `CNAME api wolvcapital-api.onrender.com`

3. **Add DNS Record**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the CNAME record as instructed
   - Wait 5-30 minutes for DNS propagation

4. **Verify SSL**
   - Render auto-provisions SSL certificate
   - Test: `https://api.wolvcapital.com/healthz/`

## Common Issues and Solutions

### Build Fails
- Check requirements.txt for conflicting versions
- Ensure Python 3.9+ compatibility
- Review build logs for specific error messages

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check if database service is running
- Ensure migrations run successfully

### Static Files Not Loading
- Verify `collectstatic` runs in build command
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Ensure WhiteNoise is properly configured

### CORS Errors
- Double-check CORS_ALLOWED_ORIGINS includes your frontend domain
- Ensure no trailing slashes in URLs
- Verify frontend is making requests to correct API domain

### Migration Errors
- Check for model conflicts
- Review migration files for issues
- Consider running migrations manually if needed

## Post-Deployment Checklist

- [ ] Health endpoint returns 200 OK
- [ ] Admin panel accessible with correct credentials
- [ ] API endpoints return expected data
- [ ] Database populated with investment plans
- [ ] Custom domain resolves correctly
- [ ] SSL certificate active and valid
- [ ] CORS working with frontend
- [ ] Error monitoring set up (optional)

## Monitoring and Maintenance

1. **Monitor Service Health**
   - Check Render dashboard regularly
   - Set up uptime monitoring (e.g., UptimeRobot)

2. **Database Backups**
   - Render automatically backs up PostgreSQL
   - Consider additional backup strategy for production

3. **Log Monitoring**
   - Review application logs regularly
   - Set up alerts for errors

4. **Performance Monitoring**
   - Monitor response times
   - Check database query performance
   - Consider upgrading plan if needed

## Next Steps After Deployment

1. **Connect Frontend**: Update your Vercel frontend to use the new API domain
2. **Test Integration**: Ensure frontend and backend work together
3. **Set Up Monitoring**: Add error tracking and performance monitoring
4. **Security Review**: Change default passwords, review security settings
5. **Production Optimization**: Configure caching, optimize database queries

Your Django backend will be live at:
- **API**: `https://api.wolvcapital.com` (after custom domain setup)
- **Admin**: `https://api.wolvcapital.com/admin/`
- **Health**: `https://api.wolvcapital.com/healthz/`