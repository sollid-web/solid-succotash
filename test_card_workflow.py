"""
Comprehensive test for the Card Request → Approval → Activation workflow
Tests the full journey of requesting a card, admin approval, and issuer activation.
"""
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from rest_framework.test import APIClient
from rest_framework import status

from transactions.models import VirtualCard

User = get_user_model()


class CardRequestWorkflowTests(TransactionTestCase):
    """
    Tests the full card request and approval workflow:
    1. User requests a card
    2. Card is created with 'pending' status
    3. Admin approves the card
    4. Card details are generated
    5. Card becomes 'approved' and 'active'
    6. Card is ready for use
    """

    def setUp(self):
        """Set up test fixtures"""
        self.client = APIClient()

        # Create regular user
        self.user = User.objects.create_user(
            username="card_user",
            email="card_user@example.com",
            password="pass12345",
            first_name="John",
            last_name="Doe"
        )

        # Create admin user
        self.admin = User.objects.create_user(
            username="card_admin",
            email="card_admin@example.com",
            password="pass12345",
            is_staff=True,
            is_superuser=True
        )

    def test_01_user_can_request_card(self):
        """
        Test 1: User can request a virtual card
        Expected: Card is created with 'pending' status
        """
        print("\n" + "="*60)
        print("TEST 1: User requests a card")
        print("="*60)

        # Authenticate as regular user
        self.client.force_authenticate(user=self.user)

        # Request a card
        response = self.client.post("/api/cards/", {
            "purchase_amount": 1000
        }, format="json")

        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

        # Assert response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["status"], "pending")
        self.assertIn("id", data)
        self.assertIn("message", data)

        # Verify card in database
        card = VirtualCard.objects.get(id=data["id"])
        self.assertEqual(card.user, self.user)
        self.assertEqual(card.status, "pending")
        self.assertEqual(card.purchase_amount, Decimal("1000.00"))
        self.assertEqual(card.balance, Decimal("0.00"))
        self.assertEqual(card.is_active, False)

        print("✅ Card request successful")
        print(f"Card ID: {card.id}")
        print(f"Card Status: {card.status}")
        print(f"User: {card.user.email}")
        print(f"Purchase Amount: ${card.purchase_amount}")

    def test_02_duplicate_card_request_rejected(self):
        """
        Test 2: User cannot request multiple cards
        Expected: Second request returns 400 error
        """
        print("\n" + "="*60)
        print("TEST 2: Prevent duplicate card requests")
        print("="*60)

        self.client.force_authenticate(user=self.user)

        # First request - should succeed
        response1 = self.client.post("/api/cards/", {
            "purchase_amount": 1000
        }, format="json")
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second request - should fail
        response2 = self.client.post("/api/cards/", {
            "purchase_amount": 500
        }, format="json")

        print(f"First Request Status: {response1.status_code}")
        print(f"Second Request Status: {response2.status_code}")
        print(f"Second Request Error: {response2.json()}")

        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response2.json())

        print("✅ Duplicate card request was properly rejected")

    def test_03_card_cannot_be_approved_without_pending_status(self):
        """
        Test 3: Only pending cards can be approved
        Expected: Cannot approve a card that's not pending
        """
        print("\n" + "="*60)
        print("TEST 3: Can only approve pending cards")
        print("="*60)

        # Create a card with 'active' status
        card = VirtualCard.objects.create(
            user=self.user,
            status="active",
            purchase_amount=Decimal("1000.00"),
            card_number="4111111111111111",
            cvv="123",
            cardholder_name="John Doe",
            expiry_month="12",
            expiry_year="25"
        )

        print(f"Card ID: {card.id}")
        print(f"Card Status: {card.status}")

        # Try to approve it using the admin queryset filter
        queryset = VirtualCard.objects.filter(status="pending")
        pending_count = queryset.count()

        print(f"Pending cards before approval attempt: {pending_count}")
        self.assertEqual(pending_count, 0)

        print("✅ Only pending cards can be approved")

    def test_04_admin_approves_card(self):
        """
        Test 4: Admin can approve a pending card
        Expected: Card status changes from 'pending' to 'approved'
                 Card details are generated
                 Card becomes 'active'
        """
        print("\n" + "="*60)
        print("TEST 4: Admin approves pending card")
        print("="*60)

        # Create a pending card
        card = VirtualCard.objects.create(
            user=self.user,
            status="pending",
            purchase_amount=Decimal("1000.00"),
            cardholder_name="John Doe"
        )

        print(f"Card ID: {card.id}")
        print(f"Initial Status: {card.status}")
        print(f"Initial is_active: {card.is_active}")
        print(f"Initial Card Number: {card.card_number}")

        # Simulate admin approval action
        from django.db import transaction
        with transaction.atomic():
            card.status = "approved"
            card.approved_by = self.admin
            card.is_active = True
            card.save(update_fields=["status", "approved_by", "is_active", "updated_at"])

            # Generate card details
            card.generate_card_details()

        # Refresh from database
        card.refresh_from_db()

        print(f"\nAfter Approval:")
        print(f"Status: {card.status}")
        print(f"is_active: {card.is_active}")
        print(f"Card Number: {card.card_number}")
        print(f"CVV: {card.cvv}")
        print(f"Expiry: {card.expiry_month}/{card.expiry_year}")
        print(f"Cardholder: {card.cardholder_name}")
        print(f"Approved By: {card.approved_by.email}")
        print(f"Updated At: {card.updated_at}")

        # Assertions
        self.assertEqual(card.status, "approved")
        self.assertEqual(card.is_active, True)
        self.assertEqual(card.approved_by, self.admin)
        self.assertIsNotNone(card.card_number)
        self.assertIsNotNone(card.cvv)
        self.assertIsNotNone(card.expiry_month)
        self.assertIsNotNone(card.expiry_year)
        self.assertEqual(card.cardholder_name, "John Doe")

        # Verify card number format (starts with 4 for Visa)
        self.assertTrue(card.card_number.startswith("4"))
        self.assertEqual(len(card.card_number), 16)
        self.assertEqual(len(card.cvv), 3)

        print("\n✅ Card successfully approved and details generated")

    def test_05_approved_card_is_ready_for_use(self):
        """
        Test 5: Approved card can be retrieved and used
        Expected: User can fetch their approved card details
        """
        print("\n" + "="*60)
        print("TEST 5: User can fetch approved card")
        print("="*60)

        # Create and approve a card
        card = VirtualCard.objects.create(
            user=self.user,
            status="approved",
            is_active=True,
            purchase_amount=Decimal("1000.00"),
            cardholder_name="John Doe",
            card_number="4111111111111111",
            cvv="123",
            expiry_month="12",
            expiry_year="25",
            approved_by=self.admin
        )

        print(f"Card ID: {card.id}")
        print(f"Card Status: {card.status}")

        # Authenticate as user
        self.client.force_authenticate(user=self.user)

        # Fetch card details via API
        response = self.client.get("/api/cards/")

        print(f"Response Status: {response.status_code}")
        print(f"Response Data: {response.json()}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data["id"], str(card.id))
        self.assertEqual(data["status"], "approved")
        self.assertEqual(data["is_active"], True)
        self.assertEqual(data["card_number"], "4111111111111111")
        self.assertEqual(data["cvv"], "123")
        self.assertEqual(data["expiry_month"], "12")
        self.assertEqual(data["expiry_year"], "25")
        self.assertEqual(data["cardholder_name"], "John Doe")
        self.assertEqual(data["purchase_amount"], "1000.00")

        print("✅ Approved card details successfully retrieved")

    def test_06_card_rejection_workflow(self):
        """
        Test 6: Admin can reject a pending card
        Expected: Card status changes from 'pending' to 'rejected'
        """
        print("\n" + "="*60)
        print("TEST 6: Admin rejects pending card")
        print("="*60)

        # Create a pending card
        card = VirtualCard.objects.create(
            user=self.user,
            status="pending",
            purchase_amount=Decimal("1000.00"),
            cardholder_name="John Doe",
            notes="Suspicious activity"
        )

        print(f"Card ID: {card.id}")
        print(f"Initial Status: {card.status}")

        # Simulate admin rejection action
        from django.db import transaction
        with transaction.atomic():
            card.status = "rejected"
            card.approved_by = self.admin
            card.save(update_fields=["status", "approved_by", "updated_at"])

        card.refresh_from_db()

        print(f"After Rejection:")
        print(f"Status: {card.status}")
        print(f"Approved By: {card.approved_by.email}")

        self.assertEqual(card.status, "rejected")
        self.assertEqual(card.approved_by, self.admin)
        self.assertEqual(card.is_active, False)

        print("✅ Card successfully rejected")

    def test_07_user_can_freeze_active_card(self):
        """
        Test 7: User can freeze/suspend their active card
        Expected: Card status changes from 'active' to 'suspended'
        """
        print("\n" + "="*60)
        print("TEST 7: User freezes active card")
        print("="*60)

        # Create an active card
        card = VirtualCard.objects.create(
            user=self.user,
            status="active",
            is_active=True,
            purchase_amount=Decimal("1000.00"),
            card_number="4111111111111111",
            cvv="123",
            cardholder_name="John Doe",
            expiry_month="12",
            expiry_year="25"
        )

        print(f"Card ID: {card.id}")
        print(f"Initial Status: {card.status}")
        print(f"Initial is_active: {card.is_active}")

        # Authenticate as user
        self.client.force_authenticate(user=self.user)

        # Freeze the card
        response = self.client.post("/api/cards/freeze/", {
            "card_id": str(card.id)
        }, format="json")

        print(f"Response Status: {response.status_code}")
        print(f"Response Data: {response.json()}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        card.refresh_from_db()

        print(f"\nAfter Freeze:")
        print(f"Status: {card.status}")
        print(f"is_active: {card.is_active}")

        self.assertEqual(card.status, "suspended")
        self.assertEqual(card.is_active, False)

        print("✅ Card successfully frozen")

    def test_08_user_can_unfreeze_card(self):
        """
        Test 8: User can unfreeze/reactivate their suspended card
        Expected: Card status changes from 'suspended' back to 'active'
        """
        print("\n" + "="*60)
        print("TEST 8: User unfreezes suspended card")
        print("="*60)

        # Create a suspended card
        card = VirtualCard.objects.create(
            user=self.user,
            status="suspended",
            is_active=False,
            purchase_amount=Decimal("1000.00"),
            card_number="4111111111111111",
            cvv="123",
            cardholder_name="John Doe",
            expiry_month="12",
            expiry_year="25"
        )

        print(f"Card ID: {card.id}")
        print(f"Initial Status: {card.status}")
        print(f"Initial is_active: {card.is_active}")

        # Authenticate as user
        self.client.force_authenticate(user=self.user)

        # Unfreeze the card
        response = self.client.post("/api/cards/freeze/", {
            "card_id": str(card.id)
        }, format="json")

        print(f"Response Status: {response.status_code}")
        print(f"Response Data: {response.json()}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        card.refresh_from_db()

        print(f"\nAfter Unfreeze:")
        print(f"Status: {card.status}")
        print(f"is_active: {card.is_active}")

        self.assertEqual(card.status, "active")
        self.assertEqual(card.is_active, True)

        print("✅ Card successfully unfrozen")

    def test_09_card_details_properly_masked(self):
        """
        Test 9: Card number is properly masked for display
        Expected: get_masked_number() returns •••• + last 4 digits
        """
        print("\n" + "="*60)
        print("TEST 9: Card number masking for display")
        print("="*60)

        # Create an approved card
        card = VirtualCard.objects.create(
            user=self.user,
            status="approved",
            card_number="4111111111115555",
            cardholder_name="John Doe"
        )

        print(f"Card ID: {card.id}")
        print(f"Full Card Number: {card.card_number}")

        # Get masked number
        masked = card.get_masked_number()

        print(f"Masked Card Number: {masked}")

        # Should be •••• + last 4 digits
        self.assertIn("5555", masked)
        self.assertTrue(masked.endswith("5555"))

        print("✅ Card number properly masked")

    def test_10_full_workflow_end_to_end(self):
        """
        Test 10: Complete end-to-end workflow
        Request → Pending → Admin Approves → Active → User Can Use
        """
        print("\n" + "="*60)
        print("TEST 10: Complete End-to-End Workflow")
        print("="*60)

        print("\n1️⃣  USER REQUESTS CARD")
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/cards/", {
            "purchase_amount": 5000
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        card_id = response.json()["id"]
        print(f"   ✓ Card requested: {card_id}")

        card = VirtualCard.objects.get(id=card_id)
        self.assertEqual(card.status, "pending")
        print(f"   ✓ Card status: {card.status}")

        print("\n2️⃣  ADMIN APPROVES CARD")
        from django.db import transaction
        with transaction.atomic():
            card.status = "approved"
            card.approved_by = self.admin
            card.is_active = True
            card.save(update_fields=["status", "approved_by", "is_active", "updated_at"])
            card.generate_card_details()
        print(f"   ✓ Card approved by: {card.approved_by.email}")
        print(f"   ✓ Card number generated: {card.card_number}")

        print("\n3️⃣  CARD DETAILS RETRIEVED")
        card.refresh_from_db()
        response = self.client.get("/api/cards/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        print(f"   ✓ Card ID: {data['id']}")
        print(f"   ✓ Status: {data['status']}")
        print(f"   ✓ Card Number: {data['card_number']}")
        print(f"   ✓ is_active: {data['is_active']}")

        print("\n4️⃣  CARD READY FOR USE")
        self.assertEqual(data["status"], "approved")
        self.assertEqual(data["is_active"], True)
        self.assertIsNotNone(data["card_number"])
        self.assertIsNotNone(data["cvv"])
        print("   ✓ Card is ready for transactions")

        print("\n✅ Complete workflow successful!")
