# Referral System Implementation - Complete

## Overview
The WolvCapital referral system is now fully implemented and integrated with the existing transaction approval workflow. This document provides a comprehensive guide to the referral system architecture, features, and usage.

## System Architecture

### Models (`referrals/models.py`)

1. **ReferralCode**
   - One-to-one relationship with User
   - Auto-generates unique 8-character codes
   - Can be activated/deactivated
   - Stores metadata in JSON field

2. **Referral**
   - Links referrer to referred user
   - Tracks referral status: pending → credited/rejected/flagged
   - Records when rewards are processed
   - Prevents duplicate referrals per user

3. **ReferralReward**
   - Tracks individual reward transactions
   - Three reward types: signup_bonus, deposit_pct, manual
   - Requires admin approval (follows WolvCapital workflow)
   - Links to Transaction for wallet crediting

4. **ReferralSetting**
   - Key-value configuration store (JSON)
   - Controls reward percentages, minimums, caps
   - Enables/disables reward types
   - Fraud protection settings

### Services Layer (`referrals/services.py`)

**`create_referral_if_code(referred_user, code, meta)`**
- Server-side referral creation after user registration
- Validates code exists and is active
- Prevents self-referral
- Prevents duplicate referrals
- Returns Referral object or None

**`create_manual_referral_reward(referral, amount, currency, admin_user, reward_type, notes)`**
- Admin creates manual rewards
- Creates pending Transaction requiring approval
- Records admin action in audit trail
- Returns (reward, transaction) tuple

### Task Layer (`referrals/tasks.py`)

**`process_deposit_referral(referred_user_id, deposit_amount, currency)`**
- Triggered automatically when deposits are approved
- Checks for pending referral
- Calculates reward based on settings (% of deposit)
- Applies min_deposit threshold and max_reward_amount cap
- Creates pending Transaction for referrer
- Marks referral as credited
- Returns result dict with success/failure info

### API Endpoints (`referrals/views.py`)

**User Endpoints:**
- `POST /api/referrals/generate-code/` - Generate/retrieve referral code
- `GET /api/referrals/dashboard/` - Stats dashboard (total, pending, credited, rewards)
- `POST /api/referrals/signup-hook/` - Server-side hook for registration

**Admin Endpoints:**
- `POST /api/referrals/manual-reward/` - Create manual rewards (requires IsAdminUser)

## Integration Points

### Transaction Approval Integration
The referral system is integrated into `transactions/services.py::approve_transaction()`:

```python
# When a deposit is approved
if txn.tx_type == "deposit":
    try:
        from referrals.tasks import process_deposit_referral
        process_deposit_referral(
            referred_user_id=txn.user.id,
            deposit_amount=txn.amount,
            currency='USD'
        )
    except Exception:
        # Fails silently - doesn't break transaction approval
        pass
```

**Key Points:**
- Automatic processing on deposit approval
- Fails gracefully if referral processing has issues
- Creates pending transactions that still require admin approval
- Follows WolvCapital's manual approval philosophy

### URL Configuration
Already integrated in `wolvcapital/urls.py`:
```python
path('api/referrals/', include('referrals.urls')),
```

### Django Admin
Full admin interface registered in `referrals/admin.py`:
- ReferralCodeAdmin
- ReferralAdmin  
- ReferralRewardAdmin
- ReferralSettingAdmin

## Setup & Configuration

### 1. Run Migrations
```bash
python manage.py migrate
```

### 2. Seed Referral Settings
```bash
python manage.py seed_referral_settings
```

This creates default settings:

**signup_bonus:**
```json
{
    "amount": 10,
    "currency": "USD",
    "enabled": false,
    "require_kyc": true
}
```

**deposit_reward:**
```json
{
    "percent": 2.5,
    "enabled": true,
    "apply_once": true,
    "min_deposit": 10,
    "max_reward_amount": 100
}
```

**fraud_protection:**
```json
{
    "prevent_same_ip": true,
    "max_referrals_per_ip": 3,
    "require_deposit_verification": true
}
```

### 3. Configure Settings (Optional)
Adjust settings via Django Admin or programmatically:

```python
from referrals.models import ReferralSetting

# Enable signup bonuses
setting = ReferralSetting.objects.get(key='signup_bonus')
setting.value['enabled'] = True
setting.save()

# Increase deposit reward percentage
setting = ReferralSetting.objects.get(key='deposit_reward')
setting.value['percent'] = 5.0  # 5% instead of 2.5%
setting.save()
```

## Usage Workflows

### User Workflow

#### 1. Generate Referral Code
```bash
POST /api/referrals/generate-code/
Authorization: Bearer <token>

Response:
{
    "code": "A1B2C3D4",
    "created": true
}
```

#### 2. Share Referral Code
User shares code with friends via link:
```
https://wolvcapital.com/signup?ref=A1B2C3D4
```

#### 3. New User Registers
Frontend calls signup hook after registration:
```bash
POST /api/referrals/signup-hook/
Content-Type: application/json

{
    "user_id": "uuid-of-new-user",
    "code": "A1B2C3D4",
    "meta": {
        "ip": "127.0.0.1",
        "source": "landing_page"
    }
}

Response:
{
    "ok": true,
    "created": true,
    "referral_id": "uuid-of-referral"
}
```

#### 4. Referred User Makes Deposit
When referred user makes their first deposit:
1. User submits deposit request (creates pending Transaction)
2. Admin approves deposit
3. **Automatic:** `process_deposit_referral()` runs
4. Creates pending deposit Transaction for referrer (2.5% of deposit)
5. Admin approves referrer's reward
6. Referrer's wallet is credited

#### 5. Check Referral Dashboard
```bash
GET /api/referrals/dashboard/
Authorization: Bearer <token>

Response:
{
    "code": "A1B2C3D4",
    "stats": {
        "total_referrals": 5,
        "credited": 3,
        "pending": 2,
        "rewards_total": "75.50"
    }
}
```

### Admin Workflow

#### 1. Review Pending Referrals
Access Django Admin → Referrals → Referrals
- Filter by status: pending
- Review referrer and referred user details
- Check for suspicious patterns (same IP, etc.)

#### 2. Approve/Reject Referral Rewards
When deposit is approved, referral reward transaction is auto-created:
1. Go to Django Admin → Transactions → Transactions
2. Find transaction with meta.source = 'referral_deposit_bonus'
3. Approve or reject using normal transaction workflow

#### 3. Create Manual Rewards
```bash
POST /api/referrals/manual-reward/
Authorization: Bearer <admin-token>
Content-Type: application/json

{
    "referral_id": "uuid-of-referral",
    "amount": "50.00",
    "currency": "USD",
    "reward_type": "manual",
    "notes": "Bonus reward for high-value referral"
}

Response:
{
    "ok": true,
    "reward_id": "uuid-of-reward",
    "transaction_id": "uuid-of-transaction",
    "status": "pending_approval"
}
```

Then approve the transaction in Django Admin.

## Business Logic Details

### Reward Calculation

**Deposit Rewards:**
```python
base_amount = deposit_amount * (percent / 100)
final_amount = min(base_amount, max_reward_amount)

# Example: $100 deposit at 2.5%
# base_amount = 100 * 0.025 = $2.50
# final_amount = min(2.50, 100) = $2.50

# Example: $5000 deposit at 2.5%  
# base_amount = 5000 * 0.025 = $125
# final_amount = min(125, 100) = $100 (capped)
```

**Minimum Deposit Check:**
```python
if deposit_amount < min_deposit:
    return {'ok': False, 'reason': 'deposit_below_minimum'}
```

### Fraud Prevention

1. **Self-referral Prevention**
   - Checks if referrer.id == referred_user.id

2. **Duplicate Referral Prevention**
   - One referral record per user (enforced in DB)

3. **IP Tracking**
   - Store IP in referral.meta
   - Admin can review for suspicious patterns

4. **Apply Once Logic**
   - Referral marked as `reward_processed=True` after first deposit
   - Subsequent deposits don't trigger rewards

### Status Flow

```
Referral Creation
    ↓
STATUS_PENDING (reward_processed=False)
    ↓
First Deposit Approved
    ↓
process_deposit_referral() runs
    ↓
Creates pending Transaction for referrer
Marks referral as STATUS_CREDITED (reward_processed=True)
    ↓
Admin approves reward Transaction
    ↓
Referrer wallet credited
```

## Testing

### Run Tests
```bash
# All referral tests
python manage.py test referrals

# Specific test classes
python manage.py test referrals.tests.ReferralModelTest
python manage.py test referrals.tests.ReferralServiceTest
python manage.py test referrals.tests.ProcessDepositReferralTest
python manage.py test referrals.test_api.ReferralAPITest
```

### Test Coverage
- ✅ Model creation and validation
- ✅ Referral code generation (unique, uppercase, 8 chars)
- ✅ Self-referral prevention
- ✅ Duplicate referral prevention
- ✅ Deposit reward calculation
- ✅ Min deposit threshold enforcement
- ✅ Max reward cap enforcement
- ✅ Transaction creation
- ✅ Status transitions
- ✅ API endpoints (auth, validation, responses)

## Database Schema

### Tables Created
- `referral_codes` - User referral codes
- `referrals` - Referral relationships
- `referral_rewards` - Individual reward records
- `referral_settings` - System configuration

### Indexes
- `referrals.referred_user` (FK lookup)
- `referrals.referrer` (FK lookup)
- `referrals.code` (validation)
- `referrals.status` (filtering)

## Security Considerations

### 1. Server-Side Validation
- Never trust client-submitted referral data
- Always validate code server-side
- Check user permissions for all operations

### 2. Admin-Only Operations
- Manual rewards require IsAdminUser permission
- Reward approval through transaction workflow
- Comprehensive audit logging

### 3. Database Constraints
- Positive amounts enforced at DB level
- Foreign key relationships prevent orphaned records
- Unique constraints on referral codes

### 4. Rate Limiting
Consider adding rate limits to:
- Code generation endpoint (prevent spam)
- Signup hook endpoint (prevent abuse)

## Monitoring & Analytics

### Key Metrics to Track

1. **Referral Conversion Rate**
   ```python
   total_referrals = Referral.objects.count()
   credited_referrals = Referral.objects.filter(
       status=Referral.STATUS_CREDITED
   ).count()
   conversion_rate = (credited_referrals / total_referrals) * 100
   ```

2. **Average Reward Amount**
   ```python
   avg_reward = ReferralReward.objects.filter(
       approved=True
   ).aggregate(avg=Avg('amount'))['avg']
   ```

3. **Top Referrers**
   ```python
   top_referrers = User.objects.annotate(
       referral_count=Count('referrals_made')
   ).order_by('-referral_count')[:10]
   ```

4. **Pending Rewards**
   ```python
   pending_value = ReferralReward.objects.filter(
       approved=False
   ).aggregate(total=Sum('amount'))['total']
   ```

### Admin Dashboard Queries
Add these to a custom admin dashboard:

```python
# Django Admin customization
from django.db.models import Count, Sum
from django.contrib import admin

class ReferralAdminDashboard(admin.AdminSite):
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        
        # Referral stats
        extra_context['total_referrals'] = Referral.objects.count()
        extra_context['pending_referrals'] = Referral.objects.filter(
            status=Referral.STATUS_PENDING
        ).count()
        
        # Reward stats
        extra_context['pending_rewards_count'] = ReferralReward.objects.filter(
            approved=False
        ).count()
        extra_context['pending_rewards_value'] = (
            ReferralReward.objects.filter(approved=False)
            .aggregate(total=Sum('amount'))['total'] or 0
        )
        
        return super().index(request, extra_context)
```

## Troubleshooting

### Issue: Referral not created on signup
**Check:**
1. Code exists in database and is active
2. Signup hook is being called server-side
3. User doesn't already have a referral
4. Code isn't the user's own code

### Issue: Deposit doesn't trigger referral reward
**Check:**
1. Referral exists and has `reward_processed=False`
2. Deposit amount >= `min_deposit` setting
3. `deposit_reward.enabled` is `true` in settings
4. Transaction is being approved (not just created)
5. Check transaction approval logs for exceptions

### Issue: Reward amount is capped
**Expected behavior** - check `deposit_reward.max_reward_amount` setting:
```python
setting = ReferralSetting.get('deposit_reward')
print(setting['max_reward_amount'])  # Default: 100
```

### Issue: Multiple rewards for same referral
**Should not happen** - check:
1. `apply_once` is `true` in settings
2. Referral `reward_processed` flag is being set
3. Database query uses `select_for_update()` for locking

## Future Enhancements

### Potential Features
1. **Tiered Rewards** - Higher % for more referrals
2. **Lifetime Commission** - Ongoing rewards on referred user activity
3. **Referral Contests** - Time-limited bonus campaigns
4. **Referral Analytics Dashboard** - User-facing stats page
5. **Social Sharing** - Built-in share buttons for email/social
6. **Referral Leaderboard** - Gamification element
7. **Multi-Currency Support** - Extend beyond USD
8. **Referral Expiration** - Time limits on code validity

### Implementation Notes
- All enhancements should maintain manual approval workflow
- Add comprehensive tests for new features
- Update settings model for new configuration options
- Create migrations for schema changes

## API Documentation Summary

### Generate Referral Code
```
POST /api/referrals/generate-code/
Auth: Required
Returns: { code: string, created: boolean }
```

### Get Dashboard Stats
```
GET /api/referrals/dashboard/
Auth: Required
Returns: { code: string, stats: {...} }
```

### Signup Hook (Server-Side)
```
POST /api/referrals/signup-hook/
Auth: Not required (internal)
Body: { user_id, code, meta? }
Returns: { ok: boolean, created: boolean, referral_id?: string }
```

### Manual Reward (Admin Only)
```
POST /api/referrals/manual-reward/
Auth: Admin required
Body: { referral_id, amount, currency?, reward_type?, notes? }
Returns: { ok: boolean, reward_id, transaction_id, status }
```

## Conclusion

The WolvCapital referral system is production-ready with:
- ✅ Complete database models and migrations
- ✅ Service layer with business logic
- ✅ Integration with transaction approval workflow
- ✅ REST API endpoints for user and admin operations
- ✅ Comprehensive test coverage
- ✅ Django admin interface
- ✅ Configurable settings system
- ✅ Fraud prevention mechanisms
- ✅ Audit trail integration

The system follows WolvCapital's core philosophy of manual approval for all financial operations while automating the reward calculation and tracking processes.
