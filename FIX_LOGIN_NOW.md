# 🎯 THE ONLY THING YOU NEED TO DO

## Your Problem:
Login button redirects to `localhost` instead of your actual backend.

## The Fix:
Add **ONE** environment variable to Vercel.

---

## 📋 EXACT STEPS (Copy & Paste)

### 1. Go to Vercel Dashboard
Open: https://vercel.com/dashboard

### 2. Click Your Project
Find and click your WolvCapital/frontend project

### 3. Go to Settings → Environment Variables
- Click "Settings" (top menu)
- Click "Environment Variables" (left sidebar)

### 4. Click "Add New Variable"

### 5. Copy/Paste These Exact Values:

**Variable Name:**
```
NEXT_PUBLIC_API_URL
```

**Variable Value:**
```
https://api.wolvcapital.com
```

**Environments:**
- ✅ Production (check this)
- ✅ Preview (check this)
- ✅ Development (check this)

### 6. Click "Save"

### 7. Redeploy
- Vercel will ask "Redeploy to apply changes?"
- Click "Redeploy"
- Wait 1-2 minutes

### 8. Test It
1. Visit: https://wolvcapital.com/accounts/login
2. Enter your email/password
3. Click "Sign In"
4. **You should now see the Django login page!**

---

## ✅ How to Confirm It Worked

### Before (broken):
- Browser tries to load: `http://localhost:8000/...`
- Console error: "message port closed"
- Login fails

### After (working):
- Browser redirects to: `https://api.wolvcapital.com/accounts/login/`
- Django allauth login page appears
- You can successfully log in

---

## 🆘 Still Not Working?

### Check #1: Clear Browser Cache
Press: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Check #2: Try Incognito/Private Window
This bypasses all cache

### Check #3: Verify Backend is Running
Visit: https://api.wolvcapital.com/healthz/
Should show: "ok"

### Check #4: Verify Variable is Set
- Go back to Vercel Settings → Environment Variables
- Make sure `NEXT_PUBLIC_API_URL` shows up with value `https://api.wolvcapital.com`
- Make sure all 3 environment boxes are checked

---

## 🔐 Admin Login (Different from User Login)

To access Django admin:
- URL: https://api.wolvcapital.com/admin/
- This is separate from the frontend
- Use your superuser credentials

---

## 💡 Why This Works

Your frontend code has this:
```tsx
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

Without the environment variable, it defaults to `localhost` (your computer).

With the environment variable set, it uses `https://api.wolvcapital.com` (your Render backend).

**That's it! One variable fixes everything.**
