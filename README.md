# WolvCapital - Professional Investment Platform

WolvCapital is a production-ready Django 5 investment platform featuring manual off-chain approvals for maximum security and transparency. Built with Python 3.12, PostgreSQL, and modern web technologies.

## Features

### 🔐 Manual Off-Chain Approvals
- All transactions (deposits, withdrawals, investments) are manually reviewed
- Human oversight for maximum security and fraud prevention
- Admin dashboard for approval workflows
- Comprehensive audit logging

### 💼 Investment Management
- Multiple investment plans with configurable ROI and durations
- User-friendly dashboard for portfolio management
- Real-time transaction tracking
- Automated return calculations

### 🛡️ Security & Compliance
- Django-allauth for robust authentication
- Email-based user accounts
- CSRF protection and security middleware
- Comprehensive risk disclosure and legal pages

### 📊 Admin Features
- Django Admin interface with custom actions
- Bulk approval/rejection capabilities
- Detailed transaction and investment management
- Audit trail for all administrative actions

## Technology Stack

- **Backend**: Django 5.0.7, Python 3.12
- **Database**: PostgreSQL (Neon compatible)
- **API**: Django REST Framework
- **Authentication**: django-allauth
- **Frontend**: Tailwind CSS, responsive design
- **Deployment**: Docker, Render.com ready
- **Static Files**: WhiteNoise

## Quick Start

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd solid-succotash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

3. **Database Setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py seed_plans
   ```

4. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

Visit `http://localhost:8000` to access the application.

### Production Deployment (Render.com)

1. **Database Setup**
   - Create a PostgreSQL database on Render
   - Note the database URL

2. **Environment Variables**
   ```bash
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-domain.onrender.com
   DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
   CSRF_TRUSTED_ORIGINS=https://your-domain.onrender.com
   ```

3. **Deploy**
   - Push to GitHub
   - Connect repository to Render
   - Use the provided `render.yaml` configuration

4. **Post-deployment**
   ```bash
   python manage.py seed_plans
   python manage.py createsuperuser
   ```

## Project Structure

```
wolvcapital/
├── api/                    # REST API endpoints
├── core/                   # Main views and templates
├── investments/            # Investment plans and user investments
├── transactions/           # Transaction management
├── users/                  # User profiles and wallets
├── templates/              # HTML templates
├── static/                 # Static files
├── wolvcapital/           # Django settings
├── requirements.txt        # Python dependencies
├── Dockerfile             # Docker configuration
├── render.yaml            # Render.com deployment config
└── manage.py              # Django management script
```

## Investment Plans

The platform includes 4 default investment plans:

| Plan     | Daily ROI | Duration | Min Amount | Max Amount |
|----------|-----------|----------|------------|------------|
| Pioneer  | 1.00%     | 14 days  | $100       | $999       |
| Vanguard | 1.25%     | 21 days  | $1,000     | $4,999     |
| Horizon  | 1.50%     | 30 days  | $5,000     | $14,999    |
| Summit   | 2.00%     | 45 days  | $15,000    | $100,000   |

## Management Commands

### Seed Investment Plans
```bash
python manage.py seed_plans
```

### Promote User to Admin
```bash
python manage.py promote_admin user@example.com
```

## API Endpoints

### Public Endpoints
- `GET /api/plans/` - List investment plans

### Authenticated User Endpoints
- `GET /api/investments/` - User's investments
- `POST /api/investments/` - Create investment request
- `GET /api/transactions/` - User's transactions  
- `POST /api/transactions/` - Create transaction
- `GET /api/wallet/` - User's wallet balance

### Admin Endpoints
- `GET/POST /api/admin/transactions/` - Manage all transactions
- `POST /api/admin/transactions/{id}/approve/` - Approve transaction
- `POST /api/admin/transactions/{id}/reject/` - Reject transaction
- `GET/POST /api/admin/investments/` - Manage all investments
- `POST /api/admin/investments/{id}/approve/` - Approve investment
- `POST /api/admin/investments/{id}/reject/` - Reject investment

## Business Logic

### Manual Approval Process

1. **User Submission**: Users submit investment/transaction requests
2. **Admin Review**: Administrators manually review each request
3. **Approval/Rejection**: Admins approve or reject with notes
4. **Execution**: Approved requests are processed automatically
5. **Audit Trail**: All actions are logged for compliance

### Transaction Flow

#### Deposits
1. User submits deposit request with proof
2. Admin verifies and approves
3. User wallet is credited automatically
4. Audit log created

#### Withdrawals  
1. User submits withdrawal request with payment details
2. Admin verifies user balance and request
3. If approved, wallet is debited
4. Payment processed manually
5. Audit log created

#### Investments
1. User selects plan and amount
2. Admin reviews investment request
3. If approved, investment period begins
4. Returns calculated based on plan parameters
5. Audit log created

## Database Models

### Core Models
- **User**: Django's built-in user model
- **Profile**: User role (user/admin) and metadata
- **UserWallet**: User's balance and transaction history
- **InvestmentPlan**: Available investment options
- **UserInvestment**: User's investment instances
- **Transaction**: Deposits and withdrawals
- **AdminAuditLog**: Administrative action history

### Key Constraints
- Investment amounts within plan limits
- Positive transaction amounts
- Daily ROI between 0-2%
- Unique investment plan names
- Foreign key relationships with cascade/protection

## Security Features

### Authentication & Authorization
- Email-based authentication via django-allauth
- Role-based access control (user/admin)
- Session management and CSRF protection
- Password validation and reset functionality

### Transaction Security
- Manual approval for all financial operations
- Admin verification and dual-approval workflows
- Comprehensive audit logging
- Balance validation for withdrawals

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection via Django templates
- Secure static file serving with WhiteNoise

## Testing

Run the test suite:
```bash
python manage.py test
```

The test suite covers:
- Model creation and validation
- Business logic (services)
- Transaction approval workflows
- Investment management
- API endpoints
- Management commands

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| SECRET_KEY | Django secret key | Yes | - |
| DEBUG | Debug mode | No | False |
| ALLOWED_HOSTS | Allowed host names | No | localhost |
| DATABASE_URL | PostgreSQL connection string | No | SQLite |
| EMAIL_BACKEND | Email backend | No | Console |
| EMAIL_HOST | SMTP host | No | - |
| EMAIL_PORT | SMTP port | No | 587 |
| EMAIL_USE_TLS | Use TLS for email | No | True |
| EMAIL_HOST_USER | SMTP username | No | - |
| EMAIL_HOST_PASSWORD | SMTP password | No | - |
| CSRF_TRUSTED_ORIGINS | Trusted origins for CSRF | No | - |

## Production Hardening

### Security Settings (when DEBUG=False)
- `SECURE_BROWSER_XSS_FILTER = True`
- `SECURE_CONTENT_TYPE_NOSNIFF = True`
- `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
- `SECURE_HSTS_SECONDS = 31536000`
- `SECURE_SSL_REDIRECT = True`
- `SESSION_COOKIE_SECURE = True`
- `CSRF_COOKIE_SECURE = True`

### Additional Recommendations
- Use strong SECRET_KEY in production
- Configure proper email backend (not console)
- Set up monitoring and logging
- Regular database backups
- SSL/TLS certificates
- Rate limiting for APIs
- Regular security updates

## Support & Documentation

- **Admin Interface**: `/admin/` - Django admin for manual approvals
- **API Documentation**: Available through Django REST Framework
- **Legal Pages**: Risk disclosure, terms of service, privacy policy
- **Contact**: support@wolvcapital.com

## License

This project is proprietary software. All rights reserved.

## Contributing

This is a production system. Please contact the development team before making any changes.

---

**⚠️ Investment Risk Warning**: All investments carry substantial risk of loss. This platform is for demonstration purposes. Always consult qualified financial advisors before making investment decisions.