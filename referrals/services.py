from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction

from transactions.services import create_transaction

from .models import Referral, ReferralCode, ReferralReward

User = get_user_model()


def create_referral_if_code(referred_user, code: str, meta: dict = None):
    """
    Create a referral record if valid code exists.
    Called server-side after user registration.
    """
    if not code:
        return None

    try:
        ref_code = ReferralCode.objects.get(code=code, active=True)
    except ReferralCode.DoesNotExist:
        return None

    # Prevent self-referral
    if str(ref_code.user.pk) == str(referred_user.pk):
        return None

    # Check if user already has referral
    if Referral.objects.filter(referred_user=referred_user).exists():
        return None

    ref = Referral.objects.create(
        referred_user=referred_user,
        referrer=ref_code.user,
        code=code,
        meta=meta or {}
    )
    return ref


@transaction.atomic
def create_manual_referral_reward(referral, amount: Decimal, currency: str, admin_user, reward_type=ReferralReward.TYPE_MANUAL, notes=''):
    """
    Admin creates a manual referral reward.
    Creates pending transaction requiring approval.
    """
    reward = ReferralReward.objects.create(
        referral=referral,
        reward_type=reward_type,
        amount=amount,
        currency=currency,
        created_by=admin_user,
        approved=False,
        meta={'notes': notes}
    )

    txn = create_transaction(
        user=referral.referrer,
        tx_type='deposit',
        amount=amount,
        reference=f"Manual referral reward - {notes}",
        payment_method='referral_bonus'
    )

    return reward, txn
