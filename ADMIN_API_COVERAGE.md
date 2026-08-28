# WolvCapital Admin API Coverage

The admin console now includes an **API Center** at `/admin` → **API Center**. It maps the routed Django API surface discovered in the backend and lets an authenticated platform administrator inspect an endpoint, edit path parameters or JSON payloads, execute the request, and inspect or copy the response.

## Covered endpoint groups

| Group | Coverage |
| --- | --- |
| Authentication | Simple JWT aliases, current user, logout, legacy token generation/refresh/verification, email verification, signup completion, password reset request/confirmation |
| Platform data | Agreements and acceptance, public campaigns, public plans, cryptocurrency wallets, public certificate |
| User resources | Investments, transactions, wallet, analytics, virtual cards, KYC applications/documents, notifications, email preferences, language, Telegram linking, referrals, checkout completion |
| Cards | Card details/request, freeze, transactions, password verification, set PIN, check PIN |
| Support and operations | Health check, support requests, chat reply/handoff/agent reply, sessions, messages, visitor heartbeat, widget script |
| Admin resources | Campaigns, plans, transactions, investments, KYC applications/documents, status transitions, manual referral reward |
| Scheduled operations | ROI and drip triggers, with explicit warnings because these routes require backend secrets and should not be run casually |

## Resource screens

The existing resource workspace remains the preferred interface for staff workflows. It provides searchable tables, DRF pagination support, show pages, create/edit flows where serializers permit mutation, delete controls where the endpoint supports deletion, and backend-specific approve/reject actions for transactions, investments, KYC applications, and KYC documents.

The API Center is intentionally more general: it covers endpoints that are read-only, user-scoped, custom actions, aliases, file/card operations, chat operations, and non-CRUD workflows that do not have a conventional model table.

## Security behavior

Every request made from the API Center uses the existing admin API client. The client sends the stored `Authorization: Bearer <access-token>` header and retries once after refreshing the Simple JWT when Django returns `401`. No credentials or token values are hard-coded in the frontend source. Cron-secret fields are shown only as blank request-body placeholders and must be supplied through an authorized operational process.

## Production configuration

The deployed frontend uses:

```env
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
```

The API Center is available at:

```text
https://www.wolvcapital.com/admin
```

A platform administrator must sign in before requests are enabled. User-scoped endpoints will return the data belonging to the signed-in account; staff-only endpoints will use the backend `IsPlatformAdmin` permission.
