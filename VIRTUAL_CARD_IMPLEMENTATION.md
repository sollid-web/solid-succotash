# Virtual Card Feature - Implementation Guide

## Overview

A fully functional Virtual Card feature has been added to WolvCapital using Stripe Issuing. This feature allows users to issue virtual cards, view card details, manage card status (freeze/unfreeze), and track transactions.

---

## Files Created/Modified

### PHASE 1: Settings & Configuration

**File:** `wolvcapital/settings.py`
- Added `STRIPE_ISSUING_ENABLED = True`
- Added `STRIPE_CARDHOLDER_TYPE = 'individual'`

### PHASE 2: Stripe Integration

**File:** `cards/stripe_issuing.py` (NEW)
- `create_cardholder(user)` - Create Stripe cardholder
- `create_virtual_card(user)` - Issue virtual card
- `get_card_details(user)` - Retrieve card number, CVC, expiry
- `toggle_card_freeze(user)` - Freeze/unfreeze card
- `get_card_transactions(user, limit=20)` - Fetch transactions

### PHASE 3: Database Models

**File:** `users/models.py`
Added to `Profile` model:
```python
stripe_cardholder_id = models.CharField(max_length=100, blank=True, null=True)
stripe_card_id = models.CharField(max_length=100, blank=True, null=True)
card_last4 = models.CharField(max_length=4, blank=True, null=True)
card_exp_month = models.CharField(max_length=2, blank=True, null=True)
card_exp_year = models.CharField(max_length=4, blank=True, null=True)
is_card_frozen = models.BooleanField(default=False)
```

**File:** `users/migrations/0003_profile_stripe_card_fields.py` (NEW)
- Migration to add Stripe card fields to Profile

**Apply migration:**
```bash
python manage.py migrate users
```

### PHASE 4: Views & URLs

**File:** `cards/views.py`
- `card_dashboard(request)` - Display card dashboard with auto-creation
- `toggle_card_status(request)` - Freeze/unfreeze endpoint
- `get_transactions(request)` - Fetch transactions as JSON

**File:** `cards/urls.py` (NEW)
```
GET  /dashboard/card/              → card_dashboard (display)
POST /dashboard/card/freeze/       → toggle_card_status (freeze/unfreeze)
GET  /dashboard/card/transactions/ → get_transactions (JSON)
```

**File:** `wolvcapital/urls.py`
- Added: `path("dashboard/card/", include("cards.urls"))`

### PHASE 5: Templates

**File:** `templates/cards/card_dashboard.html` (NEW)
- 3D flippable card UI (CSS 3D transforms)
- Card details display (number, CVC, expiry)
- Copy-to-clipboard buttons for each detail
- Card status indicator with freeze/unfreeze button
- Spending limits display
- Recent transactions list
- Error handling template

**File:** `templates/cards/card_error.html` (NEW)
- Error display template for card-related failures

### PHASE 6: Static Files

**File:** `static/cards/card.css` (NEW)
- All selectors prefixed with `.wc-card` to avoid conflicts
- 3D flip animation (perspective, transform-style)
- Responsive design for mobile/tablet/desktop
- Card gradient background
- Freeze overlay styles
- Transaction list styling
- Copy toast notification
- Media queries for responsive layout

**File:** `static/cards/card.js` (NEW)
- `wcFlipCard()` - Flip card to show CVC
- `wcCopyToClipboard(value, label)` - Copy with fallback support
- `wcToggleFreezeCard()` - POST to freeze endpoint
- `wcShowToast(message, type)` - Show success/error notification
- CSRF token handling

---

## Key Features

### 1. Automatic Cardholder & Card Creation
When user visits `/dashboard/card/`, the system automatically:
- Creates a Stripe Cardholder if one doesn't exist
- Issues a virtual card if one doesn't exist
- Stores IDs in user profile for future reference

### 2. Card Details Display
- Full card number (fetched live from Stripe, never stored)
- CVC (fetched live, shown on card flip)
- Expiry month/year
- Last 4 digits (stored in DB for quick display)
- Status (active/inactive)

### 3. Card Management
- **Flip Card**: 3D CSS animation to show/hide CVC
- **Freeze Button**: Toggle between active/inactive status
- **Copy Buttons**: One-click copy for number, CVC, expiry
- **Status Indicator**: Visual indicator showing card status

### 4. Transaction History
- Lists last 20 transactions from Stripe Issuing
- Shows merchant name, amount, date, type (purchase/refund)
- Styled as transaction list with icons
- Responsive layout

### 5. Security
- Full card number and CVC **never stored in database**
- Always fetched live from Stripe API
- CSRF protection on freeze endpoint
- Login required (`@login_required`)
- Server-side validation

---

## API Endpoints

### GET /dashboard/card/
Display card dashboard page. Auto-creates cardholder and card if needed.
```
Response: Renders card_dashboard.html with context:
{
    'card': {
        'number': '4242...',
        'cvc': '123',
        'exp_month': 12,
        'exp_year': 2026,
        'last4': '4242',
        'status': 'active'
    },
    'transactions': [
        {
            'merchant': 'Amazon',
            'amount': 2999,
            'currency': 'usd',
            'date': datetime,
            'type': 'purchase'
        },
        ...
    ],
    'is_frozen': False,
    'csrf_token': '...'
}
```

### POST /dashboard/card/freeze/
Toggle card freeze status.
```
Response: JSON
{
    'frozen': true/false,
    'status': 'active' or 'inactive',
    'message': 'Card active' or 'Card frozen'
}
```

### GET /dashboard/card/transactions/
Get transactions as JSON (with pagination support).
```
Query params: ?limit=20 (default: 20, max: 100)

Response: JSON
{
    'transactions': [
        {
            'merchant': 'Store',
            'amount': 5000,
            'currency': 'usd',
            'date': datetime,
            'type': 'purchase'
        },
        ...
    ],
    'count': 10
}
```

---

## Frontend Integration

### Update Dashboard Overview
In your existing dashboard overview template, find the Virtual Card promo block and update the button:
```html
<!-- OLD -->
<a href="#" class="btn">View Card</a>

<!-- NEW -->
<a href="/dashboard/card/" class="btn">View Card</a>
```

### Include in Navigation (Optional)
```html
<a href="/dashboard/card/">Virtual Card</a>
```

---

## Error Handling

The system handles these scenarios gracefully:

1. **No Profile**: Returns error page with message
2. **Stripe API Errors**: Logs and returns error to user
3. **Missing Card**: Shows appropriate message
4. **Network Issues**: Toast notification with error message
5. **CSRF Failures**: Django's built-in CSRF protection

---

## Testing Checklist

```
[ ] Migrate database: python manage.py migrate users
[ ] Visit /dashboard/card/ - card auto-creation
[ ] Check DB: Profile.stripe_cardholder_id is set
[ ] Check DB: Profile.stripe_card_id is set
[ ] Flip card to see CVC
[ ] Copy card number
[ ] Copy CVC
[ ] Copy expiry
[ ] Freeze card - button changes to "Unfreeze"
[ ] Unfreeze card - button changes to "Freeze"
[ ] Check transactions display
[ ] Test on mobile viewport (responsive)
[ ] Verify CSRF token in POST requests
[ ] Check admin dashboard for card data
```

---

## Stripe Test Cards

Use these in test mode:
- **Visa**: 4242 4242 4242 4242
- **Visa (Debit)**: 4000 0025 0000 3155
- **Mastercard**: 5555 5555 5555 4444

---

## Security Notes

1. **Card Number/CVC**: Never stored, always fetched live
2. **CSRF Protection**: All POST requests use Django CSRF token
3. **Login Required**: All endpoints require authentication
4. **Rate Limiting**: Consider adding rate limiting to transaction endpoint
5. **Logging**: All Stripe errors are logged for audit

---

## Customization

### Change Spending Limits
Edit `templates/cards/card_dashboard.html`:
```html
<span class="wc-limit-value">$5,000</span> <!-- Daily limit -->
<span class="wc-limit-value">$50,000</span> <!-- Monthly limit -->
```

### Change Transaction Limit
In `cards/views.py`:
```python
transactions = get_card_transactions(user, limit=50)  # Change from 20
```

### Change Card Colors
In `static/cards/card.css`:
```css
.wc-card-front {
    background: linear-gradient(135deg, #2a52be 0%, #1e3a8a 100%);
}
```

### Add Custom Cardholder Fields
In `cards/stripe_issuing.py` `create_cardholder()`:
```python
cardholder = stripe.issuing.Cardholder.create(
    # ... existing fields ...
    individual={
        "first_name": user.first_name,
        "last_name": user.last_name,
        "dob": {...},  # Add DOB if available
        # ... more fields ...
    },
)
```

---

## Production Checklist

Before deploying to production:

```
[ ] Use live Stripe keys (not test keys)
[ ] Set up Stripe Issuing in production account
[ ] Enable HTTPS (required for cards)
[ ] Set SECRET_KEY in environment
[ ] Set DEBUG = False
[ ] Configure ALLOWED_HOSTS
[ ] Run collectstatic: python manage.py collectstatic
[ ] Run migrations: python manage.py migrate
[ ] Set up error logging (e.g., Sentry)
[ ] Test card creation with real Stripe account
[ ] Set up webhook handlers for card events (optional)
[ ] Monitor Stripe API logs for errors
[ ] Test freeze/unfreeze functionality
[ ] Verify CSRF tokens work in production
```

---

## Support & Maintenance

### Common Issues

**Issue**: Card not created after visiting /dashboard/card/
- Check: User has valid profile
- Check: Stripe API keys are correct
- Check: STRIPE_ISSUING_ENABLED = True in settings
- Check: Stripe Issuing is enabled in account

**Issue**: Freeze button not working
- Check: CSRF token is passed correctly
- Check: Network tab shows 200 response
- Check: Browser console for JS errors

**Issue**: Transactions not showing
- Check: Card has transactions in Stripe dashboard
- Check: API limit not exceeded (20 by default)

### Monitoring

Monitor these in production:
1. Stripe API errors - check logs for `stripe.error.*`
2. Card creation failures - check `AdminAuditLog` if integrated
3. Freeze toggle failures - check browser network tab
4. Database migrations - ensure all migrations applied

---

## Next Steps

### Optional Enhancements

1. **Add Card Funding**: Allow deposit/withdrawal via card
2. **Spending Analytics**: Track card spending over time
3. **Alerts**: Notify user of large purchases
4. **Multiple Cards**: Support multiple virtual cards per user
5. **Card Limits API**: Allow users to customize spending limits
6. **Webhooks**: Listen to Stripe card events for real-time updates
7. **Admin Interface**: Manage cards from Django admin

### Integration Points

- **ROI Payouts**: Could fund card with ROI payments
- **Investment Returns**: Display card balance alongside wallet
- **Dashboard Analytics**: Card spending in user dashboard
- **Email Notifications**: Send card activation/freeze emails

---

## Support

For issues with this implementation:
1. Check Stripe API documentation: https://stripe.com/docs/issuing
2. Review Django error logs
3. Check Stripe test dashboard for card status
4. Contact Stripe support for card-specific issues

---

Generated: 2026-04-20
Version: 1.0
