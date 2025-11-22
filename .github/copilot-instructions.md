# WolvCapital — AI Coding Agent Guide

WolvCapital is a Django 5 + Next.js investment platform where every financial action requires human review. Never auto-approve operations.

## Architecture Overview
**Fullstack Deployment**: Django REST API (Render.com) + Next.js frontend (Vercel)
- Apps: `core/` (health, email), `users/` (auth, wallets, notifications), `investments/` (plans, ROI), `transactions/` (deposits/withdrawals + audit), `api/` (DRF endpoints)
- Frontend: Next.js 14 with TypeScript, Tailwind CSS at `frontend/`
- Lifecycle: User submits → Admin approves/rejects via services → Audit + notifications recorded

## Critical Service Layer Pattern
**Never edit models directly** - always use services with `admin_user` parameter:

```python
# Good - proper audit trail
from transactions.services import approve_transaction
txn = approve_transaction(txn, admin_user, notes="Verified documents")

# Bad - bypasses audit and validation
txn.status = 'approved'; txn.save()  # Never do this
```

**Key Services**:
- `transactions.services`: `create_transaction()`, `approve_transaction()`, `reject_transaction()`
- `investments.services`: `create_investment()`, `approve_investment()`, `reject_investment()`
- All run in `@transaction.atomic` blocks with `select_for_update()` on wallets

## Essential Commands (Run in Order)
```bash
# Local setup
python manage.py migrate
python manage.py seed_plans          # Creates 4 investment plans (Pioneer, Vanguard, Horizon, Summit)
python manage.py createsuperuser

# ROI payouts (daily)
python manage.py payout_roi --dry-run  # Preview payouts
python manage.py payout_roi             # Execute (creates pending transactions)
```

## Model Architecture & Constraints
- `users.User` → `Profile.role` (user/admin) + `UserWallet.balance` (with DB constraints)
- `transactions.Transaction` uses UUID primary keys; `AdminAuditLog` tracks all approvals
- `investments.InvestmentPlan` (4 fixed plans) → `UserInvestment` (pending→approved→completed)
- `DailyRoiPayout` ensures idempotent ROI processing per investment/date

## API Patterns (DRF + ViewSets)
```
Public:  GET /api/plans/
User:    GET/POST /api/investments/, /api/transactions/, GET /api/wallet/  
Admin:   GET/POST /api/admin/transactions/{id}/approve/, /api/admin/investments/{id}/approve/
```

**Auth**: Session-based via django-allauth (email-only, no usernames)

## Frontend Integration
- **Local**: Django (`:8000`) + Next.js (`:3000`)
- **Production**: api.wolvcapital.com + wolvcapital.com  
- **CORS**: Set `CORS_ALLOWED_ORIGINS` in Django settings for frontend domains

## Deployment (Render + Vercel)
- **Backend**: `render.yaml` → `start.sh` (migrations + seed_plans + Gunicorn)
- **Frontend**: `cd frontend && vercel --prod`
- **Critical env vars**: `DATABASE_URL`, `SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`

## Development Standards
- **Code Quality**: Ruff linting configured in `pyproject.toml`
- **Testing**: `python manage.py test` (pytest config in `conftest.py`)
- **DB Queries**: Always use `select_related()` for `UserInvestment.plan`, `Transaction.user`
- **Logging**: JSON format with `request_id` when `DEBUG=False`

## Common Patterns & Gotchas
- **Investment Plans**: Fixed schema - use `seed_plans` to restore defaults
- **UUID Audit Logs**: Use `str(transaction.id)` in `AdminAuditLog.entity_id`
- **Wallet Locking**: Services use `select_for_update()` to prevent race conditions
- **ROI Processing**: Creates pending deposit transactions that require admin approval
- **Email Notifications**: User preferences stored in `Profile` model with granular controls

## Security & Business Rules
- All financial operations require manual admin approval
- Database constraints enforce positive amounts and valid ranges
- Services validate plan limits and user balances before approval
- Comprehensive audit trail for regulatory compliance
# WolvCapital - AI Coding Agent Instructions

## Project Overview
WolvCapital is a Django 5 investment platform with **manual off-chain approval workflows**. The core business model revolves around human oversight for all financial transactions and investments, with automated calculations but manual verification. This is NOT a traditional fintech app - all operations require admin approval.

## Architecture & Key Patterns

### Three-Tier Approval System
The platform follows a strict **pending → approved/rejected** flow for all financial operations:
- **Users** submit requests (investments, deposits, withdrawals)
- **Admins** manually review and approve/reject via Django admin or API
- **Services** handle the business logic with atomic transactions

**Critical**: Never auto-approve financial operations. All `services.py` functions require an `admin_user` parameter.

### App Structure
```
core/           # Main views, templates, forms (user-facing)
users/          # Profile, wallet models + admin promotion commands
investments/    # Investment plans, user investments + seeding commands
transactions/   # Deposits/withdrawals + comprehensive audit logging
api/            # REST endpoints (user + admin views)
```

### Model Relationships
- `User` (Django built-in) → `Profile` (role: user/admin) + `UserWallet` (balance)
- `InvestmentPlan` → `UserInvestment` (with ROI calculations)
- `Transaction` (UUID primary key) + `AdminAuditLog` (all admin actions)

**Data Constraints**: All models include database-level constraints for positive amounts, valid ROI ranges, and referential integrity.

## Development Workflows

### Essential Management Commands
```bash
# Setup new environment (always run in order)
python manage.py migrate
python manage.py seed_plans          # Creates 4 default investment plans
python manage.py createsuperuser     # Create first admin

# Post-deployment operations
python manage.py promote_admin user@example.com  # Promote existing users
```

### Service Layer Pattern
Never directly manipulate financial models - always use services:
```python
# Good
from investments.services import approve_investment
investment = approve_investment(investment, admin_user, "Verified documents")

# Bad - bypasses audit trail and validation
investment.status = 'approved'
investment.save()
```

**Key Services**:
- `investments.services`: `create_investment()`, `approve_investment()`, `reject_investment()`
- `transactions.services`: `create_transaction()`, `approve_transaction()`, `reject_transaction()`

### Template & Form Organization
Templates use inheritance from `base.html` with Tailwind CSS. Forms in `core/forms.py` handle validation before services. The dashboard (`core/dashboard.html`) is the main user interface showing wallet, investments, and recent transactions.

## Business Logic Specifics

### Investment Plans (Fixed Schema)

Four predefined plans with specific ROI/duration/amount ranges:
- Pioneer: 1.00% daily, 14 days, $100-$999
- Vanguard: 1.25% daily, 21 days, $1,000-$4,999
- Horizon: 1.50% daily, 30 days, $5,000-$14,999
- Summit: 2.00% daily, 45 days, $15,000-$100,000

**Don't modify these without running `seed_plans` command**.

### Transaction & ROI Processing
1. **Deposits**: User submits → Admin verifies → Wallet credited automatically
2. **Withdrawals**: User submits → Admin checks balance → Wallet debited if approved
3. **Investments**: User selects plan/amount → Admin approves → Start/end dates set automatically



4. **ROI payouts**: Daily ROI is calculated independently for each active `UserInvestment` plan. The resulting wallet update is triggered by ROI as part of daily returns, but only after admin authorization or via the scheduled payout command (`payout_roi`).

**Wallet balances are updated by ROI after admin approval or scheduled payout. All updates are atomic and require explicit authorization.**

**UUID Pattern**: `Transaction` uses UUID primary keys for security. Always use `str(transaction.id)` in audit logs.

### Permission System
- `User` role (default): Access dashboard, submit requests, view own data
- `Admin` role: Django admin access + API admin endpoints
- Role stored in `Profile.role`, synced with `User.is_staff`

## API Design

### Endpoint Categories
- **Public**: `/api/plans/` (investment plans)
- **User**: `/api/investments/`, `/api/transactions/`, `/api/wallet/` (own data only)
- **Admin**: `/api/admin/transactions/`, `/api/admin/investments/` (all data + approval actions)

**Authentication**: Session-based via django-allauth (email-only, no usernames)

## Deployment & Environment

### Local Development
```bash
pip install -r requirements.txt
python manage.py runserver  # Uses SQLite by default
```

### Production (Render.com)
- PostgreSQL via `DATABASE_URL` environment variable
- WhiteNoise for static files (no CDN needed)
- Gunicorn WSGI server
- Docker support included

**Environment Variables**: See `settings.py` for `django-environ` usage. `DEBUG=False` enables production security settings.

## Testing & Debug Patterns

### Key Debugging Areas
- **Service Failures**: Check admin audit logs in Django admin
- **Permission Issues**: Verify `Profile.role` and `User.is_staff` alignment
- **Balance Problems**: Trace through transaction approval services
- **Investment Calculations**: Verify `UserInvestment.total_return` property

### Common Gotchas
- Services use `@transaction.atomic` - failures rollback everything
- Model constraints are enforced at DB level - handle `ValidationError`
- Audit logs use string entity IDs to support both UUIDs and integers
- Allauth redirects to `/dashboard/` after login, not Django default

## Code Conventions

### Import Organization
```python
# Django imports first
from django.db import transaction
from django.contrib.auth.models import User

# Local imports last
from .models import Transaction
from transactions.services import approve_transaction
```

### Error Handling
Always catch and re-raise `ValidationError` from services, never generic `Exception` in financial operations.

### Database Queries
Use `select_related()` for ForeignKey relationships, especially `UserInvestment.plan` and `Transaction.user`.

---

**⚠️ Financial Security Reminder**: This platform handles real financial operations. Never bypass approval workflows, always validate amounts, and maintain comprehensive audit trails. When in doubt, err on the side of requiring manual admin review.
