from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response

from referrals.models import Referral, ReferralReward, ReferralCode


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

