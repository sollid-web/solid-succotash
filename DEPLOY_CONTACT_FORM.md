# Contact Form Deployment Guide

## ✅ What's Been Completed

1. **Contact Form Implementation** (Commit: 4e8a7e8)
   - ModelForm with SupportRequest model
   - User-friendly contact page at `/contact/`
   - Admin panel enhancements (bulk actions, filters)
   - Multi-admin email notifications
   - Metadata capture (IP, user agent, source URL)

2. **Configuration Generation** (Commit: beab1ba)
   - Auto-generated SECRET_KEY for production
   - Created `.env` for local development
   - Created `RENDER_ENV_VARS.txt` with all required variables
   - Email SMTP setup instructions (Gmail, SendGrid, Mailgun)

3. **Git Repository**
   - All code committed and pushed to GitHub
   - Render auto-deploys from `main` branch
   - Frontend deployed to Vercel

## 🚀 Deployment Steps (5 Minutes)

### Step 1: Apply Environment Variables to Render

1. Open the file `RENDER_ENV_VARS.txt` in this repository

2. Login to Render Dashboard: https://dashboard.render.com/

3. Select your **WolvCapital** web service

4. Go to **Environment** tab (left sidebar)

5. For each variable in `RENDER_ENV_VARS.txt`:
   - Click **"Add Environment Variable"**
   - Copy KEY (e.g., `SECRET_KEY`)
   - Copy VALUE (e.g., `Vr6jAdqRwdBpkA8mDwvZxfW5PjgBSLlL...`)
   - Click **"Add"**

6. **UPDATE THESE VALUES** before saving:
   ```
   EMAIL_HOST_USER=your-actual-email@gmail.com
   EMAIL_HOST_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL_RECIPIENTS=email1@company.com,email2@company.com,email3@company.com,email4@company.com,email5@company.com
   CORS_ALLOWED_ORIGINS=https://your-actual-frontend-url.vercel.app
   ```

7. Click **"Save Changes"** at the bottom

8. Render will **automatically redeploy** (~2-3 minutes)

### Step 2: Setup Gmail App Password (Required)

**Option A: Gmail SMTP (Simple for testing)**

1. Enable 2-Factor Authentication:
   - Go to: https://myaccount.google.com/security
   - Turn on **2-Step Verification**

2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select **"Mail"** and your device
   - Click **"Generate"**
   - Copy the **16-character password** (remove spaces)
   - Use this as `EMAIL_HOST_PASSWORD` in Render

**Option B: SendGrid (Recommended for production)**

1. Sign up: https://sendgrid.com/ (free tier: 100 emails/day)

2. Get API key from dashboard

3. Update Render environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_HOST_USER=apikey
   EMAIL_HOST_PASSWORD=your-sendgrid-api-key
   ```

### Step 3: Verify Deployment

1. **Check Render Logs**:
   - Go to Render Dashboard → Logs
   - Wait for "Starting Gunicorn"
   - No SECRET_KEY errors
   - No email configuration warnings

2. **Test Contact Form**:
   - Visit: `https://api.wolvcapital.com/contact/`
   - Fill out form with test data
   - Submit
   - Check admin emails for notification

3. **Check Django Admin**:
   - Visit: `https://api.wolvcapital.com/admin/`
   - Login with superuser credentials
   - Navigate to **Support Requests**
   - Verify test submission appears

4. **Frontend Integration** (if using custom frontend):
   - Update CORS_ALLOWED_ORIGINS with your Vercel URL
   - Contact form accessible at `/contact/` endpoint

## 📋 Environment Variables Reference

### Required (Must Update)
- `SECRET_KEY` ✅ Generated automatically
- `EMAIL_HOST_USER` ❌ Update with your email
- `EMAIL_HOST_PASSWORD` ❌ Update with App Password
- `ADMIN_EMAIL_RECIPIENTS` ❌ Update with your 5 admin emails

### Auto-Generated (Can Keep As-Is)
- `DEBUG=0` ✅
- `EMAIL_HOST=smtp.gmail.com` ✅
- `EMAIL_PORT=587` ✅
- `EMAIL_USE_TLS=True` ✅

### Optional (Update if Using Custom Domain)
- `CORS_ALLOWED_ORIGINS` - Add your frontend URL
- `CUSTOM_DOMAIN` - Your custom domain
- `PUBLIC_SITE_URL` - Your public frontend URL

## 🧪 Local Testing

**Local development is already configured!**

1. Start Django:
   ```bash
   python manage.py runserver
   ```

2. Visit: http://localhost:8000/contact/

3. Submit test form

4. Check terminal - emails print to console (EMAIL_BACKEND=console)

5. Check admin: http://localhost:8000/admin/core/supportrequest/

## 🔧 Troubleshooting

### Emails Not Sending
- Check spam folder
- Verify App Password (16 characters, no spaces)
- Check Render logs for SMTP errors
- Test with SendGrid instead of Gmail

### 500 Error on Contact Page
- Check Render logs for exceptions
- Verify all environment variables are set
- Ensure SECRET_KEY is set correctly

### CORS Errors from Frontend
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Include protocol (https://)
- No trailing slash

### Contact Form Not Saving
- Check database migrations are applied
- Verify SupportRequest model exists in admin
- Check Render shell: `python manage.py showmigrations`

## 📞 Support

Contact form features:
- ✅ Email notifications to 5 admin accounts
- ✅ Database storage with admin panel
- ✅ Bulk actions (mark in progress/resolved)
- ✅ Search/filter by status, date, topic
- ✅ Metadata capture (IP, browser, source)
- ✅ Authenticated users auto-filled
- ✅ Responsive Tailwind CSS design

**Next Steps**: Apply environment variables to Render dashboard and test!
