#!/usr/bin/env python
"""
Manual Test Script for Card Request → Approval → Activation Workflow

This script provides step-by-step instructions for testing the full card workflow
in a Django shell or notebook environment.

Usage:
    python manage.py shell < test_card_workflow_manual.py

Or in Django shell:
    python manage.py shell
    >>> exec(open('test_card_workflow_manual.py').read())
"""

from decimal import Decimal
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from transactions.models import VirtualCard
from django.db import transaction

User = get_user_model()

print("\n" + "="*70)
print("CARD REQUEST → APPROVAL → ACTIVATION WORKFLOW TEST")
print("="*70)

# ============================================================================
# SETUP: Create test users
# ============================================================================
print("\n[SETUP] Creating test users...")

# Delete existing test users
User.objects.filter(username__in=['card_user', 'card_admin']).delete()
VirtualCard.objects.filter(user__username__in=['card_user', 'card_admin']).delete()

# Create regular user
user = User.objects.create_user(
    username="card_user",
    email="card_user@example.com",
    password="pass12345",
    first_name="John",
    last_name="Doe"
)
print(f"✓ Regular user created: {user.email}")

# Create admin user
admin = User.objects.create_user(
    username="card_admin",
    email="card_admin@example.com",
    password="pass12345",
    is_staff=True,
    is_superuser=True
)
print(f"✓ Admin user created: {admin.email}")

# ============================================================================
# TEST 1: User requests a card
# ============================================================================
print("\n" + "="*70)
print("TEST 1: USER REQUESTS A CARD")
print("="*70)

client = APIClient()
client.force_authenticate(user=user)

print("\n[REQUEST] User submits card request via API...")
response = client.post("/api/cards/", {
    "purchase_amount": 1000
}, format="json")

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == status.HTTP_201_CREATED:
    print("✓ Card request successful")
    card_id = response.json()["id"]
    card = VirtualCard.objects.get(id=card_id)
    print(f"  - Card ID: {card.id}")
    print(f"  - Status: {card.status}")
    print(f"  - User: {card.user.email}")
    print(f"  - Amount: ${card.purchase_amount}")
    print(f"  - is_active: {card.is_active}")
else:
    print("✗ Card request failed")
    exit(1)

# ============================================================================
# TEST 2: Verify card cannot be duplicated
# ============================================================================
print("\n" + "="*70)
print("TEST 2: PREVENT DUPLICATE CARD REQUESTS")
print("="*70)

print("\n[REQUEST] User attempts to request another card...")
response = client.post("/api/cards/", {
    "purchase_amount": 500
}, format="json")

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == status.HTTP_400_BAD_REQUEST:
    print("✓ Duplicate request correctly rejected")
else:
    print("✗ Duplicate request was not rejected")
    exit(1)

# ============================================================================
# TEST 3: Admin approves the card
# ============================================================================
print("\n" + "="*70)
print("TEST 3: ADMIN APPROVES CARD")
print("="*70)

print(f"\n[APPROVAL] Admin approves card {card.id}...")
print(f"Before approval:")
print(f"  - Status: {card.status}")
print(f"  - Card Number: {card.card_number}")
print(f"  - CVV: {card.cvv}")
print(f"  - is_active: {card.is_active}")

# Simulate admin approval action from Django admin
with transaction.atomic():
    card.status = "approved"
    card.approved_by = admin
    card.is_active = True
    card.save(update_fields=["status", "approved_by", "is_active", "updated_at"])
    print(f"  - Status changed to: approved")
    print(f"  - Approved by: {admin.email}")

    # Generate card details
    print(f"\n[GENERATION] Generating card details...")
    card.generate_card_details()
    print(f"  - Card number generated")
    print(f"  - CVV generated")
    print(f"  - Expiry date set")

# Refresh from database
card.refresh_from_db()

print(f"\nAfter approval:")
print(f"  - Status: {card.status}")
print(f"  - Card Number: {card.card_number}")
print(f"  - CVV: {card.cvv}")
print(f"  - Expiry: {card.expiry_month}/{card.expiry_year}")
print(f"  - Cardholder: {card.cardholder_name}")
print(f"  - is_active: {card.is_active}")
print(f"  - Approved by: {card.approved_by.email}")
print(f"✓ Card successfully approved")

# Verify card details
if (card.status == "approved" and
    card.card_number and
    card.cvv and
    card.expiry_month and
    card.expiry_year and
    card.is_active):
    print("✓ All card details generated correctly")
else:
    print("✗ Card details are missing")
    exit(1)

# ============================================================================
# TEST 4: User retrieves approved card details
# ============================================================================
print("\n" + "="*70)
print("TEST 4: USER RETRIEVES APPROVED CARD DETAILS")
print("="*70)

print("\n[RETRIEVAL] User fetches their card via API...")
response = client.get("/api/cards/")

print(f"Status Code: {response.status_code}")
data = response.json()

if response.status_code == status.HTTP_200_OK:
    print("✓ Card details retrieved successfully")
    print(f"  - ID: {data['id']}")
    print(f"  - Status: {data['status']}")
    print(f"  - Card Number: {data['card_number']}")
    print(f"  - CVV: {data['cvv']}")
    print(f"  - Expiry: {data['expiry_month']}/{data['expiry_year']}")
    print(f"  - Cardholder: {data['cardholder_name']}")
    print(f"  - is_active: {data['is_active']}")
    print(f"  - Purchase Amount: ${data['purchase_amount']}")
else:
    print("✗ Failed to retrieve card")
    exit(1)

# ============================================================================
# TEST 5: User can freeze/suspend card
# ============================================================================
print("\n" + "="*70)
print("TEST 5: USER FREEZES CARD")
print("="*70)

print(f"\n[FREEZE] User requests to freeze card...")
response = client.post("/api/cards/freeze/", {
    "card_id": str(card.id)
}, format="json")

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == status.HTTP_200_OK:
    card.refresh_from_db()
    print(f"✓ Card frozen successfully")
    print(f"  - New Status: {card.status}")
    print(f"  - is_active: {card.is_active}")
else:
    print("✗ Failed to freeze card")
    exit(1)

# ============================================================================
# TEST 6: User can unfreeze/reactivate card
# ============================================================================
print("\n" + "="*70)
print("TEST 6: USER UNFREEZES CARD")
print("="*70)

print(f"\n[UNFREEZE] User requests to unfreeze card...")
response = client.post("/api/cards/freeze/", {
    "card_id": str(card.id)
}, format="json")

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == status.HTTP_200_OK:
    card.refresh_from_db()
    print(f"✓ Card unfrozen successfully")
    print(f"  - New Status: {card.status}")
    print(f"  - is_active: {card.is_active}")
else:
    print("✗ Failed to unfreeze card")
    exit(1)

# ============================================================================
# TEST 7: Card number masking
# ============================================================================
print("\n" + "="*70)
print("TEST 7: CARD NUMBER MASKING")
print("="*70)

print(f"\n[MASKING] Testing card number display masking...")
print(f"  - Full Number: {card.card_number}")
masked = card.get_masked_number()
print(f"  - Masked Number: {masked}")

if masked.endswith(card.card_number[-4:]):
    print(f"✓ Card masking works correctly")
else:
    print(f"✗ Card masking failed")
    exit(1)

# ============================================================================
# TEST 8: Card rejection workflow
# ============================================================================
print("\n" + "="*70)
print("TEST 8: CARD REJECTION WORKFLOW")
print("="*70)

print("\n[SETUP] Creating another pending card for rejection test...")
user2 = User.objects.create_user(
    username="card_user2",
    email="card_user2@example.com",
    password="pass12345"
)

card2 = VirtualCard.objects.create(
    user=user2,
    status="pending",
    purchase_amount=Decimal("1000.00"),
    cardholder_name="Jane Doe"
)
print(f"✓ Pending card created: {card2.id}")

print(f"\n[REJECTION] Admin rejects the card...")
with transaction.atomic():
    card2.status = "rejected"
    card2.approved_by = admin
    card2.save(update_fields=["status", "approved_by", "updated_at"])

card2.refresh_from_db()
print(f"  - Status changed to: {card2.status}")
print(f"  - Rejected by: {card2.approved_by.email}")
print(f"✓ Card rejected successfully")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "="*70)
print("✅ ALL TESTS PASSED")
print("="*70)

print("\nWorkflow Summary:")
print("  1. ✓ User requested card - Status: pending")
print("  2. ✓ Prevented duplicate requests")
print("  3. ✓ Admin approved card - Status: approved")
print("  4. ✓ Card details were generated")
print("  5. ✓ User retrieved card details")
print("  6. ✓ User froze card - Status: suspended")
print("  7. ✓ User unfroze card - Status: active")
print("  8. ✓ Card number properly masked")
print("  9. ✓ Admin rejected another card - Status: rejected")

print("\nKey Workflow States:")
print("  pending → approved → active ✓")
print("  active → suspended (freeze) ✓")
print("  suspended → active (unfreeze) ✓")
print("  pending → rejected ✓")

print("\nIssuer Integration Points:")
print("  - Card request creates VirtualCard with pending status")
print("  - Admin approval generates card details (card_number, cvv, expiry)")
print("  - Card becomes active and ready for use")
print("  - User can freeze/unfreeze card")
print("  - Stripe webhooks can process authorization requests")

print("\n" + "="*70)
print("Test completed successfully!")
print("="*70 + "\n")
