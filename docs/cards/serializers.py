from rest_framework import serializers

from .models import CardTransaction, VirtualCard


class VirtualCardSerializer(serializers.ModelSerializer):
    """Safe serializer — never exposes full card number or CVV"""

    class Meta:
        model = VirtualCard
        fields = [
            "id",
            "last4",
            "exp_month",
            "exp_year",
            "brand",
            "card_type",
            "status",
            "purchase_amount",
            "current_balance",
            "created_at",
            "activated_at",
        ]
        read_only_fields = fields


class CardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardTransaction
        fields = ["id", "amount", "currency", "merchant", "status", "created_at"]
