# WolvCapital (solid-succotash) — Copilot Coding Agent Instructions

WolvCapital is a Django 5 investment platform with a decoupled Next.js 14 frontend. **All financial actions require manual admin approval**; never auto-approve deposits/withdrawals/investments.

## Big Picture
- Backend: Django + DRF under `wolvcapital/` and app modules (`core/`, `users/`, `transactions/`, `investments/`, `referrals/`, `api/`).
- API routing: DRF `DefaultRouter` + extra endpoints in `api/urls.py`; project routes in `wolvcapital/urls.py` (`/api/`, `/admin/`, `/healthz/`).
- Frontend: Next.js app in `frontend/` (App Router). Local: API `:8000`, frontend `:3000`.

## Non-Negotiable Business Rule (Services Only)
- Do **not** mutate `Transaction`, `UserInvestment`, or `UserWallet` directly (no `status = ...; save()`).
- Use service functions so audit + notifications happen and wallet writes are safe:

```py
from transactions.services import approve_transaction
approve_transaction(txn, admin_user, notes="Verified documents")
```

Key service entrypoints:
- `transactions/services.py`: `create_transaction()`, `approve_transaction()`, `reject_transaction()`
- `investments/services.py`: `create_investment()`, `approve_investment()`, `reject_investment()`

Service invariants you must preserve when changing finance logic:
- Approvals run in `@transaction.atomic` and lock wallets via `UserWallet.objects.select_for_update()`.
- Approve/reject always writes `AdminAuditLog` (UUID stored as `str(entity.id)`), resolves `AdminNotification`, and triggers in-app + email notifications (`core.email_service.EmailService`).

## Developer Workflows
- Bootstrap (backend): `python manage.py migrate && python manage.py seed_plans && python manage.py createsuperuser`
- Run (backend): `python manage.py runserver` (health: `/healthz/`)
- ROI job: `python manage.py payout_roi [--dry-run]` creates ROI *deposit* transactions + `DailyRoiPayout` idempotency; **transactions still require admin approval**.
- Promote admin: `python manage.py promote_admin user@example.com` (also sets `is_staff=True`).
- Frontend dev: `cd frontend && npm install && npm run dev` (set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`).

## Tests & Quality
- Tests are pytest-django (see `pytest.ini` + `conftest.py`): run `pytest` from repo root.
- Tooling is pinned in `requirements-dev.txt`: `ruff check .`, `black .`, `mypy`.

## Config / Deployment Notes
- Settings load `.env` via `django-environ` in `wolvcapital/settings.py`; `SECRET_KEY` is required when `DEBUG=0`.
- Cross-origin/auth is environment-driven (`CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `CUSTOM_DOMAIN`, Render/Vercel hosts).
- Render entrypoint is `start.sh` (migrate/collectstatic/seed); env vars and cron live in `render.yaml`.
