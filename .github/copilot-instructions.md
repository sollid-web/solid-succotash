# WolvCapital — Copilot Agent Guide

WolvCapital is a Django 5 investment platform where every financial action requires human review. Services perform calculations, but admins approve or reject all money-moving operations. Never auto-approve.

## Architecture and flow
- Apps: `core/` (UI, forms), `users/` (auth, Profile, Wallet, notifications), `investments/` (plans, user investments, ROI), `transactions/` (deposits/withdrawals, admin audit + notifications), `api/` (DRF endpoints).
- Lifecycle: User submits → Admin approves/rejects via services → Audit + notifications recorded. All services run in `transaction.atomic()`.

## Must-use service layer (no direct model edits)
- Transactions: `transactions/services.py`
	- `create_transaction(user, tx_type, amount, reference, payment_method='bank_transfer', tx_hash='', wallet_address_used='')`
	- `approve_transaction(txn, admin_user, notes='')`, `reject_transaction(txn, admin_user, notes='')`
- Investments: `investments/services.py`
	- `create_investment(user, plan, amount)`
	- `approve_investment(investment, admin_user, notes='')`, `reject_investment(investment, admin_user, notes='')`
- Contracts: Approvals require `admin_user`; wallets are locked with `select_for_update()`; amounts must be positive and within plan bounds.

## Models and constraints
- `users.User` (custom `AUTH_USER_MODEL`), `Profile.role` governs admin access, `UserWallet` holds balances.
- `transactions.Transaction` uses UUID `id`, `status in {pending, approved, rejected}`; `AdminAuditLog` uses `entity` + string `entity_id`.
- `transactions.AdminNotification` and `users.UserNotification` implement admin/user notification channels.
- `investments.InvestmentPlan` (fixed four plans), `UserInvestment` (pending→approved→completed), `DailyRoiPayout` ensures idempotent daily ROI records.

## ROI payouts (idempotent)
- Command: `python manage.py payout_roi [--dry-run] [--date YYYY-MM-DD]` creates pending deposit transactions per approved investment and records `DailyRoiPayout`.
- Wallets are credited only after an admin approves those ROI deposit transactions.

## API surface (DRF)
- Public: `GET /api/plans/`
- User: `GET/POST /api/investments/`, `GET/POST /api/transactions/`, `GET /api/wallet/`
- Admin: `GET /api/admin/transactions/`, `POST /api/admin/transactions/{id}/approve|reject`, `GET /api/admin/investments/`, `POST /api/admin/investments/{id}/approve|reject`

## Developer workflow
- Setup: `pip install -r requirements.txt`; run `python manage.py migrate && python manage.py seed_plans && python manage.py createsuperuser`.
- Run: `python manage.py runserver` (SQLite locally). Tests: `python manage.py test`.
- Deployment: Render via `render.yaml` → `start.sh` + WhiteNoise; env: `SECRET_KEY`, `DATABASE_URL`, `DEBUG=0`, `DJANGO_SETTINGS_MODULE=wolvcapital.settings`.

## Conventions and gotchas
- Never bypass services for approvals; always pass `admin_user`. Log approvals via `AdminAuditLog` with `str(uuid)` for `entity_id`.
- Use `select_related()` on FK-heavy queries (e.g., `UserInvestment.plan`, `Transaction.user`).
- Plans are canonical; restore with `python manage.py seed_plans`. The `update_plans` command is destructive—use only for coordinated migrations.
- Auth: Email-only via django-allauth; redirects to `/dashboard/`. Request IDs via `wolvcapital.middleware.RequestIDMiddleware`. JSON logs when `DEBUG=0`.

### Example: approving a transaction
```python
from transactions.services import approve_transaction
txn = approve_transaction(txn, admin_user, notes="Verified bank proof")
```

Questions or gaps? Tell us which section is unclear or missing so we can extend these rules.
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