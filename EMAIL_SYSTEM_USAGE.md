# Private Email System Usage Guide

This guide explains how to configure, run, and operate the private IMAP-based email ingestion system in WolvCapital.

## Overview
- Purpose: Fetch emails from a business mailbox via IMAP and store them for admin triage.
- Primary storage: `core.models.EmailInbox` (structured, with status and metadata).
- Legacy storage: `core.models.IncomingEmail` + `core.models.EmailAttachment` (raw ingestion including files).

## Environment Variables
Set these in your environment (Render, local `.env`, etc.):

- `INBOX_IMAP_HOST`: IMAP server host (e.g., `imap.gmail.com`)
- `INBOX_IMAP_PORT`: IMAP port (default `993`)
- `INBOX_EMAIL_USER`: Mailbox username/login
- `INBOX_EMAIL_PASSWORD`: Mailbox password (prefer app-specific passwords)
- `INBOX_FOLDER`: Mail folder to read (default `INBOX`)
- `INBOX_USE_SSL`: `True` or `False` (default `True`)

Legacy fallbacks (for the raw command) may include `IMAP_HOST`, `IMAP_USER`, `IMAP_PASS`.

## Fetching Emails (Preferred Service)

Use the structured service to ingest into `EmailInbox`:

```pwsh
python manage.py sync_emails --dry-run --limit 10   # connection test (no writes)
python manage.py sync_emails --limit 50             # fetch and save structured emails
```

Alternatively, from Python shell:

```python
from core.email_inbox_service import fetch_new_emails
fetch_new_emails(limit=25)
```

## Admin Triage
- Open Django admin → Inbox → `EmailInbox` entries.
- Mark as read/replied, assign `assigned_to`, set `priority`, and add comma-separated `labels`.
- `mark_email_read(email, user=None)` also marks the message as read on the IMAP server.

## Raw Ingestion (Optional)
Stores records in `IncomingEmail` and attachments in `EmailAttachment`.

```pwsh
python manage.py fetch_mail --limit 20
```

## Scheduling

- Windows (development): use Task Scheduler to run a script periodically.

```pwsh
Set-Location "e:\solid-web\solid-succotash"
python manage.py sync_emails --limit 100
```

- Production (Render): run as a cron/worker every 5–15 minutes.

## Security & Hardening
- Sanitize HTML content before rendering; never execute email content.
- Enforce attachment size/type policies; consider AV scanning via a background task (e.g., ClamAV).
- Rotate mailbox credentials regularly; use app-specific passwords; restrict mailbox scope.

## Troubleshooting
- No emails fetched: confirm `INBOX_FOLDER` matches provider naming.
- Authentication errors: verify SSL and port (`993`); try `INBOX_USE_SSL=False` for diagnostics.
- Duplicates: `EmailInbox` enforces unique `message_id` to avoid duplicates.

## References
- Service: `core/email_inbox_service.py`
- Models: `core/models.py` → `EmailInbox`, `IncomingEmail`, `EmailAttachment`
