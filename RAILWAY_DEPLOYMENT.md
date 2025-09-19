# WolvCapital Railway Deployment Guide

## 🚀 Automated Deployment Options

### Option 1: One-Click Windows Deployment
```cmd
deploy-railway.bat
```

### Option 2: Cross-Platform Bash Script
```bash
bash deploy-railway.sh
```

### Option 3: Manual Railway CLI Steps
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy WolvCapital
railway up

# Add PostgreSQL
railway add postgresql

# Set environment variables
railway variables set DEBUG=False
railway variables set SECRET_KEY="your-secret-key-here"

# Deploy
railway deploy
```

## 🔧 Pre-Deployment Checklist

- ✅ Python 3.8+ installed
- ✅ Railway CLI installed (`npm install -g @railway/cli`)
- ✅ Git repository committed and pushed
- ✅ All WolvCapital features tested locally
- ✅ Admin credentials ready (admin@wolvcapital.com)

## 🎯 What Gets Deployed

### Core Platform Features
- **Investment Plans**: 4 predefined plans with ROI calculations
- **User Management**: Profile system with admin/user roles
- **Transaction System**: Manual approval workflows
- **Wallet Management**: Balance tracking and crediting

### Enhanced Features
- **Cryptocurrency Support**: BTC, USDT, USDC, ETH deposits
- **Virtual Cards**: Visa virtual card system ($1000)
- **Admin Notifications**: Priority-based notification system
- **Customer Support**: Embedded chat widget
- **Audit Logging**: Comprehensive financial audit trails

### Security Features
- **HTTPS Enforcement**: SSL/TLS encryption
- **CSRF Protection**: Cross-site request forgery prevention
- **Session Security**: Secure admin session management
- **Database Security**: PostgreSQL with connection pooling

## 📊 Post-Deployment Configuration

### 1. Admin Setup
```
URL: https://your-app.up.railway.app/admin/
Login: admin@wolvcapital.com
Password: admin123 (change immediately)
```

### 2. Cryptocurrency Wallets
Navigate to Admin Panel → Transactions → Cryptocurrency Wallets:
- **BTC**: Update with your Bitcoin wallet address
- **USDT**: Update with your USDT (ERC-20) address
- **USDC**: Update with your USDC (ERC-20) address
- **ETH**: Update with your Ethereum address

### 3. Investment Plans Verification
Admin Panel → Investments → Investment Plans:
- Pioneer: 1.00% daily, 14 days, $100-$999
- Vanguard: 1.25% daily, 21 days, $1,000-$4,999
- Horizon: 1.50% daily, 30 days, $5,000-$14,999
- Summit: 2.00% daily, 45 days, $15,000-$100,000

### 4. Testing Checklist
- [ ] User registration and login
- [ ] Investment plan selection
- [ ] Cryptocurrency deposit workflow
- [ ] Admin approval process
- [ ] Wallet crediting functionality
- [ ] Virtual card purchase flow
- [ ] Customer support chat
- [ ] Admin notification system

## 🔍 Monitoring and Maintenance

### Railway Dashboard
- **Deployments**: Monitor deployment status
- **Metrics**: Track resource usage
- **Logs**: View application logs
- **Database**: Monitor PostgreSQL performance

### WolvCapital Specific Monitoring
- **Pending Approvals**: Check admin notification queue
- **Transaction Processing**: Monitor approval workflows
- **User Activity**: Track registrations and investments
- **Wallet Balances**: Verify crediting accuracy

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
railway logs
# Check DATABASE_URL environment variable
```

**Static Files Not Loading**
```bash
railway run python manage.py collectstatic --noinput
```

**Admin Login Issues**
```bash
railway run python manage.py shell
# Reset admin password if needed
```

**Service Layer Errors**
```bash
railway logs --filter="transactions.services"
# Check approval workflow logs
```

### Environment Variables Check
```bash
railway variables
# Verify DEBUG=False, SECRET_KEY set, DATABASE_URL exists
```

## 🔒 Security Best Practices

### Immediate Actions
1. **Change Default Admin Password**
2. **Update Cryptocurrency Addresses**
3. **Review User Permissions**
4. **Test Approval Workflows**

### Ongoing Security
- Monitor admin audit logs daily
- Review pending transactions regularly
- Update dependencies monthly
- Backup database weekly

## 💡 Production Optimization

### Performance
- Database connection pooling enabled
- Static file compression via WhiteNoise
- Gunicorn with 2 workers
- 120-second timeout for financial operations

### Scalability
- Railway auto-scaling available
- PostgreSQL can handle 100+ concurrent connections
- Manual approval workflow prevents automated attacks
- Audit logging for compliance requirements

## 📞 Support

### Railway Support
- Documentation: https://docs.railway.app
- Discord: https://discord.gg/railway
- GitHub: https://github.com/railwayapp

### WolvCapital Issues
- Check admin notification system
- Review service layer error logs
- Verify transaction approval workflows
- Test wallet crediting functionality

---

**🎉 Your WolvCapital investment platform is now live on Railway!**

The platform follows all financial security best practices with manual approval workflows, comprehensive audit logging, and secure cryptocurrency handling.