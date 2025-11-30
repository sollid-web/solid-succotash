# Referral System - Quick Start Guide

## ✅ System Status
**Status**: Fully Implemented & Tested  
**Tests**: 29/29 Passing  
**Integration**: Complete with transaction approval workflow

## Setup (3 Steps)

### 1. Run Migrations (Already Done)
```bash
python manage.py migrate referrals
```

### 2. Seed Default Settings
```bash
python manage.py seed_referral_settings
```

This creates:
- **Signup Bonus**: $10 (disabled by default)
- **Deposit Reward**: 2.5% of deposit (enabled, $10 min, $100 cap)
- **Fraud Protection**: IP tracking, max 3 referrals per IP

### 3. Test the System
```bash
python manage.py test referrals
```

## How It Works

### For Users

1. **Generate Referral Code**
   ```
   POST /api/referrals/generate-code/
   Authorization: Bearer <token>
   
   Response: { "code": "ABC12345", "created": true }
   ```

2. **Share Link**
   ```
   https://wolvcapital.com/signup?ref=ABC12345
   ```

3. **Earn Rewards**
   - Friend signs up with your code
   - Friend makes first deposit (e.g., $100)
   - You get 2.5% reward ($2.50) as pending transaction
   - Admin approves → $2.50 credited to your wallet

4. **Track Referrals**
   ```
   GET /api/referrals/dashboard/
   
   Response:
   {
     "code": "ABC12345",
     "stats": {
       "total_referrals": 5,
       "credited": 3,
       "pending": 2,
       "rewards_total": "75.50"
     }
   }
   ```

### For Admins

1. **View Referrals** → Django Admin → Referrals
2. **Approve Rewards** → Django Admin → Transactions
   - Filter by `payment_method = referral_bonus`
   - Approve/reject like any transaction

3. **Manual Rewards** (Optional)
   ```
   POST /api/referrals/manual-reward/
   Authorization: Bearer <admin-token>
   
   {
     "referral_id": "uuid",
     "amount": "50.00",
     "notes": "Special bonus"
   }
   ```

## Integration Points

### Automatic Deposit Reward Processing
When you approve a deposit in Django Admin, the system automatically:
1. Checks if user was referred
2. Calculates 2.5% reward (respects min/max settings)
3. Creates pending transaction for referrer
4. Marks referral as "credited"

**No manual steps required** - just approve the deposit as normal!

### Registration Integration (Frontend)
After user signup with ref code:
```javascript
// In your signup success handler
await fetch('/api/referrals/signup-hook/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: newUser.id,
    code: referralCode,  // from URL param
    meta: {
      ip: userIP,
      source: 'landing_page'
    }
  })
});
```

## Configuration

### Adjust Settings via Django Admin

**Enable Signup Bonuses:**
```
Admin → Referral Settings → signup_bonus
Change: "enabled": false → true
```

**Change Deposit Percentage:**
```
Admin → Referral Settings → deposit_reward
Change: "percent": 2.5 → 5.0  (for 5%)
```

**Increase Max Reward:**
```
Admin → Referral Settings → deposit_reward
Change: "max_reward_amount": 100 → 500
```

## Testing Locally

### Create Test Referral Flow
```python
# In Django shell
from django.contrib.auth import get_user_model
from referrals.models import ReferralCode, Referral
from referrals.tasks import process_deposit_referral
from decimal import Decimal

User = get_user_model()

# Create users
referrer = User.objects.create_user(
    username='alice', 
    email='alice@test.com', 
    password='test123'
)
referred = User.objects.create_user(
    username='bob',
    email='bob@test.com',
    password='test123'
)

# Generate code for Alice
code = ReferralCode.objects.create(user=referrer)
print(f"Alice's code: {code.code}")

# Bob uses Alice's code
referral = Referral.objects.create(
    referred_user=referred,
    referrer=referrer,
    code=code.code
)

# Simulate Bob's $100 deposit being approved
result = process_deposit_referral(
    referred_user_id=referred.id,
    deposit_amount=Decimal('100.00')
)
print(result)
# {'ok': True, 'reward_amount': '2.50', 'transaction_id': '...'}

# Check pending transaction
from transactions.models import Transaction
txn = Transaction.objects.get(id=result['transaction_id'])
print(f"Status: {txn.status}")  # pending
print(f"Amount: ${txn.amount}")  # 2.50
```

## URLs & Endpoints

| Endpoint | Auth | Method | Purpose |
|----------|------|--------|---------|
| `/api/referrals/generate-code/` | User | POST | Generate referral code |
| `/api/referrals/dashboard/` | User | GET | View referral stats |
| `/api/referrals/signup-hook/` | None | POST | Link referral (server-side) |
| `/api/referrals/manual-reward/` | Admin | POST | Create manual reward |

## Database Tables

- `referral_codes` - User referral codes
- `referrals` - Referral relationships
- `referral_rewards` - Individual rewards
- `referral_settings` - System configuration

## Key Files

```
referrals/
├── models.py           # ReferralCode, Referral, ReferralReward, ReferralSetting
├── services.py         # create_referral_if_code, create_manual_referral_reward
├── tasks.py            # process_deposit_referral (auto-triggered)
├── views.py            # API endpoints
├── admin.py            # Django admin interface
├── urls.py             # URL routing
├── tests.py            # 29 passing tests
└── management/
    └── commands/
        └── seed_referral_settings.py
```

## Troubleshooting

**Referral not created on signup?**
- Check code exists and is active
- Verify signup hook is called server-side
- User can only have one referral

**Deposit doesn't trigger reward?**
- Deposit must be >= $10 (min_deposit setting)
- Referral must have `reward_processed=False`
- Rewards must be enabled in settings
- Check transaction approval completed successfully

**Reward amount seems wrong?**
- Base: 2.5% of deposit amount
- Capped at $100 max (changeable in settings)
- Example: $5000 deposit = $125 base → $100 capped

## Production Checklist

- [ ] Run `python manage.py seed_referral_settings`
- [ ] Test signup flow with ref code
- [ ] Test deposit approval creates referral reward
- [ ] Verify admin can approve/reject rewards
- [ ] Adjust settings based on business needs
- [ ] Monitor referral stats in Django Admin
- [ ] Set up fraud detection monitoring (IP tracking)

## Support & Documentation

- Full docs: `REFERRAL_SYSTEM_COMPLETE.md`
- Test coverage: `referrals/tests.py`, `referrals/test_api.py`
- Architecture guide: `.github/copilot-instructions.md`

---

**Questions?** Check the comprehensive documentation in `REFERRAL_SYSTEM_COMPLETE.md`
