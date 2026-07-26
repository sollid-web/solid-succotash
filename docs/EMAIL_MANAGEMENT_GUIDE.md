# Email Management Guide

## 📧 How to Access User Emails & Send Emails Manually

### Method 1: Django Admin Panel (GUI)

#### Access User Emails
1. Go to: `https://api-wolvcapital.onrender.com/admin/` (or `http://localhost:8000/admin/` locally)
2. Login with superuser credentials
3. Click **Users** under "USERS" section
4. You'll see all user emails in the list

#### Export Email Addresses
1. In the Users list, select users (checkboxes on left)
2. Choose an action from the dropdown:
   - **"Export email addresses (CSV)"** - Just emails
   - **"Export user details (CSV)"** - Full user info
3. Click "Go"
4. A CSV file will download with the data

### Method 2: Django Management Command (CLI)

#### Send Email to Single User
```bash
python manage.py send_email \
  --to user@example.com \
  --subject "Welcome to WolvCapital" \
  --message "Thank you for joining!"
```

#### Send Email to All Active Users
```bash
python manage.py send_email \
  --to-all-users \
  --subject "Important Announcement" \
  --message "We have exciting news to share..."
```

#### Send Email to List from File
1. Create a text file `emails.txt` with one email per line:
   ```
   user1@example.com
   user2@example.com
   user3@example.com
   ```

2. Run:
   ```bash
   python manage.py send_email \
     --to-file emails.txt \
     --subject "Newsletter" \
     --message "Your monthly update..."
   ```

#### Specify Custom From Address
```bash
python manage.py send_email \
  --to user@example.com \
  --subject "Test" \
  --message "Hello" \
  --from-email "support@mail.wolvcapital.com"
```

### Method 3: Django Shell (Advanced)

#### Get All User Emails
```bash
python manage.py shell
```

Then in the Python shell:
```python
from users.models import User

# Get all emails
emails = User.objects.filter(is_active=True).values_list('email', flat=True)
for email in emails:
    print(email)

# Copy to clipboard or save to file
with open('all_emails.txt', 'w') as f:
    for email in emails:
        f.write(email + '\n')
```

#### Send Custom Email
```python
from django.core.mail import send_mail

send_mail(
    subject='Welcome!',
    message='Thank you for joining WolvCapital.',
  from_email='support@mail.wolvcapital.com',
    recipient_list=['user@example.com'],
    fail_silently=False,
)
```

#### Send HTML Email
```python
from django.core.mail import EmailMultiAlternatives

subject = 'Welcome to WolvCapital'
text_content = 'Thank you for joining!'
html_content = '<h1>Welcome!</h1><p>Thank you for joining <strong>WolvCapital</strong>.</p>'

msg = EmailMultiAlternatives(subject, text_content, 'support@mail.wolvcapital.com', ['user@example.com'])
msg.attach_alternative(html_content, "text/html")
msg.send()
```

## 🔧 Email Configuration

### Current Settings
Your email system is configured in `wolvcapital/settings.py`:

- **Development:** Emails print to console (not sent)
- **Production:** Prefers **Resend** when `RESEND_API_KEY` is set (falls back to SMTP)

### Production Email Setup (Render Environment Variables)

To actually send emails in production, set these in Render.

**Recommended (Resend):**
```
RESEND_API_KEY=your-resend-api-key
EMAIL_BACKEND=core.email_backends.resend.ResendEmailBackend
DEFAULT_FROM_EMAIL=WolvCapital <support@mail.wolvcapital.com>
```

**SMTP fallback (only if using SMTP):**
```
SMTP_HOST=smtp.privateemail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DEFAULT_FROM_EMAIL=WolvCapital <support@mail.wolvcapital.com>
```

**For Gmail (SMTP fallback):**
1. Enable 2-Factor Authentication
2. Generate an "App Password": https://myaccount.google.com/apppasswords
3. Use the app password (not your regular password) for `EMAIL_PASS`

**Alternative SMTP Providers (fallback):**
- **SendGrid:** `SMTP_HOST=smtp.sendgrid.net`, `SMTP_PORT=587`, `EMAIL_USER=apikey`
- **Mailgun:** `SMTP_HOST=smtp.mailgun.org`, `SMTP_PORT=587`
- **AWS SES:** `SMTP_HOST=email-smtp.us-east-1.amazonaws.com`, `SMTP_PORT=587`

## 📊 Quick Commands Reference

```bash
# Export all emails via admin action (use web interface)

# Send test email
python manage.py send_email --to admin@example.com --subject "Test" --message "Testing email system"

# Send announcement to all users
python manage.py send_email --to-all-users --subject "News" --message "Important update..."

# Get email count
python manage.py shell -c "from users.models import User; print(f'Total users: {User.objects.count()}')"

# List all emails
python manage.py shell -c "from users.models import User; [print(u.email) for u in User.objects.all()]"
```

## 🛡️ Best Practices

1. **Always test first:** Send to yourself before bulk emails
2. **Use BCC for bulk:** For privacy when sending to multiple recipients
3. **Track bounces:** Monitor email deliverability
4. **Comply with regulations:** Include unsubscribe links for marketing emails
5. **Rate limiting:** Some SMTP providers limit emails per hour
6. **Backup recipients:** Export email lists regularly

## 📱 Contact Email Addresses

Your platform uses:
- **Support:** support@mail.wolvcapital.com
- **System Sender:** support@mail.wolvcapital.com

These should be configured as:
- Forwarding addresses (if not actual mailboxes)
- Or actual email accounts you can access

---

**Quick Help:**
- Admin emails: Go to admin → Users → Select → Export action
- Send manual email: `python manage.py send_email --help`
- Test email config: `python manage.py shell` then try sending a test email
