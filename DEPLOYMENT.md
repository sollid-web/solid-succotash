# WolvCapital Deployment Guide

## Quick Deploy to Render.com (Recommended)

### 1. Connect Repository
1. Go to https://render.com
2. Sign up/login with GitHub
3. Click "New Web Service"
4. Connect your `solid-succotash` repository

### 2. Configure Service
- **Name**: wolvcapital
- **Environment**: Python 3.12
- **Build Command**: (Auto-detected from render.yaml)
- **Start Command**: (Auto-detected from render.yaml)

### 3. Set Environment Variables
In Render Dashboard > Environment:
```
SECRET_KEY=your-django-secret-key
DEBUG=False
ALLOWED_HOSTS=.render.com
DATABASE_URL=(auto-configured)
CSRF_TRUSTED_ORIGINS=https://your-app-name.onrender.com
```

### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Your app will be available at: https://your-app-name.onrender.com

## Alternative Platforms

### Railway.app
1. Connect GitHub repository
2. Add PostgreSQL database
3. Deploy automatically

### DigitalOcean App Platform
1. Create new App from GitHub
2. Configure build settings
3. Add managed database

### Heroku
1. Create new app
2. Add Heroku Postgres add-on
3. Configure environment variables
4. Deploy via Git

## Post-Deployment Setup

### 1. Create Superuser
```bash
# Via Render console or SSH
python manage.py createsuperuser
```

### 2. Seed Investment Plans
```bash
python manage.py seed_plans
```

### 3. Create Crypto Wallets
```bash
python manage.py shell
# Run the crypto wallet creation script
```

### 4. Test Platform
- Visit your deployed URL
- Test user registration
- Create test deposit/investment
- Check admin panel functionality

## Domain Configuration

### Custom Domain (Optional)
1. Purchase domain from registrar
2. Add CNAME record pointing to Render URL
3. Configure custom domain in Render dashboard
4. Update ALLOWED_HOSTS and CSRF_TRUSTED_ORIGINS

### SSL Certificate
- Render provides automatic SSL certificates
- No additional configuration needed

## Monitoring & Maintenance

### Health Checks
- Monitor application logs in Render dashboard
- Set up uptime monitoring (UptimeRobot, etc.)
- Configure email alerts for downtime

### Database Backups
- Render provides automatic PostgreSQL backups
- Download backups regularly for safety

### Performance Optimization
- Monitor response times
- Optimize database queries if needed
- Consider Redis for caching (future enhancement)

## Security Considerations

### Environment Variables
- Never commit sensitive data to Git
- Use Render's environment variable management
- Rotate SECRET_KEY regularly

### HTTPS
- Always use HTTPS in production
- Configure proper security headers
- Enable CSRF protection

### Database Security
- Use strong database passwords
- Limit database access to application only
- Regular security updates