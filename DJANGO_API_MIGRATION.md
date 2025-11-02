# Django API-Only Migration Complete

## Summary

WolvCapital has been successfully migrated from a monolithic Django template-based application to a **decoupled architecture**:

- **Backend**: Django REST Framework API (port 8000)
- **Frontend**: Next.js application (port 3000, in `frontend/` directory)

## What Changed

### Backend (Django) - API Only

**Removed:**
- All Django template-based views (dashboard, plans, invest, deposit, withdraw, etc.)
- User-facing HTML templates (kept only email templates)
- Static assets (CSS, JS, images) - now managed by Next.js

**Added:**
- `django-cors-headers` for cross-origin requests from Next.js
- New API endpoints for agreements, notifications, support requests, email preferences
- Simplified `core/views.py` to only health check and PDF exports

**Retained:**
- All business logic services (`transactions.services`, `investments.services`)
- Django Admin panel (unchanged)
- Email notification system (using email templates)
- All models, serializers, and existing API endpoints

### Frontend (Next.js)

All user-facing UI now lives in the `frontend/` directory (separate application).

## Running in Development

### 1. Start Django API (Terminal 1)

```bash
cd /workspaces/solid-succotash
python manage.py runserver
```

API available at: `http://localhost:8000`

### 2. Start Next.js Frontend (Terminal 2)

```bash
cd /workspaces/solid-succotash/frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:3000`

## API Endpoints

### Public
- `GET /api/plans/` - Investment plans
- `GET /api/agreements/` - Legal agreements
- `POST /api/support/` - Support requests

### Authenticated User
- `GET /api/investments/` - User investments
- `POST /api/investments/` - Create investment
- `GET /api/transactions/` - User transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/wallet/` - User wallet balance
- `GET /api/notifications/` - User notifications
- `POST /api/notifications/{id}/mark-read/` - Mark notification read
- `POST /api/notifications/mark-all-read/` - Mark all read
- `GET /api/notifications/unread-count/` - Unread count
- `POST /api/agreements/{id}/accept/` - Accept agreement
- `GET /api/profile/email-preferences/` - Email preferences
- `PUT/PATCH /api/profile/email-preferences/` - Update preferences

### Admin Only
- `GET /api/admin/transactions/` - All transactions
- `PATCH /api/admin/transactions/{id}/` - Approve/reject transaction
- `GET /api/admin/investments/` - All investments
- `PATCH /api/admin/investments/{id}/` - Approve/reject investment

### Utility
- `GET /healthz/` - Health check
- `GET /agreements/{id}/pdf/` - Download agreement PDF

## CORS Configuration

Default CORS origins for local development:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Set `CORS_ALLOWED_ORIGINS` environment variable for production (comma-separated):

```bash
CORS_ALLOWED_ORIGINS=https://app.wolvcapital.com,https://www.wolvcapital.com
```

## Deployment Strategy

### Option 1: Separate Services (Recommended)

- **Django API**: Deploy to Render/Heroku/Railway
- **Next.js Frontend**: Deploy to Vercel/Netlify

Configure CORS to allow your frontend domain.

### Option 2: Same Host (Reverse Proxy)

Use nginx/Caddy to serve both:
- `/api/*` → Django (port 8000)
- `/*` → Next.js (port 3000)

## Environment Variables

Add to your Django `.env`:

```bash
# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Add production frontend URLs when deploying
# CORS_ALLOWED_ORIGINS=https://app.example.com,https://www.example.com
```

## Test Suite

All 36 tests passing:
- Core model tests
- API endpoint tests (plans, investments, transactions, agreements, notifications)
- Admin permission tests
- Email preference tests
- Support request tests

Run tests:
```bash
python manage.py test core.tests api.tests users.tests
```

## Migration Checklist

✅ Installed `django-cors-headers`  
✅ Configured CORS middleware  
✅ Removed legacy Django template views  
✅ Deleted old templates (except emails)  
✅ Deleted old static assets  
✅ Added new API endpoints (agreements, notifications, support, preferences)  
✅ Updated tests to use API endpoints  
✅ Documented separate frontend/backend workflow  
✅ All tests passing (36/36)

## Next Steps

1. **Frontend Development**: Build Next.js UI consuming these APIs
2. **Authentication**: Configure Next.js to use Django's session/JWT auth
3. **Deployment**: Set up CI/CD for both services
4. **Documentation**: Create API documentation (consider OpenAPI/Swagger)

## Rollback Plan

If needed, the previous template-based architecture is preserved in git history. To rollback:

```bash
git log --oneline  # Find commit before migration
git checkout <commit-hash>
```

---

**Migration completed**: November 2, 2025  
**Django version**: 5.0.7  
**DRF version**: 3.15.2  
**Test status**: ✅ All passing (36/36)
