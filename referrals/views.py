import uuid
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.permissions import IsPlatformAdmin

from .models import Referral, ReferralCode, ReferralReward
from .services import create_manual_referral_reward, create_referral_if_code

User = get_user_model()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_referral_code(request):
    """Generate or retrieve user's referral code"""
    user = request.user
    obj, created = ReferralCode.objects.get_or_create(
        user=user,
        defaults={'code': uuid.uuid4().hex[:8].upper()}
    )
    return Response({'code': obj.code, 'created': created})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def referral_dashboard(request):
    """User's referral dashboard with stats"""
    user = request.user
    code_obj = getattr(user, 'referral_code', None)
    code = code_obj.code if code_obj else None

    referrals_qs = Referral.objects.filter(referrer=user)
    total = referrals_qs.count()
    credited = referrals_qs.filter(status=Referral.STATUS_CREDITED).count()
    pending = referrals_qs.filter(status=Referral.STATUS_PENDING).count()

    rewards_total = ReferralReward.objects.filter(
        referral__referrer=user,
        approved=True
    ).aggregate(total=models.Sum('amount'))['total'] or 0

    return Response({
        'code': code,
        'stats': {
            'total_referrals': total,
            'credited': credited,
            'pending': pending,
            'rewards_total': str(rewards_total)
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_referral_hook(request):
    """
    Server-side hook called after user creation.
    Body: { "user_id": "<uuid_or_pk>", "code": "REFCODE", "meta": {...} }
    """
    user_id = request.data.get('user_id')
    code = request.data.get('code')
    meta = request.data.get('meta', {})

    if not user_id or not code:
        return Response(
            {'ok': False, 'error': 'missing_user_or_code'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response(
            {'ok': False, 'error': 'user_not_found'},
            status=status.HTTP_400_BAD_REQUEST
        )

    ref = create_referral_if_code(user, code, meta=meta)
    return Response({
        'ok': True,
        'created': bool(ref),
        'referral_id': str(ref.id) if ref else None
    })


@api_view(['POST'])
@permission_classes([IsPlatformAdmin])
def manual_reward(request):
    """
    Admin manually creates referral reward.
    Body: { referral_id, amount, currency, reward_type, notes }
    """
    referral_id = request.data.get('referral_id')
    amount = request.data.get('amount')
    currency = request.data.get('currency', 'USD')
    reward_type = request.data.get('reward_type', ReferralReward.TYPE_MANUAL)
    notes = request.data.get('notes', '')

    if not referral_id or amount is None:
        return Response(
            {'ok': False, 'error': 'missing_referral_or_amount'},
            status=status.HTTP_400_BAD_REQUEST
        )

    referral = get_object_or_404(Referral, pk=referral_id)

    reward, txn = create_manual_referral_reward(
        referral=referral,
        amount=Decimal(str(amount)),
        currency=currency,
        admin_user=request.user,
        reward_type=reward_type,
        notes=notes
    )

    return Response({
        'ok': True,
        'reward_id': str(reward.id),
        'transaction_id': str(txn.id),
        'status': 'pending_approval'
    })
