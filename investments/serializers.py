from django.utils import timezone
from rest_framework import serializers
from investments.models import UserInvestment


class InvestmentRowSerializer(serializers.ModelSerializer):
    """
    Enforces lifecycle status based on dates.
    This is GLOBAL platform logic.
    """

    derived_status = serializers.SerializerMethodField()

    class Meta:
        model = UserInvestment
        fields = [
            "id",
            "plan",
            "amount",
            "started_at",
            "ends_at",
            "status",          # approval status (approved/pending)
            "derived_status",  # lifecycle status (ACTIVE / COMPLETED)
        ]

    def get_derived_status(self, obj):
        now = timezone.now()

        if obj.started_at and now < obj.started_at:
            return "UPCOMING"

        if obj.ends_at and now >= obj.ends_at:
            return "COMPLETED"

        return "ACTIVE"
