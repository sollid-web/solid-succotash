import logging

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from transactions.models import VirtualCard

logger = logging.getLogger(__name__)


def _get_user_card(user, card_id=None):
    if card_id:
        return VirtualCard.objects.filter(id=card_id, user=user).first()
    return VirtualCard.objects.filter(user=user).order_by("-created_at").first()


class CardDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        card = _get_user_card(request.user)
        if not card:
            return Response({"error": "No card found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({
            "id": str(card.id),
            "card_type": card.card_type,
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
