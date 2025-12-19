# WolvCapital Deployment Architecture

## Production Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                            USER'S BROWSER                               │
│                         https://wolvcapital.com                         │
│                                                                         │
└───────────────────────┬─────────────────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
        ┌───────────────┴────────────────┐
        │                                │
        ▼                                ▼
┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│  Next.js Frontend   │         │   Django Backend    │
│  ═══════════════    │◀────────│   ═══════════════   │
│                     │  CORS   │                     │
│  Vercel Platform    │ Headers │  Render Platform    │
│  ─────────────      │         │  ────────────       │
│                     │         │                     │
│  • React 18.3       │         │  • Django 5.0       │
│  • Next.js 14.2     │         │  • DRF 3.15.2       │
│  • TypeScript       │         │  • Python 3.12      │
│  • Tailwind CSS     │         │  • Gunicorn         │
│  • Static Export    │         │  • WhiteNoise       │
│                     │         │                     │
│  Port: 443 (HTTPS)  │         │  Port: 443 (HTTPS)  │
│                     │         │                     │
│  URL:               │  API    │  URL:               │
│  wolvcapital        │ Calls   │  wolvcapital-api    │
│  .vercel.app        │────────▶│  .onrender.com      │
│                     │         │                     │
│  Routes:            │         │  Routes:            │
│  • / (home)         │         │  • /api/*           │
│  • /dashboard       │         │  • /admin/          │
│  • /plans           │         │  • /healthz/        │
│  • /invest          │         │  • /agreements/*/pdf│
│  • /deposits        │         │                     │
│  • /notifications   │         │  Endpoints:         │
│                     │         │  • GET /api/plans/  │
│  Environment:       │         │  • POST /api/       │
│  ─────────────      │         │    investments/     │
│  NEXT_PUBLIC_       │         │  • GET /api/        │
│  API_URL=           │         │    transactions/    │
│  https://           │         │  • POST /api/       │
│  wolvcapital-api    │         │    notifications/   │
│  .onrender.com      │         │                     │
│                     │         │  Environment:       │
│  Auto-Deploy:       │         │  ─────────────      │
│  • main → prod      │         │  SECRET_KEY=***     │
│  • branches → prev  │         │  DEBUG=0            │
│                     │         │  DATABASE_URL=***   │
│  CDN: Global Edge   │         │  CORS_ALLOWED_      │
│  Cache: Automatic   │         │  ORIGINS=           │
│                     │         │  https://           │
└─────────────────────┘         │  wolvcapital        │
                                │  .vercel.app        │
                                │                     │
                                │  Auto-Deploy:       │
                                │  • main → deploy    │
                                │  • migrations run   │
                                │                     │
                                └──────────┬──────────┘
                                           │
                                           │ Internal
                                           │ Connection
                                           │
                                           ▼
                                ┌──────────────────────┐
                                │                      │
                                │  PostgreSQL Database │
                                │  ══════════════════  │
                                │                      │
                                │  Render Managed DB   │
                                │  ─────────────────   │
                                │                      │
                                │  • PostgreSQL 15     │
                                │  • Automated Backups │
                                │  • 256MB+ RAM        │
                                │  • Same Region       │
                                │                      │
                                │  Tables:             │
                                │  • users_user        │
                                │  • users_profile     │
                                │  • users_userwallet  │
                                │  • investments_*     │
                                │  • transactions_*    │
                                │  • core_agreement    │
                                │                      │
                                │  Connection:         │
                                │  Internal URL Only   │
                                │  (not public)        │
                                │                      │
                                └──────────────────────┘
```

## Data Flow

### User Registration
```
User Browser
    │
    ├─▶ Frontend (Vercel): /register form
    │
    └─▶ API Call: POST /api/accounts/signup/
            │
            └─▶ Backend (Render): Create user
                    │
                    └─▶ Database: Insert user, profile, wallet
                            │
                            └─▶ Email Service: Send welcome email
```

### Investment Creation
```
User Browser
    │
    ├─▶ Frontend: /invest form
    │
    └─▶ API Call: POST /api/investments/
            │
            └─▶ Backend: create_investment() service
                    │
                    ├─▶ Database: Create UserInvestment (status=pending)
                    │
                    └─▶ Notification: Notify admin of new investment
                            │
                            └─▶ Admin reviews in Django Admin
                                    │
                                    └─▶ Admin clicks "Approve"
                                            │
                                            └─▶ API: POST /api/admin/investments/{id}/approve/
                                                    │
                                                    ├─▶ Update status=approved
                                                    ├─▶ Set start/end dates
                                                    ├─▶ Create audit log
                                                    └─▶ Send email notification
```

### Transaction Processing
```
User Browser
    │
    ├─▶ Frontend: /deposit form
    │
    └─▶ API Call: POST /api/transactions/
            │
            └─▶ Backend: create_transaction() service
                    │
                    ├─▶ Database: Create Transaction (status=pending)
                    │
                    └─▶ Admin Notification
                            │
                            └─▶ Admin verifies proof
                                    │
                                    └─▶ API: POST /api/admin/transactions/{id}/approve/
                                            │
                                            ├─▶ Update status=approved
                                            ├─▶ Credit wallet (atomic)
                                            ├─▶ Create audit log
                                            └─▶ Send confirmation email
```

## Security Layers

```
┌────────────────────────────────────────────────────────────┐
│ Layer 1: HTTPS/TLS                                         │
│ ─────────────────────────────────────────────────────────  │
│ • All traffic encrypted (Vercel & Render auto-provision)   │
│ • TLS 1.2+ minimum                                         │
│ • HSTS headers enabled                                     │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 2: CORS & CSRF Protection                            │
│ ─────────────────────────────────────────────────────────  │
│ • CORS_ALLOWED_ORIGINS whitelist                           │
│ • CSRF_TRUSTED_ORIGINS match CORS                          │
│ • Django CSRF tokens for state-changing requests           │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 3: Authentication                                    │
│ ─────────────────────────────────────────────────────────  │
│ • django-allauth session-based auth                        │
│ • Email-only registration (no usernames)                   │
│ • Password validation rules                                │
│ • Rate limiting on auth endpoints                          │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 4: Authorization                                     │
│ ─────────────────────────────────────────────────────────  │
│ • DRF permissions (IsAuthenticated, IsAdminUser)           │
│ • Role-based access (Profile.role)                         │
│ • Object-level permissions (user can only see own data)    │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 5: Business Logic                                    │
│ ─────────────────────────────────────────────────────────  │
│ • Service layer validation                                 │
│ • Database constraints (positive amounts, etc.)            │
│ • Atomic transactions (all-or-nothing)                     │
│ • Manual admin approval required                           │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 6: Audit & Monitoring                                │
│ ─────────────────────────────────────────────────────────  │
│ • AdminAuditLog for all approvals/rejections               │
│ • Request ID correlation in logs                           │
│ • Email notifications for critical actions                 │
│ • Health check monitoring (/healthz/)                      │
└────────────────────────────────────────────────────────────┘
```

## Environment Variables Map

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://wolvcapital-api.onrender.com
```

### Backend (Render)
```bash
# Django Core
SECRET_KEY=<auto-generated-secret>
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=wolvcapital-api.onrender.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# CORS & Security
CORS_ALLOWED_ORIGINS=https://wolvcapital.vercel.app
CSRF_TRUSTED_ORIGINS=https://wolvcapital.vercel.app

# Email (Optional)
# Recommended (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_BACKEND=core.email_backends.resend.ResendEmailBackend
DEFAULT_FROM_EMAIL=WolvCapital <support@wolvcapital.com>

# Fallback (SMTP)
SMTP_HOST=smtp.privateemail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password

# Performance
WEB_CONCURRENCY=2
```

## Deployment Workflow

### Automatic Deployments

```
Developer pushes to GitHub
        │
        ├─────────────────────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐            ┌──────────────┐
│   Vercel     │            │   Render     │
│   Webhook    │            │   Webhook    │
└──────┬───────┘            └──────┬───────┘
       │                           │
       ▼                           ▼
  Build Next.js              Build Django
  (npm run build)            (pip install)
       │                           │
       ▼                           ▼
  Deploy to CDN              Start Gunicorn
  (Automatic)                (bash start.sh)
       │                           │
       ▼                           ▼
  Live on Vercel             Live on Render
  (Instant global)           (~2-3 minutes)
```

### Manual Migrations

```bash
# Via Render Dashboard Shell
python manage.py migrate
python manage.py seed_plans
python manage.py createsuperuser
python manage.py payout_roi
```

## Monitoring & Logs

### Vercel (Frontend)
- **Build Logs**: Dashboard → Deployments → Select deployment
- **Runtime Logs**: Real-time function logs (serverless)
- **Analytics**: Web Vitals, page views, load times
- **Alerts**: Build failures via email/Slack

### Render (Backend)
- **Application Logs**: Dashboard → Logs tab (real-time stream)
- **Metrics**: CPU, memory, request count, response times
- **Health Checks**: `/healthz/` endpoint checked every 30s
- **Alerts**: Service down, high error rate, resource limits

### Database (Render PostgreSQL)
- **Connection Stats**: Active connections, idle connections
- **Performance**: Query performance insights
- **Backups**: Automatic daily backups (retained 7 days on free tier)
- **Alerts**: Connection limits, storage usage

## Cost Breakdown

### Free Tier (Development)
```
Vercel:
  ✓ Unlimited deployments
  ✓ Unlimited bandwidth
  ✓ Global CDN
  ✓ Automatic HTTPS
  Total: $0/month

Render:
  ✓ Web Service (spins down after 15min idle)
  ✓ PostgreSQL (90 day trial, then $7/mo)
  Total: $0/month (temporary)

Combined: $0/month (with limitations)
```

### Production Tier
```
Vercel Pro:
  • Unlimited deployments
  • Priority support
  • Team collaboration
  • Advanced analytics
  Cost: $20/month per user

Render:
  • Web Service (Starter): $7/month
    - 512MB RAM
    - Always on
    - No spin down
  • PostgreSQL (Starter): $7/month
    - 256MB RAM
    - 1GB storage
    - Daily backups
  Cost: $14/month

Combined: $34/month minimum
         $54/month with Pro Vercel
```

### Enterprise Tier
```
Vercel Enterprise:
  • Custom pricing
  • SLA guarantees
  • Advanced security
  • Dedicated support

Render:
  • Web Service (Standard+): $25/month
    - 2GB RAM
    - Better performance
  • PostgreSQL (Standard): $20/month
    - 1GB RAM
    - 10GB storage
  Cost: $45/month

Combined: Custom pricing (contact sales)
```

## Performance Characteristics

### Frontend (Vercel)
- **First Load**: ~500ms (global CDN)
- **Subsequent Loads**: ~100ms (cached)
- **API Calls**: Depends on backend response time
- **CDN**: 40+ global edge locations

### Backend (Render)
- **API Response Time**: ~100-300ms (simple queries)
- **Database Queries**: ~10-50ms (same region)
- **Cold Start**: N/A (always-on on paid tiers)
- **Concurrent Requests**: ~20-50 (depends on plan)

### Database (Render PostgreSQL)
- **Query Time**: ~5-20ms (indexed queries)
- **Connection Pool**: Up to 22 connections (Starter)
- **Backup Frequency**: Daily automatic backups
- **Failover**: Automatic on paid tiers

---

**This architecture provides:**
- ✅ Clear separation of concerns
- ✅ Independent scaling of frontend/backend
- ✅ Modern development workflow
- ✅ Production-ready security
- ✅ Cost-effective hosting
- ✅ Easy maintenance and updates
