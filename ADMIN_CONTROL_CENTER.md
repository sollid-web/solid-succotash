# Django Control Center

The admin dashboard now includes a **Django Control Center** section at `/admin`. It is separate from the original workflow pages and exposes backend resources through the existing JWT-authenticated staff session.

## Control domains

| Domain | Route | Capabilities |
|---|---|---|
| User accounts | `/api/admin/users/` | List, search, create, edit, activate/deactivate, staff/superuser flags, set password |
| Profiles | `/api/admin/profiles/` | Roles, full name, email preferences, verification, Telegram and card flags |
| Wallets | `/api/admin/wallets/` | Review and update user wallet balances |
| User notifications | `/api/admin/notifications/` | Create, edit, filter, mark read |
| Legal agreements | `/api/admin/agreements/` | Create, version, publish, edit, retire |
| Support | `/api/admin/support/` | Search, annotate, assign, resolve |
| Email inbox | `/api/admin/inbox/` | Search, filter, status, priority, assignment, star, mark replied |
| Email templates | `/api/admin/email-templates/` | Create and maintain reusable templates |
| Certificates | `/api/admin/certificates/` | Manage public certificate metadata and verification links |
| Drip campaigns | `/api/admin/drip-campaigns/` | Review and control enrollment progress |
| Crypto wallets | `/api/admin/crypto-wallets/` | Manage deposit addresses, networks, and active state |
| Virtual cards | `/api/admin/cards/` | Review, generate details, activate, freeze, and update controlled fields |
| Operations alerts | `/api/admin/ops-notifications/` | Review, filter, and resolve internal alerts |
| Audit log | `/api/admin/audit-logs/` | Read-only staff action history |
| Agreement acceptances | `/api/admin/agreement-acceptances/` | Read-only compliance evidence |
| Chat sessions/messages | `/api/admin/chat-sessions/`, `/api/admin/chat-messages/` | Manage handoff state and inspect transcripts |

The existing dashboard pages continue to provide specialized approval workflows for transactions, investments, KYC applications, and KYC documents. The People & Presence page provides authenticated last-seen and page-history reporting.

## Backend dependency

The frontend routes require the matching Django control-center viewsets and router registrations from `api/admin_control.py` and `api/urls.py`. Deploy those backend files before using the new section in production. All routes use the existing `IsPlatformAdmin` rule: the account must be authenticated and either `is_staff` or `is_superuser`.

The Control Center deliberately does not expose raw card number, CVV, or PIN fields. The card API returns a masked card number and uses explicit backend actions for generation, activation, and freezing. Destructive frontend actions require browser confirmation.

## Verification

The frontend passes TypeScript validation, lint, and production build. The only lint output is a pre-existing warning in `src/components/SupportChat.tsx` about a missing `isAdmin` hook dependency.
