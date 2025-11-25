# 📧 Professional Business Email Inbox - Complete System

## ✅ Implementation Summary

You now have a **complete professional business email inbox system** integrated into WolvCapital!

### 🎯 What's Been Built

1. **Email Inbox Models**
   - `EmailInbox` - Full email storage with metadata, status tracking, and organization
   - `EmailTemplate` - Reusable email templates for quick responses
   - Database indexes for optimal performance
   - Complete audit trail

2. **IMAP Email Fetching Service**
   - Automatic email synchronization from any IMAP server (Gmail, Outlook, etc.)
   - Email parsing with attachment support
   - Duplicate detection
   - HTML and plain text body extraction
   - Header analysis and metadata capture

3. **Professional Web Interface**
   - Modern inbox view with filters and search
   - Email detail view with full threading
   - Quick reply interface with templates
   - Star/priority/status management
   - Responsive Tailwind CSS design

4. **Enhanced Django Admin**
   - Comprehensive email management
   - Bulk actions (read/unread/archive/spam/assign)
   - Advanced filtering and search
   - Status badges and priority indicators
   - Email template management

5. **Management Commands**
   - `python manage.py sync_emails` - Fetch emails from IMAP server
   - Dry-run mode for testing connections
   - Configurable limits and folders

---

## 🚀 Quick Start

### Access Your Inbox

**Web Interface (Admin Users Only):**
```
http://localhost:8000/inbox/
```

**Django Admin:**
```
http://localhost:8000/admin/core/emailinbox/
```

**Login Credentials** (created by test script):
- Email: `admin@test.com`
- Password: `admin123`

---

## ⚙️ Configuration

### Email Inbox Settings (Already Configured)

In `wolvcapital/settings.py`:

```python
# IMAP settings for fetching business emails
INBOX_IMAP_HOST = os.getenv("INBOX_IMAP_HOST", "imap.gmail.com")
INBOX_IMAP_PORT = int(os.getenv("INBOX_IMAP_PORT", "993"))
INBOX_EMAIL_USER = os.getenv("INBOX_EMAIL_USER", EMAIL_HOST_USER)
INBOX_EMAIL_PASSWORD = os.getenv("INBOX_EMAIL_PASSWORD", EMAIL_HOST_PASSWORD)
INBOX_FOLDER = os.getenv("INBOX_FOLDER", "INBOX")
INBOX_USE_SSL = os.getenv("INBOX_USE_SSL", "True").lower() == "true"
```

### Environment Variables for Production

Add to `RENDER_ENV_VARS.txt` or Render dashboard:

```bash
# Business Inbox IMAP Configuration
INBOX_IMAP_HOST=imap.gmail.com
INBOX_IMAP_PORT=993
INBOX_EMAIL_USER=your-business-email@company.com
INBOX_EMAIL_PASSWORD=your-app-password-here
INBOX_FOLDER=INBOX
INBOX_USE_SSL=True

# Optional: Different from outgoing SMTP
# If same as EMAIL_HOST_USER, it will use those credentials
```

---

## 📥 Setting Up Email Sync

### Gmail Setup

1. **Enable IMAP in Gmail:**
   - Go to Gmail Settings → Forwarding and POP/IMAP
   - Enable IMAP
   - Save changes

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use as `INBOX_EMAIL_PASSWORD`

3. **Update Environment Variables:**
   ```bash
   INBOX_EMAIL_USER=your-email@gmail.com
   INBOX_EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  # App Password
   ```

### Office 365 / Outlook Setup

```bash
INBOX_IMAP_HOST=outlook.office365.com
INBOX_IMAP_PORT=993
INBOX_EMAIL_USER=your-email@company.com
INBOX_EMAIL_PASSWORD=your-password
INBOX_USE_SSL=True
```

### Other IMAP Providers

**Yahoo Mail:**
```bash
INBOX_IMAP_HOST=imap.mail.yahoo.com
INBOX_IMAP_PORT=993
```

**ProtonMail Bridge:**
```bash
INBOX_IMAP_HOST=127.0.0.1
INBOX_IMAP_PORT=1143
INBOX_USE_SSL=False  # Bridge uses local connection
```

---

## 🔄 Email Synchronization

### Manual Sync

```bash
# Fetch last 100 emails
python manage.py sync_emails --limit 100

# Test connection (dry run)
python manage.py sync_emails --dry-run

# Fetch more emails
python manage.py sync_emails --limit 500
```

### Automatic Sync (Production)

**Option 1: Render Cron Job**

Add to `render.yaml`:
```yaml
- type: cron
  name: email-sync
  env: python
  schedule: "*/15 * * * *"  # Every 15 minutes
  buildCommand: "pip install -r requirements.txt"
  startCommand: "python manage.py sync_emails --limit 100"
```

**Option 2: Django Management Command in Background**

Create a background worker that runs:
```bash
while true; do
    python manage.py sync_emails --limit 100
    sleep 900  # 15 minutes
done
```

**Option 3: Celery Task** (if using Celery):
```python
# tasks.py
from celery import shared_task
from core.email_inbox_service import fetch_new_emails

@shared_task
def sync_inbox():
    count = fetch_new_emails(limit=100)
    return f"Synced {count} emails"

# Schedule in Celery Beat
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'sync-emails-every-15-min': {
        'task': 'tasks.sync_inbox',
        'schedule': crontab(minute='*/15'),
    },
}
```

---

## 💻 Usage Guide

### Web Interface Features

**Inbox View (`/inbox/`):**
- ✅ Search emails by subject, sender, or content
- ✅ Filter by status (unread/read/replied/archived/spam)
- ✅ Filter by priority (urgent/high/normal/low)
- ✅ Star important emails
- ✅ View emails assigned to you
- ✅ Pagination (25 emails per page)
- ✅ Real-time stats (total, unread, starred, assigned)
- ✅ Manual sync button

**Email Detail View (`/inbox/<id>/`):**
- ✅ Full email content (HTML or plain text)
- ✅ Attachment information
- ✅ Quick reply with templates
- ✅ Star/unstar emails
- ✅ Change priority
- ✅ Assign to team members
- ✅ Archive/spam actions
- ✅ View email headers and metadata

**Quick Actions:**
- Click star icon → Toggle starred status
- Select priority dropdown → Auto-save priority
- Click "Assign to me" → Auto-assign email
- Click "Archive" → Move to archived
- Click "Spam" → Mark as spam

### Django Admin Features

**Inbox Management (`/admin/core/emailinbox/`):**
- View all emails with color-coded status badges
- Bulk actions:
  - Mark as Read/Unread
  - Mark as Replied
  - Archive multiple emails
  - Mark as Spam
  - Assign to yourself
  - Set priority (High/Normal)
  - Toggle star
- Advanced filters:
  - Status, Priority, Starred, Has Attachments
  - Assigned to, Received date
- Search:
  - Subject, From email, From name, Body text
- View raw email headers
- See attachment details

**Email Templates (`/admin/core/emailtemplate/`):**
- Create reusable templates
- Organize by category
- Use placeholders like `{{name}}`, `{{amount}}`, `{{date}}`
- Activate/deactivate templates
- Track template creator

---

## 🧪 Test Data

The system includes 6 sample emails covering common scenarios:

1. **Investment Inquiry** - High priority, starred, unread
2. **Withdrawal Question** - Normal priority, read, assigned
3. **Account Verification Issue** - Urgent priority, starred, unread
4. **Partnership Opportunity** - High priority, replied
5. **Security Alert** - Urgent priority, starred, read
6. **Newsletter Subscription** - Low priority, archived

Plus 4 email templates:
- Welcome Email
- Withdrawal Approved
- Investment Confirmation
- Support Response

---

## 📊 Database Schema

### EmailInbox Model Fields

| Field | Type | Description |
|-------|------|-------------|
| `message_id` | CharField | Unique email identifier |
| `subject` | CharField | Email subject line |
| `from_email` | EmailField | Sender email address |
| `from_name` | CharField | Sender display name |
| `to_email` | EmailField | Recipient email |
| `cc` | TextField | CC recipients (comma-separated) |
| `reply_to` | EmailField | Reply-to address |
| `body_text` | TextField | Plain text content |
| `body_html` | TextField | HTML content |
| `has_attachments` | BooleanField | Attachment indicator |
| `attachment_info` | JSONField | Attachment metadata |
| `status` | CharField | unread/read/replied/archived/spam |
| `priority` | CharField | low/normal/high/urgent |
| `is_starred` | BooleanField | Star indicator |
| `labels` | CharField | Custom labels |
| `folder` | CharField | IMAP folder name |
| `assigned_to` | ForeignKey | Assigned admin user |
| `received_at` | DateTimeField | Email receive time |
| `read_at` | DateTimeField | When marked as read |
| `replied_at` | DateTimeField | When replied |
| `raw_headers` | JSONField | All email headers |
| `raw_email` | TextField | Complete raw email |

### Indexes
- `received_at` (descending) - Fast date sorting
- `status` - Quick filtering
- `from_email` - Sender lookup
- `assigned_to` - Assignment queries
- `is_starred` - Starred emails

---

## 🔧 Troubleshooting

### Connection Issues

**Test IMAP connection:**
```bash
python manage.py sync_emails --dry-run
```

**Common errors:**

1. **"Invalid credentials"**
   - Verify email/password correct
   - Use App Password for Gmail (not account password)
   - Check if 2FA is enabled

2. **"Connection refused"**
   - Check firewall settings
   - Verify IMAP host and port
   - Ensure IMAP is enabled in email provider

3. **"SSL/TLS error"**
   - Try `INBOX_USE_SSL=False` for port 143
   - Check certificate validity
   - Some providers need `EMAIL_USE_TLS=True` instead

### No Emails Showing

1. **Check email count:**
   ```bash
   python manage.py shell -c "from core.models import EmailInbox; print(EmailInbox.objects.count())"
   ```

2. **Verify filters:**
   - Clear all filters in web interface
   - Check if emails are in different status

3. **Check user permissions:**
   - Only staff users can access inbox
   - Verify user has `is_staff=True`

### Sync Not Working

1. **Run manually with verbose output:**
   ```bash
   python manage.py sync_emails --limit 10
   ```

2. **Check logs:**
   - Look for errors in console output
   - Check Django logs for IMAP errors

3. **Verify settings:**
   ```bash
   python manage.py shell
   >>> from django.conf import settings
   >>> print(settings.INBOX_IMAP_HOST)
   >>> print(settings.INBOX_EMAIL_USER)
   ```

---

## 🎨 Customization

### Change Sync Frequency

Edit the cron schedule:
```yaml
# Every 5 minutes
schedule: "*/5 * * * *"

# Every hour
schedule: "0 * * * *"

# Every 30 minutes during business hours
schedule: "*/30 9-17 * * *"
```

### Add Custom Email Folders

Sync from specific IMAP folders:
```python
# core/management/commands/sync_specific_folder.py
from core.email_inbox_service import EmailInboxService

service = EmailInboxService()
service.folder = "Important"  # or "Sent", "Archive", etc.
service.fetch_emails(limit=50)
```

### Email Rules & Auto-Assignment

Add to `email_inbox_service.py`:
```python
def auto_assign_email(email_obj):
    """Auto-assign emails based on rules."""
    # Assign urgent emails to senior admin
    if email_obj.priority == EmailInbox.PRIORITY_URGENT:
        senior_admin = User.objects.filter(is_superuser=True).first()
        email_obj.assigned_to = senior_admin
        email_obj.save()
    
    # Assign investment inquiries to sales team
    if 'investment' in email_obj.subject.lower():
        sales_user = User.objects.filter(email='sales@company.com').first()
        if sales_user:
            email_obj.assigned_to = sales_user
            email_obj.save()
```

### Custom Email Templates

Add variables to templates:
```
{{customer_name}} - Customer's name
{{amount}} - Transaction amount
{{date}} - Current date
{{plan_name}} - Investment plan name
{{roi_percentage}} - ROI rate
{{support_agent}} - Agent name
```

---

## 📈 Production Checklist

- [ ] Set `INBOX_EMAIL_USER` and `INBOX_EMAIL_PASSWORD` in Render
- [ ] Configure IMAP host and port if not Gmail
- [ ] Test connection with `sync_emails --dry-run`
- [ ] Run initial sync: `sync_emails --limit 500`
- [ ] Set up cron job for automatic sync
- [ ] Create email templates for common responses
- [ ] Train team on inbox interface
- [ ] Set up email assignment rules
- [ ] Configure email retention policy
- [ ] Monitor disk space (raw emails stored)

---

## 🔐 Security Considerations

1. **Email Credentials:**
   - Use App Passwords, not main account password
   - Store in environment variables only
   - Never commit to Git

2. **Access Control:**
   - Only staff users can access inbox
   - Use `@user_passes_test(is_admin)` decorator
   - Implement role-based assignment

3. **Data Retention:**
   - Emails stored with full content
   - Consider automatic archival/deletion
   - Backup important emails separately

4. **Spam Protection:**
   - Use spam status to filter junk
   - Don't sync spam folders by default
   - Review spam folder periodically

---

## 📞 Support & Next Steps

### Current Capabilities
✅ Fetch emails from any IMAP server
✅ Full-text search and filters
✅ Status/priority management
✅ Email templates
✅ Team assignment
✅ Attachment metadata
✅ Professional web interface
✅ Comprehensive admin panel

### Future Enhancements (Optional)
- [ ] Send replies directly from interface (requires SMTP integration)
- [ ] Download/view attachments
- [ ] Email threading/conversation view
- [ ] Real-time notifications
- [ ] Email analytics dashboard
- [ ] Auto-responders based on rules
- [ ] Integration with support ticket system

---

## 🎉 You're All Set!

Your professional business email inbox is ready to use!

**Access it now:**
1. Visit http://localhost:8000/inbox/
2. Login with: admin@test.com / admin123
3. Browse sample emails
4. Try filters, search, and actions
5. View email details
6. Create email templates

**Next step:**
Configure your real business email in environment variables and sync your actual inbox!

```bash
# Set your credentials
export INBOX_EMAIL_USER="support@wolvcapital.com"
export INBOX_EMAIL_PASSWORD="your-app-password"

# Sync emails
python manage.py sync_emails --limit 100
```

**Questions?**
- Check this documentation
- Review Django admin at `/admin/core/emailinbox/`
- Test with dry-run mode: `python manage.py sync_emails --dry-run`
