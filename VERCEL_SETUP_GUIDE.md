# Vercel Environment Variables Setup Guide

## The Problem
Your frontend is trying to connect to `http://localhost:8000` instead of your Render backend at `https://api.wolvcapital.com`. This causes login failures because:
- The login form redirects to localhost (your computer)
- Browser can't reach localhost from production
- You see "message port closed" errors in console

## The Solution: Set ONE Environment Variable in Vercel

### Step-by-Step Instructions:

1. **Go to your Vercel project dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project (likely named `wolvcapital-frontend` or similar)

2. **Navigate to Settings → Environment Variables**
   - Click "Settings" in the top navigation
   - Click "Environment Variables" in the left sidebar

3. **Add the following variable:**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://api.wolvcapital.com` | Production, Preview, Development |

   **Important:** Make sure to check ALL THREE environment checkboxes (Production, Preview, Development) when adding the variable!

4. **Redeploy your frontend**
   - After saving the environment variable, Vercel will prompt you to redeploy
   - Click "Redeploy" or go to the Deployments tab
   - Click the three dots (•••) next to your latest deployment
   - Select "Redeploy"

5. **Wait for deployment to complete**
   - This usually takes 1-2 minutes
   - Watch the deployment logs to ensure it completes successfully

6. **Test your login**
   - Visit `https://wolvcapital.com/accounts/login`
   - Enter your credentials
   - You should now be redirected to `https://api.wolvcapital.com/accounts/login/` (Django backend)
   - After successful login, Django will redirect you back to the dashboard

## How to Verify It's Working

### Before Fix:
- Browser console shows: "message port closed" errors
- Login redirects to `http://localhost:8000/accounts/login/`
- Login button does nothing or shows error

### After Fix:
- Login redirects to `https://api.wolvcapital.com/accounts/login/`
- You see the Django allauth login page
- After login, you're redirected back to your dashboard

## Admin Login
For admin access, directly visit:
- **Admin URL:** `https://api.wolvcapital.com/admin/`
- This bypasses the Next.js frontend entirely
- Use your superuser credentials created with `create_admin.py`

## Troubleshooting

### If login still doesn't work after setting the variable:

1. **Clear Vercel build cache:**
   - Go to Settings → General → "Clear build cache and redeploy"

2. **Check browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

3. **Verify the environment variable is set:**
   - Go to Vercel Settings → Environment Variables
   - Confirm `NEXT_PUBLIC_API_URL` shows: `https://api.wolvcapital.com`
   - Ensure it's enabled for all environments

4. **Check your backend is running:**
   - Visit `https://api.wolvcapital.com/healthz/` - should return "ok"
   - Visit `https://api.wolvcapital.com/admin/` - should show Django admin login

5. **Check Render environment variables:**
   - Ensure your Render service has these variables set:
     - `CORS_ALLOWED_ORIGINS`: `https://wolvcapital.com`
     - `CSRF_TRUSTED_ORIGINS`: `https://wolvcapital.com`
     - `CUSTOM_DOMAIN`: `api.wolvcapital.com`

## Why This Works

- Next.js environment variables must start with `NEXT_PUBLIC_` to be accessible in browser code
- When you set `NEXT_PUBLIC_API_URL`, it replaces the `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'` fallback
- Your login form uses this to redirect users to the correct Django backend
- Django handles authentication and redirects back to your frontend

## Summary

**You only need to set ONE variable in Vercel:**
```
NEXT_PUBLIC_API_URL = https://api.wolvcapital.com
```

That's it! No other API URLs needed for basic login functionality.
