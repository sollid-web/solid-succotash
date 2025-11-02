# Quick Deployment Reference

## 🚀 Django Backend → Render

### 1. Create PostgreSQL Database
```
Dashboard → New + → PostgreSQL
Name: wolvcapital-db
Save the DATABASE_URL
```

### 2. Create Web Service
```
Dashboard → New + → Web Service
Name: wolvcapital-api
Runtime: Python 3
Build: pip install -r requirements.txt && python manage.py collectstatic --noinput
Start: bash start.sh
```

### 3. Environment Variables
```bash
SECRET_KEY=(auto-generate)
DEBUG=0
DATABASE_URL=(paste from step 1)
ALLOWED_HOSTS=wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://YOUR-FRONTEND.vercel.app  # Update after frontend deployed
CSRF_TRUSTED_ORIGINS=https://YOUR-FRONTEND.vercel.app
DJANGO_SETTINGS_MODULE=wolvcapital.settings
```

### 4. After Deploy - Run Shell Commands
```bash
python manage.py migrate
python manage.py seed_plans
python manage.py createsuperuser
```

### 5. Test
- Health: https://wolvcapital-api.onrender.com/healthz/
- Admin: https://wolvcapital-api.onrender.com/admin/
- API: https://wolvcapital-api.onrender.com/api/plans/

---

## ⚡ Next.js Frontend → Vercel

### Option A: CLI Deploy (Recommended)
```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

### Option B: Dashboard Deploy
```
1. Go to https://vercel.com/new
2. Import GitHub repo
3. Root Directory: frontend
4. Framework: Next.js
5. Add env: NEXT_PUBLIC_API_URL=https://wolvcapital-api.onrender.com
6. Deploy
```

### After Deploy
1. Note your Vercel URL (e.g., https://wolvcapital.vercel.app)
2. **Update Render backend** CORS settings with this URL
3. Redeploy backend on Render

---

## 🔄 Update CORS After Frontend Deploy

Go back to Render → Environment:
```bash
CORS_ALLOWED_ORIGINS=https://wolvcapital.vercel.app,https://www.wolvcapital.vercel.app
CSRF_TRUSTED_ORIGINS=https://wolvcapital.vercel.app,https://www.wolvcapital.vercel.app
```

Click Save (triggers redeploy)

---

## ✅ Quick Test Checklist

Backend:
- [ ] /healthz/ returns {"status":"ok"}
- [ ] /admin/ loads Django admin
- [ ] /api/plans/ returns investment plans JSON

Frontend:
- [ ] Site loads without errors
- [ ] Check browser console - no CORS errors
- [ ] Can fetch data from API

Integration:
- [ ] Create test account
- [ ] Submit test deposit
- [ ] Check appears in Django admin

---

## 🔧 Common Issues

### CORS Error
```
❌ Access-Control-Allow-Origin error
✅ Update CORS_ALLOWED_ORIGINS on Render to include your Vercel URL (exact match)
```

### 502 Bad Gateway
```
❌ Backend won't start
✅ Check Render logs, verify DATABASE_URL is set
```

### Frontend Can't Connect
```
❌ API requests fail
✅ Verify NEXT_PUBLIC_API_URL is set correctly in Vercel
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│                                             │
│  Frontend (Next.js)                         │
│  https://wolvcapital.vercel.app             │
│  Port: 443 (HTTPS)                          │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ API Requests
                   │ (CORS enabled)
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  Backend API (Django)                       │
│  https://wolvcapital-api.onrender.com       │
│  Port: 443 (HTTPS)                          │
│                                             │
│  - REST API (/api/)                         │
│  - Admin Panel (/admin/)                    │
│  - Health Check (/healthz/)                 │
│                                             │
└──────────────────┬──────────────────────────┘
                   │
                   │ Database Connection
                   ▼
┌─────────────────────────────────────────────┐
│                                             │
│  PostgreSQL Database                        │
│  Render Managed                             │
│  Internal Connection                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 💰 Cost

**Free Tier (Testing)**:
- Render: Free (spins down after 15min idle)
- Vercel: Free (unlimited personal projects)

**Production**:
- Render: $7/mo web service + $7/mo database
- Vercel: $20/mo Pro plan
- Total: ~$34/mo

---

## 🔗 Important URLs

Render Dashboard: https://dashboard.render.com
Vercel Dashboard: https://vercel.com/dashboard
Django CORS Docs: https://github.com/adamchainz/django-cors-headers

---

See `DEPLOYMENT_GUIDE_RENDER_VERCEL.md` for full detailed instructions.
