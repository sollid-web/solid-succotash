# 🚀 Quick Fix Checklist - Login Not Working

## ✅ What You Need to Do (5 minutes)

### Step 1: Add Environment Variable to Vercel
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.wolvcapital.com`
   - **Environments:** Check all three boxes ☑️ Production ☑️ Preview ☑️ Development
6. Click **Save**

### Step 2: Redeploy Frontend
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **•••** menu (three dots)
4. Click **Redeploy**
5. Wait 1-2 minutes for completion ⏱️

### Step 3: Test Login
1. Visit: https://wolvcapital.com/accounts/login
2. Enter email and password
3. Click "Sign In"
4. **Expected:** Redirects to `https://api.wolvcapital.com/accounts/login/`
5. **Success:** Django login page appears!

---

## 🔍 How to Know It's Working

### ❌ BEFORE (broken):
```
Browser redirects to: http://localhost:8000/accounts/login/
Console shows: "Unchecked runtime.lastError: The message port closed"
Result: Login button does nothing or shows error
```

### ✅ AFTER (fixed):
```
Browser redirects to: https://api.wolvcapital.com/accounts/login/
Console: No errors
Result: Django login page loads and authentication works
```

---

## 🔐 Admin Login (separate from user login)

To access Django admin panel:
1. Go directly to: **https://api.wolvcapital.com/admin/**
2. Use your superuser credentials
3. This bypasses the frontend completely

---

## 🛠️ If It Still Doesn't Work

### Check 1: Environment Variable is Set
- Go to Vercel Settings → Environment Variables
- Verify `NEXT_PUBLIC_API_URL` = `https://api.wolvcapital.com`
- Ensure all 3 environment checkboxes are checked

### Check 2: Clear Cache
- Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or try incognito/private window

### Check 3: Backend is Running
- Visit: https://api.wolvcapital.com/healthz/
- Should return: `"ok"`
- If not, check your Render service status

### Check 4: CORS/CSRF Settings on Backend
Your Render service needs these environment variables:
- `CORS_ALLOWED_ORIGINS`: `https://wolvcapital.com`
- `CSRF_TRUSTED_ORIGINS`: `https://wolvcapital.com`
- `CUSTOM_DOMAIN`: `api.wolvcapital.com`

---

## 📝 Summary

**One variable fixes everything:**
```
NEXT_PUBLIC_API_URL = https://api.wolvcapital.com
```

That's literally all you need to set in Vercel. No other API URLs required for login to work!
