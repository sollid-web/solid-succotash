# WolvCapital - Professional Investment Platform

WolvCapital is a Django 5 investment platform where every financial action requires human oversight. Automated services calculate returns and enforce business rules, while administrators approve or reject all transactions and investments.

## Key Features

### Manual Off-Chain Approvals
- Deposits, withdrawals, and investments remain pending until an administrator verifies them.
- Service-layer functions require an `admin_user`, ensuring audit trails and accountability.
- All approval decisions are stored in `AdminAuditLog` with reference identifiers.

### Investment Management
- Four predefined investment plans with fixed ROI ranges and durations.
- Wallet balances update atomically after approvals to prevent inconsistent states.
- Dashboards show wallet history, active plans, and recent transactions.

### Security and Compliance
- Email-only authentication via django-allauth and synchronized staff roles.
- Legal agreements, privacy policies, and risk disclosures stored as versioned content.
- Structured logging with request correlation identifiers aids forensic reviews.

### Administrative Tooling
- Enhanced Django Admin configuration with bulk approval actions and filters.
- REST API endpoints for both user and admin workflows.
- Management commands to seed data, promote admins, and process ROI payouts.

## Technology Stack

- Python 3.12 and Django 5.0
- PostgreSQL (Render ready) with SQLite fallback for local development
- Django REST Framework for API endpoints
- Tailwind CSS and custom branding assets
- WhiteNoise for static file serving
- Dockerfile and `render.yaml` for deployment on Render.com

## Getting Started

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd solid-succotash
   python -m venv venv
   venv\Scripts\activate  # Use source venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   ```
2. **Configure Environment**
   ```bash
   copy .env.example .env
   # Populate .env with local settings and secrets
   ```
3. **Bootstrap Database**
   ```bash
   python manage.py migrate
   python manage.py seed_plans
   ```
4. **Create an Administrator**
   ```bash
   python manage.py createsuperuser
   ```
5. **Run the Server**
   ```bash
   python manage.py runserver
   ```

Visit `http://localhost:8000` to access the dashboard. Promote additional admins using management commands or the Django Admin.

### Render Deployment

1. Provision a PostgreSQL database and capture the `DATABASE_URL`.
2. Set required environment variables (`SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, etc.) in the Render dashboard.
3. Deploy using the provided `render.yaml` or Dockerfile.
4. After the first deploy, run the setup commands via the Render shell:
   ```bash
   python manage.py migrate
   python manage.py seed_plans
   python manage.py createsuperuser
   ```

## Project Layout

```text
wolvcapital/
├── api/              # REST endpoints for users and admins
├── core/             # Public pages, dashboard views, forms, templates
├── investments/      # Investment models, services, management commands
├── transactions/     # Deposit and withdrawal workflows with notifications
├── users/            # Profiles, wallets, notification services
├── templates/        # Django template hierarchy (Tailwind-based)
├── static/           # CSS, JS, and image assets
├── wolvcapital/      # Project settings, URLs, ASGI/WSGI entry points
├── manage.py         # Django management entry point
├── Dockerfile        # Container build instructions
└── render.yaml       # Render.com blueprint
```

## Investment Plans

| Plan | Daily ROI | Duration | Minimum | Maximum |
| --- | --- | --- | --- | --- |
| Pioneer | 1.00% | 14 days | $100 | $999 |
| Vanguard | 1.25% | 21 days | $1,000 | $4,999 |
| Horizon | 1.50% | 30 days | $5,000 | $14,999 |
| Summit | 2.00% | 45 days | $15,000 | $100,000 |

Run `python manage.py seed_plans` whenever the `InvestmentPlan` table is empty to restore defaults.

## Management Commands

- `python manage.py seed_plans` — populate the default investment plans
- `python manage.py promote_admin user@example.com` — elevate an existing user
- `python manage.py payout_roi [--dry-run]` — preview or post daily ROI payouts

## API Overview

### Public
- `GET /api/plans/`

### Authenticated User
- `GET /api/investments/`
- `POST /api/investments/`
- `GET /api/transactions/`
- `POST /api/transactions/`
- `GET /api/wallet/`

### Administrator
- `GET /api/admin/transactions/`
- `POST /api/admin/transactions/{id}/approve/`
- `POST /api/admin/transactions/{id}/reject/`
- `GET /api/admin/investments/`
- `POST /api/admin/investments/{id}/approve/`
- `POST /api/admin/investments/{id}/reject/`

## Business Rules

### Approval Lifecycle
1. Users submit deposit, withdrawal, or investment requests.
2. Administrators review the request via Django Admin or the admin API.
3. Approval triggers service logic that updates balances and schedules payouts.
4. Rejections persist admin notes and maintain audit logs without altering funds.

### Transaction Flow
- **Deposits**: Approved deposits credit the user wallet atomically.
- **Withdrawals**: Services confirm the requested amount before debiting the wallet.
- **Investments**: Approval locks capital, assigns plan dates, and schedules ROI accrual.

All operations run inside `transaction.atomic()` blocks to guarantee consistency.

## Core Models

- `Profile` extends Django `User` with role metadata (`user` or `admin`).
- `UserWallet` tracks balances and enforces positive constraints.
- `InvestmentPlan` defines ROI, duration, and allowable amount ranges.
- `UserInvestment` links users to plans and stores accrual data.
- `Transaction` captures deposit and withdrawal requests with UUID primary keys.
- `AdminAuditLog` records who approved or rejected each action.

## Security Practices

- CSRF protection, secure cookies, and security middleware enabled by default.
- Templates escape output and use `select_related()` to avoid N+1 access patterns.
- Logging supports JSON format with `request_id` for traceability.

## Testing

Run the suite locally to validate models, services, and API endpoints:
```bash
python manage.py test
```

## Environment Variables

| Variable | Purpose | Required | Default |
| --- | --- | --- | --- |
| `SECRET_KEY` | Django secret key | Yes | none |
| `DEBUG` | Enable debug mode | No | `False` |
| `ALLOWED_HOSTS` | Comma-separated hostnames | No | `localhost` |
| `DATABASE_URL` | PostgreSQL connection string | No | SQLite fallback |
| `EMAIL_BACKEND` | Email backend | No | Console backend |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | SMTP configuration | No | none |
| `CSRF_TRUSTED_ORIGINS` | Trusted origins for CSRF | No | none |
| `LOG_LEVEL` | Logging verbosity | No | `INFO` |
| `LOG_FORMAT` | `json` or `plain` logging | No | `json` |

## Production Hardening

- Enforce TLS and set `SECURE_SSL_REDIRECT = True`.
- Configure HTTP Strict Transport Security (`SECURE_HSTS_SECONDS = 31536000`).
- Set `SESSION_COOKIE_SECURE` and `CSRF_COOKIE_SECURE` to `True`.
- Rotate credentials and audit admin activity regularly.
- Schedule nightly database backups and monitor ROI payouts for anomalies.

## Support

- Admin site: `/admin/`
- Health check: `/healthz/`
- Legal agreements are versioned through the `Agreement` model with SHA256 hashing.
- Contact: support@wolvcapital.com

## License and Contributions

This repository is proprietary to WolvCapital. Coordinate with the engineering team before opening pull requests or distributing copies.

## Risk Notice

Investing involves significant risk. All examples in this project are for demonstration purposes only and do not constitute financial advice.

## Structured Logging

When `DEBUG=False`, logging defaults to JSON with level, logger, message, timestamp, and `request_id`. Set `LOG_FORMAT=plain` or adjust `LOG_LEVEL` if you prefer different output.

## Agreement Acceptance Workflow

Active legal agreements are versioned through the `Agreement` model. Users review content at `/agreements/<id>/view/`, and responses are captured in `UserAgreementAcceptance`. PDF exports are available at `/agreements/<id>/pdf/`.

### Adding a New Version

Create a new `Agreement` row with the same slug, a higher version number, and `is_active=True`. The previous version is automatically deactivated.

## ROI Payout Command

Use `python manage.py payout_roi --dry-run` to preview daily ROI credits. Omit `--dry-run` in production to post wallet credits. Schedule via Render cron (`30 0 * * *`) or your preferred scheduler.

## Operational Startup Flags

Environment variables that can bootstrap new environments (all default to disabled):

| Variable | Effect |
| --- | --- |
| `RUN_SEED_PLANS=1` | Seed default investment plans on startup |
| `RUN_SEED_AGREEMENTS=1` | Seed baseline legal agreements |
| `CREATE_INITIAL_ADMIN=1` | Create an initial admin account |
| `INITIAL_ADMIN_EMAIL` | Email for the seeded admin (default `admin@wolvcapital.com`) |
| `INITIAL_ADMIN_PASSWORD` | Password used when creating the admin |

Unset these flags after provisioning so they do not run on every restart.

## Idempotent Daily ROI Payouts

`DailyRoiPayout` records enforce a single payout per investment per day. Re-running the command safely skips already processed dates.

## Agreement Acceptance Integrity

Each acceptance stores a SHA256 `agreement_hash` and the accepted `agreement_version`, ensuring auditors can verify the exact terms the user saw.

## Health Endpoint

`/healthz/` returns `{ "status": "ok" }`, suitable for uptime probes and Render health checks.

## Request Correlation

Middleware attaches a UUIDv4 (`X-Request-ID`) to every request. Structured logs include the same ID for cross-service tracing and debugging.
