# Login Flow Diagram

## Current Problem (Without Environment Variable)

```
User clicks "Sign In"
    ↓
Frontend tries to redirect to: http://localhost:8000/accounts/login/
    ↓
Browser can't reach localhost (it's your computer, not the server)
    ↓
❌ LOGIN FAILS - "message port closed" error
```

## Solution (With Environment Variable)

```
Set in Vercel: NEXT_PUBLIC_API_URL = https://api.wolvcapital.com
    ↓
Redeploy frontend
    ↓
User clicks "Sign In"
    ↓
Frontend redirects to: https://api.wolvcapital.com/accounts/login/
    ↓
Django backend shows login page
    ↓
User enters credentials
    ↓
Django authenticates user
    ↓
Redirects back to: https://wolvcapital.com/dashboard/
    ↓
✅ USER IS LOGGED IN
```

## The One Setting That Fixes Everything

### In Vercel Dashboard:
```
Environment Variables → Add New:

Name:  NEXT_PUBLIC_API_URL
Value: https://api.wolvcapital.com
Envs:  ✓ Production  ✓ Preview  ✓ Development
```

### What This Does:
- Tells your Next.js frontend where the Django backend lives
- Changes all redirects from `localhost` to `api.wolvcapital.com`
- Fixes login, signup, password reset, and all auth flows

## Architecture Overview

```
┌─────────────────────────────────────┐
│  User Browser                        │
│  URL: wolvcapital.com                │
└──────────────┬──────────────────────┘
               │
               │ Clicks "Sign In"
               │
               ↓
┌─────────────────────────────────────┐
│  Vercel (Frontend)                   │
│  Next.js App                         │
│  Uses: NEXT_PUBLIC_API_URL           │
└──────────────┬──────────────────────┘
               │
               │ Redirects to:
               │ https://api.wolvcapital.com/accounts/login/
               │
               ↓
┌─────────────────────────────────────┐
│  Render (Backend)                    │
│  Django + PostgreSQL                 │
│  Domain: api.wolvcapital.com         │
│  Handles: Authentication             │
└──────────────┬──────────────────────┘
               │
               │ After successful login,
               │ redirects back to:
               │ https://wolvcapital.com/dashboard/
               │
               ↓
┌─────────────────────────────────────┐
│  User sees Dashboard                 │
│  ✅ Logged In Successfully           │
└─────────────────────────────────────┘
```

## Two Types of Login

### 1. User Login (Frontend)
- **URL:** https://wolvcapital.com/accounts/login
- **Process:** Frontend → Django → Back to Frontend
- **Needs:** `NEXT_PUBLIC_API_URL` environment variable

### 2. Admin Login (Backend Only)
- **URL:** https://api.wolvcapital.com/admin/
- **Process:** Direct to Django admin panel
- **Needs:** Nothing extra, works out of the box

## Quick Test Commands

### Test Backend is Running:
```bash
curl https://api.wolvcapital.com/healthz/
# Should return: "ok"
```

### Test Admin is Accessible:
```bash
curl https://api.wolvcapital.com/admin/
# Should return HTML (Django admin page)
```

### Test Frontend API URL (after setting environment variable):
1. Open browser console on https://wolvcapital.com/accounts/login
2. Type: `process.env.NEXT_PUBLIC_API_URL`
3. Should show: `https://api.wolvcapital.com`

---

**Bottom Line:** Set one variable in Vercel, redeploy, and login works! 🎉
