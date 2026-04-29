# Card Request → Approval → Issuer Workflow - Testing Guide

## Overview

This document provides a comprehensive guide to testing the **Virtual Card Workflow** in WolvCapital, which covers the entire lifecycle from user card request through admin approval to issuer activation.

## Workflow Stages

### 1. **Card Request** (User Action)
- **Status**: `pending`
- **User Action**: User requests a virtual card via the frontend
- **API Endpoint**: `POST /api/cards/`
- **Database State**: 
  - VirtualCard created with `status="pending"`
  - `is_active=False`
  - No card details generated yet

### 2. **Admin Approval** (Admin Action)
- **Status**: `pending` → `approved`
- **Admin Action**: Admin reviews and approves the card request
- **Location**: Django Admin (`/admin/transactions/virtualcard/`)
- **Database State**:
  - Status changed to `approved`
  - Card details generated (card_number, cvv, expiry_month, expiry_year)
  - `approved_by` set to admin user
  - `is_active=True`

### 3. **Issuer Activation** (System Action)
- **Status**: `approved` → `active`
- **Integration**: Stripe Issuing API
- **Card Ready**: Card can now be used for transactions

### 4. **Card States**
```
pending ──(admin approve)──> approved ──(time/system)──> active
   │                             │
   │                             └─> suspended (when frozen)
   │                                    └─> active (when unfrozen)
   │
   └─(admin reject)─> rejected
```

## Test Files

### 1. **test_card_core_workflow.py** (Primary Test)
Comprehensive test of the complete card workflow without HTTP layer.

**Run the test:**
```bash
python manage.py shell < test_card_core_workflow.py
```

**What it tests:**
1. ✓ Card request creation
2. ✓ Card attributes (pending state)
3. ✓ Admin approval
4. ✓ Card details generation
5. ✓ Approved card attributes
6. ✓ Card freeze/suspend
7. ✓ Card unfreeze/reactivate
8. ✓ Card number masking
9. ✓ Card rejection
10. ✓ Duplicate prevention
11. ✓ Database queries

**Test Output:**
All tests pass with detailed output showing state transitions.

### 2. **test_card_workflow.py** (Unit Tests)
Full Django test suite with individual test cases.

**Run specific test:**
```bash
python manage.py test test_card_workflow.CardRequestWorkflowTests.test_01_user_can_request_card
```

**Test Cases:**
- test_01_user_can_request_card
- test_02_duplicate_card_request_rejected
- test_03_card_cannot_be_approved_without_pending_status
- test_04_admin_approves_card
- test_05_approved_card_is_ready_for_use
- test_06_card_rejection_workflow
- test_07_user_can_freeze_active_card
- test_08_user_can_unfreeze_card
- test_09_card_details_properly_masked
- test_10_full_workflow_end_to_end

## Key Components

### Models
**File:** `transactions/models.py`
```python
class VirtualCard(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("expired", "Expired"),
    ]
```

### Views
**File:** `cards/views.py`
- `CardDetailView` - Request card (POST), Get card (GET)
- `CardFreezeView` - Freeze/unfreeze card
- `CardTransactionsView` - Get card transactions
- `SetPinView` - Set card PIN
- `VerifyPasswordView` - Verify card PIN

### Admin Actions
**File:** `transactions/admin.py`
- `approve_cards` - Approve pending cards and generate details
- `reject_cards` - Reject pending cards
- `card_number_masked` - Display masked card number

### API Endpoints
```
POST   /api/cards/                  - Request new card
GET    /api/cards/                  - Get user's card
POST   /api/cards/freeze/           - Freeze/unfreeze card
GET    /api/cards/transactions/     - Get card transactions
POST   /api/cards/verify-password/  - Verify card PIN
POST   /api/cards/set-pin/          - Set card PIN
POST   /api/cards/check-pin/        - Check if PIN is set
```

## Workflow Example

### Step 1: User Requests Card
```python
# Frontend calls POST /api/cards/
card = VirtualCard.objects.create(
    user=request.user,
    status="pending",
    purchase_amount=1000,
    cardholder_name="John Doe"
)
```

### Step 2: Admin Approves Card
```python
# In Django Admin:
from django.db import transaction

with transaction.atomic():
    card.status = "approved"
    card.approved_by = admin_user
    card.is_active = True
    card.save()
    card.generate_card_details()  # Generates: card_number, cvv, expiry
```

### Step 3: Card Ready for Use
```python
card.refresh_from_db()
# card.status == "approved"
# card.is_active == True
# card.card_number == "4111111111111111"
# card.cvv == "123"
# card.expiry_month == "12"
# card.expiry_year == "25"
```

### Step 4: User Can Freeze/Unfreeze
```python
# Freeze card
card.status = "suspended"
card.is_active = False
card.save()

# Unfreeze card
card.status = "active"
card.is_active = True
card.save()
```

## Test Results

### Successful Test Run Output
```
======================================================================
✅ ALL CORE WORKFLOW TESTS PASSED
======================================================================

Workflow Summary:
  1. ✓ Card request created with pending status
  2. ✓ Card attributes verified (pending state)
  3. ✓ Admin approved card
  4. ✓ Card details generated (number, CVV, expiry)
  5. ✓ Approved card attributes verified
  6. ✓ Card can be frozen (suspended)
  7. ✓ Card can be unfrozen (reactivated)
  8. ✓ Card number masking works
  9. ✓ Card rejection workflow works
  10. ✓ Duplicate prevention logic verified

Card State Transitions Tested:
  pending → approved → active ✓
  active → suspended ✓
  suspended → active ✓
  pending → rejected ✓

Issuer Integration Points:
  - Card request creates DB record
  - Admin approval triggers detail generation
  - Card becomes active and ready for use
  - User can freeze/unfreeze (suspend/resume)
  - Stripe webhooks can process authorization
  - Card details secure and properly masked
```

## Security Features

### 1. Card Number Masking
```python
# Full card number never displayed
masked = card.get_masked_number()  # Returns: "****-****-****-1755"
```

### 2. Card PIN Protection
```python
# User sets PIN (hashed)
card.card_pin = make_password(user_provided_pin)
card.save()

# PIN verified with check_password
if check_password(provided_pin, card.card_pin):
    return {"verified": True}
```

### 3. Card State Validation
- Can only approve pending cards
- Can only reject pending cards
- Can only freeze active cards
- Cannot duplicate active/pending cards

## Admin Approval Process

### Via Django Admin Interface
1. Navigate to `/admin/transactions/virtualcard/`
2. Filter by `status = "pending"`
3. Select cards to approve
4. Choose "Approve selected cards" from Actions dropdown
5. Click "Go" button
6. Confirmation message shown

### Manual Approval (Code)
```python
from django.db import transaction

pending_cards = VirtualCard.objects.filter(status="pending")

for card in pending_cards:
    with transaction.atomic():
        # Approve card
        card.status = "approved"
        card.approved_by = admin_user
        card.is_active = True
        card.save()
        
        # Generate card details
        card.generate_card_details()
```

## Issuer Integration (Stripe)

### Card Issuance Flow
```
1. Admin approves card
   ↓
2. generate_card_details() creates:
   - card_number (Visa format: starts with 4)
   - cvv (3 digits)
   - expiry_month, expiry_year
   ↓
3. Card marked as is_active=True
   ↓
4. Ready for Stripe integration
   ↓
5. Stripe webhook handles authorizations
```

### Webhook Handling
**File:** `docs/cards/webhooks.py`
```python
# Handles: issuing_authorization.request
# Handles: issuing_authorization.created
# Handles: issuing_transaction.created
```

## Common Issues & Troubleshooting

### Issue: "You already have an active or pending card request"
**Solution**: Delete previous card or reject it first
```python
VirtualCard.objects.filter(user=user, status="pending").delete()
```

### Issue: Card details not generating
**Solution**: Ensure `generate_card_details()` is called in approval
```python
card.generate_card_details()  # Must be called explicitly
```

### Issue: Card number masking not working
**Solution**: Check `get_masked_number()` method
```python
masked = card.get_masked_number()
# Should return format: ****-****-****-XXXX
```

## Database Queries

### Get user's card
```python
card = VirtualCard.objects.filter(user=user).order_by("-created_at").first()
```

### Get pending cards for approval
```python
pending_cards = VirtualCard.objects.filter(status="pending")
```

### Get user's active cards
```python
active_cards = VirtualCard.objects.filter(user=user, is_active=True)
```

### Get cards by status
```python
approved_cards = VirtualCard.objects.filter(status="approved")
rejected_cards = VirtualCard.objects.filter(status="rejected")
suspended_cards = VirtualCard.objects.filter(status="suspended")
```

## Performance Optimization

### Use `select_related()` for user
```python
cards = VirtualCard.objects.select_related('user', 'approved_by')
```

### Use `only()` to fetch specific fields
```python
cards = VirtualCard.objects.only('id', 'status', 'card_number', 'user_id')
```

### Index on frequently queried fields
```python
# Indexes exist on:
# - user (ForeignKey)
# - status (CharField)
# - is_active (BooleanField)
```

## Related Files

- `transactions/models.py` - VirtualCard model
- `transactions/admin.py` - Admin interface
- `cards/views.py` - API views
- `cards/urls.py` - URL routing
- `cards/serializers.py` - API serializers
- `docs/cards/` - Alternative documentation

## Next Steps

1. Run the test suite: `python manage.py shell < test_card_core_workflow.py`
2. Verify admin approval works via Django admin
3. Test card freezing/unfreezing via API
4. Test Stripe webhook integration
5. Verify card details masking in frontend
6. Monitor card transactions through admin

## References

- Django ORM: https://docs.djangoproject.com/en/6.0/topics/db/models/
- DRF Serializers: https://www.django-rest-framework.org/api-guide/serializers/
- Stripe Issuing: https://stripe.com/docs/issuing
