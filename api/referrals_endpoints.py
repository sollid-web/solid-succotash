


from decimal import Decimal
from django.db.models import Sum
from django.apps import apps
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes


UserInvestment = apps.get_model("investments", "UserInvestment")
DailyRoiPayout = apps.get_model("investments", "DailyRoiPayout")
UserWallet = apps.get_model("users", "UserWallet")


class DashboardOverview(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user

        # Wallet (source of truth)
        wallet_balance = (
            UserWallet.objects.filter(user=u).values_list("balance", flat=True).first()
            or Decimal("0.00")
        )

        # Active principal only
        principal_total = (
            UserInvestment.objects.filter(user=u, status="active")
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        # Profit from payouts only (do NOT mix with principal)
        roi_total = (
            DailyRoiPayout.objects.filter(investment__user=u)
            .aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        return Response({
            "wallet_balance": str(wallet_balance),
            "principal_total": str(principal_total),
            "roi_total": str(roi_total),
            # Optional UI cards: if you keep them, make clear they are legacy-incomplete
            "total_deposits": "0.00",
            "total_withdrawals": "0.00",
        })



from referrals.models import Referral, ReferralCode, ReferralReward


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def referrals_summary(request):
    """
    Return referral summary for the current user: code, counts,
    and latest reward.
    """
    user = request.user
    code_obj, _ = ReferralCode.objects.get_or_create(user=user)
    referred_count = Referral.objects.filter(referrer=user).count()
    rewards_qs = (
        ReferralReward.objects.filter(referral__referrer=user)
        .order_by("-created_at")
    )
    total_rewards = rewards_qs.count()
    latest = rewards_qs.first()
    latest_amount = str(getattr(latest, "amount", "0")) if latest else None
    latest_status = (
        "approved"
        if getattr(latest, "approved", False)
        else ("pending" if latest else None)
    )
    return Response(
        {
            "code": code_obj.code,
            "referred_count": referred_count,
            "total_rewards": total_rewards,
            "latest_reward": {
                "amount": latest_amount,
                "status": latest_status,
            },
        }
    )


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def referrals_rewards(request):
    """
    List referral rewards for the current user's referrals.
    """
    user = request.user
    rewards = (
        ReferralReward.objects.filter(referral__referrer=user)
        .order_by("-created_at")
    )
    data = [
        {
            "id": str(r.id),
            "type": r.reward_type,
            "amount": str(r.amount),
            "currency": r.currency,
            "approved": r.approved,
            "created_at": r.created_at,
            "referral_id": str(getattr(r.referral, "id", "")),
        }
        for r in rewards[:100]
    ]
    return Response({"results": data, "count": rewards.count()})

