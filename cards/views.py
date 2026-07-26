import logging
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from transactions.models import VirtualCard

logger = logging.getLogger(__name__)

def _get_user_card(user, card_id=None):
    """
    Helper to fetch the user's card.
    Prioritizes a specific ID if provided, otherwise gets the latest.
    """
    if card_id:
        return VirtualCard.objects.filter(id=card_id, user=user).first()
    return VirtualCard.objects.filter(user=user).order_by("-created_at").first()

class CardDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Fetches card details for the dashboard."""
        card = _get_user_card(request.user)

        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "id": str(card.id),
            "card_type": getattr(card, 'card_type', 'Visa'),
            "card_number": card.card_number,
            "cardholder_name": card.cardholder_name,
            "expiry_month": card.expiry_month,
            "expiry_year": card.expiry_year,
            "cvv": card.cvv,
            "balance": str(card.balance),
            "purchase_amount": str(card.purchase_amount),
            "status": card.status,
            "is_active": card.is_active,
            "created_at": card.created_at,
            "updated_at": card.updated_at,
        })

    def post(self, request):
        """Handles the 'Request Card' submission from the frontend."""
        if VirtualCard.objects.filter(user=request.user, status__in=['active', 'pending']).exists():
            return Response(
                {"error": "You already have an active or pending card request."},
                status=status.HTTP_400_BAD_REQUEST
            )

        purchase_amount = request.data.get("purchase_amount", 1000)

        try:
            card = VirtualCard.objects.create(
                user=request.user,
                purchase_amount=purchase_amount,
                status="pending",
                is_active=False,
                cardholder_name=f"{request.user.get_full_name() or request.user.username}",
                balance=0.00
            )

            logger.info(f"New card request created for user {request.user.id}")

            return Response({
                "id": str(card.id),
                "status": card.status,
                "message": "Card request submitted successfully."
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Failed to create card request: {str(e)}")
            return Response(
                {"error": "Could not process card request. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CardFreezeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        card_id = request.data.get("card_id")
        card = _get_user_card(request.user, card_id)

        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)

        if card.status == "active":
            card.status = "suspended"
            card.is_active = False
            frozen = True
        elif card.status == "suspended":
            card.status = "active"
            card.is_active = True
            frozen = False
        else:
            return Response(
                {"error": f"Cannot toggle freeze on a card with status '{card.status}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card.save(update_fields=["status", "is_active", "updated_at"])
        logger.info(f"Card {card.id} {'frozen' if frozen else 'unfrozen'} by user {request.user.id}")
        return Response({"frozen": frozen, "status": card.status})

class CardTransactionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        card = _get_user_card(request.user)
        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)
        return Response([])

class VerifyPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.contrib.auth.hashers import check_password
        pin = request.data.get("password", "").strip()

        if not pin:
            return Response({"error": "Card PIN is required."}, status=status.HTTP_400_BAD_REQUEST)

        card = VirtualCard.objects.filter(user=request.user).first()
        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)

        if not card.card_pin:
            return Response(
                {"verified": False, "error": "Card PIN not set. Contact support."},
                status=status.HTTP_403_FORBIDDEN
            )

        if check_password(pin, card.card_pin):
            return Response({"verified": True})

        return Response(
            {"verified": False, "error": "Incorrect card PIN."},
            status=status.HTTP_401_UNAUTHORIZED
        )

class SetPinView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.contrib.auth.hashers import make_password
        pin = request.data.get("pin", "").strip()
        confirm = request.data.get("confirm_pin", "").strip()

        if not pin or not confirm:
            return Response({"error": "Both PIN fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if len(pin) < 4 or not pin.isdigit():
            return Response({"error": "PIN must be at least 4 digits."}, status=status.HTTP_400_BAD_REQUEST)

        if pin != confirm:
            return Response({"error": "PINs do not match."}, status=status.HTTP_400_BAD_REQUEST)

        card = VirtualCard.objects.filter(user=request.user).first()
        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)

        if card.card_pin:
            return Response(
                {"error": "PIN already set. Contact support to reset."},
                status=status.HTTP_400_BAD_REQUEST
            )

        card.card_pin = make_password(pin)
        card.save(update_fields=["card_pin"])
        return Response({"success": True, "message": "Card PIN created successfully."})

class CheckPinView(APIView):
    """Checks if the authenticated user has already set a card PIN."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        card = VirtualCard.objects.filter(user=request.user).first()
        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)
        has_pin = bool(card.card_pin)
        return Response({"has_pin": has_pin})

