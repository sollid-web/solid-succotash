import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import VirtualCard
from .serializers import CardTransactionSerializer, VirtualCardSerializer

# Initialize Stripe with your key
stripe.api_key = settings.STRIPE_SECRET_KEY


# ══════════════════════════════════════════════════════════
# 1️⃣  USER REQUESTS A CARD  →  Creates pending card in DB
# ══════════════════════════════════════════════════════════
class RequestCardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # Prevent duplicate cards
        if VirtualCard.objects.filter(user=user).exists():
            return Response(
                {"error": "You already have a virtual card"}, status=status.HTTP_400_BAD_REQUEST
            )

        purchase_amount = request.data.get("purchase_amount", 1000)

        # Create pending card in YOUR database
        card = VirtualCard.objects.create(
            user=user,
            purchase_amount=purchase_amount,
            status="pending",  # ← Waiting for admin approval
        )

        return Response(
            {
                "message": "Card request submitted. Pending admin approval.",
                "card": VirtualCardSerializer(card).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ══════════════════════════════════════════════════════════
# 2️⃣  ADMIN APPROVES CARD  →  Calls Stripe, activates card
# ══════════════════════════════════════════════════════════
class ApproveCardView(APIView):
    permission_classes = [IsAdminUser]  # ← Only admins can approve

    def post(self, request, card_id):
        try:
            card = VirtualCard.objects.get(id=card_id, status="pending")
        except VirtualCard.DoesNotExist:
            return Response(
                {"error": "Card not found or already processed"}, status=status.HTTP_404_NOT_FOUND
            )

        user = card.user

        try:
            # ── STEP A: Create Stripe Cardholder ──────────────
            cardholder = stripe.issuing.Cardholder.create(
                name=user.get_full_name() or user.username,
                email=user.email,
                phone_number=getattr(user, "phone_number", "+15555555555"),
                status="active",
                type="individual",
                individual={
                    "first_name": user.first_name or "User",
                    "last_name": user.last_name or "Name",
                    "dob": {"day": 1, "month": 1, "year": 1990},
                },
                billing={
                    "address": {
                        "line1": "1234 Main St",
                        "city": "San Francisco",
                        "state": "CA",
                        "postal_code": "94111",
                        "country": "US",
                    }
                },
            )

            # ── STEP B: Issue Virtual Card via Stripe ─────────
            stripe_card = stripe.issuing.Card.create(
                cardholder=cardholder.id,
                currency="usd",
                type="virtual",
                status="active",  # ← Active immediately
                spending_controls={
                    "spending_limits": [
                        {
                            "amount": int(card.purchase_amount * 100),  # Convert to cents
                            "interval": "all_time",
                        }
                    ],
                },
                metadata={
                    "wolvcapital_card_id": str(card.id),
                    "user_id": str(user.id),
                    "user_email": user.email,
                },
            )

            # ── STEP C: Save Stripe IDs to YOUR database ──────
            card.stripe_cardholder_id = cardholder.id
            card.stripe_card_id = stripe_card.id
            card.last4 = stripe_card.last4
            card.exp_month = stripe_card.exp_month
            card.exp_year = stripe_card.exp_year
            card.brand = stripe_card.brand
            card.status = "active"
            card.current_balance = card.purchase_amount
            card.activated_at = timezone.now()
            card.save()

            return Response(
                {
                    "message": f"Card approved and activated for {user.email}",
                    "card": VirtualCardSerializer(card).data,
                }
            )

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ══════════════════════════════════════════════════════════
# 3️⃣  GET CARD DETAILS  →  Returns number, CVV, expiry
# ══════════════════════════════════════════════════════════
class CardDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            card = VirtualCard.objects.get(user=request.user)
        except VirtualCard.DoesNotExist:
            return Response({"error": "No card found"}, status=status.HTTP_404_NOT_FOUND)

        # Can't reveal details of pending card
        if card.status != "active":
            return Response(
                {
                    "error": f"Card is {card.status}. Only active cards can be revealed.",
                    "status": card.status,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            # ── Fetch LIVE details from Stripe ────────────────
            # number & cvc are only returned when explicitly expanded
            stripe_card = stripe.issuing.Card.retrieve(
                card.stripe_card_id,
                expand=["number", "cvc"],  # ← This is the magic line
            )

            return Response(
                {
                    "card_details": {
                        "number": stripe_card.number,  # "4000 0566 5566 5556"
                        "cvc": stripe_card.cvc,  # "123"
                        "exp_month": stripe_card.exp_month,  # 12
                        "exp_year": stripe_card.exp_year,  # 2027
                        "last4": stripe_card.last4,  # "5556"
                        "brand": stripe_card.brand,  # "visa"
                        "status": stripe_card.status,  # "active"
                    }
                }
            )

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ══════════════════════════════════════════════════════════
# 4️⃣  GET CARD STATUS  →  Safe info (no number/CVV)
# ══════════════════════════════════════════════════════════
class MyCardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            card = VirtualCard.objects.get(user=request.user)
            return Response(VirtualCardSerializer(card).data)
        except VirtualCard.DoesNotExist:
            return Response({"error": "No card found"}, status=status.HTTP_404_NOT_FOUND)


# ══════════════════════════════════════════════════════════
# 5️⃣  CARD TRANSACTIONS HISTORY
# ══════════════════════════════════════════════════════════
class CardTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            card = VirtualCard.objects.get(user=request.user)
            transactions = card.transactions.all().order_by("-created_at")
            return Response(CardTransactionSerializer(transactions, many=True).data)
        except VirtualCard.DoesNotExist:
            return Response({"error": "No card found"}, status=status.HTTP_404_NOT_FOUND)


# ══════════════════════════════════════════════════════════
# 6️⃣  FREEZE / UNFREEZE CARD
# ══════════════════════════════════════════════════════════
class ToggleCardStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            card = VirtualCard.objects.get(user=request.user)
        except VirtualCard.DoesNotExist:
            return Response({"error": "No card found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")  # 'freeze' or 'unfreeze'

        if action == "freeze":
            stripe.issuing.Card.modify(card.stripe_card_id, status="inactive")
            card.status = "inactive"
            card.save()
            return Response({"message": "🔒 Card frozen successfully"})

        elif action == "unfreeze":
            stripe.issuing.Card.modify(card.stripe_card_id, status="active")
            card.status = "active"
            card.save()
            return Response({"message": "✅ Card unfrozen successfully"})

        return Response(
            {"error": "Invalid action. Use freeze or unfreeze"}, status=status.HTTP_400_BAD_REQUEST
        )


# ══════════════════════════════════════════════════════════
# 7️⃣  FUND ISSUING BALANCE (Admin — Test Mode)
# ══════════════════════════════════════════════════════════
class FundIssuingBalanceView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        amount = request.data.get("amount", 2000)  # Default $2000
        try:
            topup = stripe.Topup.create(
                amount=int(amount) * 100,
                currency="usd",
                description="WolvCapital Issuing Balance Top-up",
                statement_descriptor="WOLVCAPITAL",
            )
            return Response(
                {
                    "message": f"Issuing balance funded with ${amount}",
                    "topup_id": topup.id,
                    "status": topup.status,
                }
            )
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
