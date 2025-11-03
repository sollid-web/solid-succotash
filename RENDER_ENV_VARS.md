# WolvCapital Render.com Environment Variables

Set these in your Render.com service dashboard:

## Required Environment Variables

```bash
# Django Configuration
DEBUG=0
SECRET_KEY=your-generated-secret-key-here
DJANGO_SETTINGS_MODULE=wolvcapital.settings

# Render Environment Variables for wolvcapital-api

Copy these environment variables when creating your Render web service:

## Required Environment Variables

### Database
```
DATABASE_URL=postgresql://ken_1ikd_user:yfr2VkGl9kvxTDjm16GVubHqGTEMkWNo@dpg-d36ug5mmcj7s73e0g6vg-a.oregon-postgres.render.com/ken_1ikd
```

# Security (Render sets automatically)
RENDER_EXTERNAL_HOSTNAME=your-app.onrender.com (Auto-set by Render)

# Optional: Email Configuration (for production notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## Environment Variables Set Automatically by Render

- `RENDER_EXTERNAL_HOSTNAME` - Your app's domain
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Port for Gunicorn to bind to

## Manual Configuration in Render Dashboard

1. Go to your service dashboard
2. Click "Environment"
3. Add these key-value pairs:
   - `DEBUG` = `0`
   - `SECRET_KEY` = (generate using: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)

## Verification

After deployment, check:

- Visit <https://your-app.onrender.com>
- Admin login: <https://your-app.onrender.com/admin/>
- API endpoints: <https://your-app.onrender.com/api/>

## Troubleshooting

If you see "Bad Request (400)":

1. Check environment variables are set
2. Verify DEBUG=0 (not "False")
3. Ensure RENDER_EXTERNAL_HOSTNAME is detected
4. Check logs in Render dashboard
