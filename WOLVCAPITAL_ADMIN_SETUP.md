# WolvCapital Admin Command Center Setup Guide

## Overview
This guide covers the setup of the WolvCapital Django admin with modern UI, financial controls, and comprehensive monitoring capabilities.

## Features Implemented

### 1. Financial Controls (Django Constance)
- **DAILY_INTEREST_RATE**: Daily interest rate percentage (default: 0.5%)
- **WITHDRAWAL_FEE_PERCENT**: Withdrawal fee percentage (default: 2.0%)
- **MIN_INVESTMENT_AMOUNT**: Minimum investment amount in USD (default: $100.00)
- **MAINTENANCE_MODE**: Toggle to disable new investments (default: False)

### 2. Transaction Verification Actions
- Custom admin action "Verify and Release Funds" for Transaction model
- Automatically updates user wallets via existing service functions
- Creates audit logs for all financial operations
- Requires superuser permissions

### 3. User Wallet Overview
- Enhanced User admin list view showing:
  - Current wallet balance
  - Total investment amount
- Optimized queries with select_related and prefetch_related

### 4. System Health & Logs
- Custom `/admin/system-status/` view displaying:
  - Last 50 lines of django.log
  - Supabase database connection status
  - Quick stats: deposits today, active investors, pending withdrawals
- Requires superuser access

### 5. Modern Dashboard UI (Django Unfold)
- Dark theme with custom branding
- Organized sidebar navigation
- Quick stats cards on dashboard
- Permission-based menu items

## Installation Steps

### 1. Install Required Packages
```bash
pip install django-constance==2.9.1 django-unfold==0.35.0
```

### 2. Run Migrations
```bash
python manage.py migrate
```

### 3. Create Superuser (if not exists)
```bash
python manage.py createsuperuser
```

### 4. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

## Configuration

### Constance Settings
Access financial controls at: `/admin/constance/config/`
- Only superusers can modify these settings
- Changes take effect immediately
- All changes are logged

### Admin Permissions
- **Superuser Required**: Transaction verification, system status, financial settings
- **Staff Required**: All other admin operations
- All financial actions create audit logs in `AdminAuditLog`

## Usage

### Financial Operations
1. Navigate to `/admin/transactions/transaction/`
2. Select pending transactions
3. Choose "Verify and Release Funds" action
4. Confirm the action
5. System will:
   - Update user wallet balances
   - Send notifications
   - Create audit logs
   - Mark admin notifications as resolved

### System Monitoring
1. Visit `/admin/system-status/`
2. Review database connectivity
3. Check recent log entries
4. Monitor key metrics

### Financial Settings
1. Go to `/admin/constance/config/`
2. Modify rates and limits as needed
3. Changes apply immediately to new operations

## Security Features

- **Superuser Enforcement**: Critical financial actions require superuser status
- **Audit Logging**: All financial operations logged with user, action, and timestamp
- **Permission Checks**: Menu items hidden based on user permissions
- **CSRF Protection**: All forms protected against cross-site request forgery

## File Structure

```
transactions/
├── admin.py              # Enhanced admin classes with custom actions
├── services.py           # Existing financial service functions
└── models.py             # Transaction and wallet models

templates/
└── admin/
    └── system_status.html # System health template

wolvcapital/
├── settings.py           # Constance and Unfold configurations
└── urls.py              # System status URL routing

requirements.txt          # Updated with new packages
```

## Troubleshooting

### Common Issues

**"Permission Denied" on financial actions**
- Ensure user has `is_superuser=True`
- Check admin logs for permission errors

**System status shows database error**
- Verify DATABASE_URL environment variable
- Check Supabase connection credentials
- Review database server status

**Constance settings not saving**
- Ensure user is superuser
- Check database permissions
- Verify Constance migrations ran

**Unfold theme not loading**
- Run `python manage.py collectstatic`
- Clear browser cache
- Check static file serving

## Production Deployment

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Django
SECRET_KEY=your-secret-key
DEBUG=False

# Constance Defaults (optional)
CONSTANCE_DAILY_INTEREST_RATE=0.5
CONSTANCE_WITHDRAWAL_FEE_PERCENT=2.0
CONSTANCE_MIN_INVESTMENT_AMOUNT=100.00
CONSTANCE_MAINTENANCE_MODE=False
```

### Static Files
Ensure static files are served correctly in production:
```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

### Admin URL Protection
Consider additional security measures:
```python
# settings.py
ADMIN_URL = os.getenv('ADMIN_URL', 'admin/')
```

## Support

For issues with the admin system:
1. Check django.log for error messages
2. Review AdminAuditLog for failed operations
3. Verify user permissions and superuser status
4. Test database connectivity

## Future Enhancements

- Real-time dashboard updates
- Advanced reporting and analytics
- Bulk transaction processing
- Automated alerts for unusual activity
- Integration with external monitoring services</content>
<parameter name="filePath">c:\Users\Radical\repo\WOLVCAPITAL_ADMIN_SETUP.md