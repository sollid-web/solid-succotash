from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Referral, ReferralSetting, ReferralReward
from transactions.services import create_transaction

User = get_user_model()


@transaction.atomic
def process_deposit_referral(referred_user_id, deposit_amount: Decimal, currency='USD'):
    """
    Server-side process that checks if referred_user has a pending referral and credits referrer.
    Creates pending transaction requiring admin approval per WolvCapital workflow.
    """
    try:
        referral = Referral.objects.filter(
            referred_user__id=referred_user_id, 
            reward_processed=False
        ).select_for_update().select_related('referrer').first()
        
        if not referral:
            return {'ok': False, 'reason': 'no_pending_referral'}

        # Load settings
        deposit_setting = ReferralSetting.get(
            'deposit_reward', 
            {"percent": 2.5, "enabled": True, "apply_once": True, "min_deposit": 0}
        )
        if not deposit_setting.get('enabled', True):
            return {'ok': False, 'reason': 'deposit_rewards_disabled'}

        min_deposit = Decimal(str(deposit_setting.get('min_deposit', 0)))
        if deposit_amount < min_deposit:
            return {'ok': False, 'reason': 'deposit_below_minimum'}

        percent = Decimal(str(deposit_setting.get('percent', 0)))
        reward_amount = (deposit_amount * percent) / Decimal('100')

        # Optional caps
        cap = deposit_setting.get('max_reward_amount')
        if cap is not None:
            reward_amount = min(reward_amount, Decimal(str(cap)))

        # Record referral reward
        reward = ReferralReward.objects.create(
            referral=referral,
            reward_type=ReferralReward.TYPE_DEPOSIT,
            amount=reward_amount,
            currency=currency,
            created_by=None,
            approved=False,  # Requires admin approval
            approved_at=None
        )

        # Create pending transaction using WolvCapital's transaction service
        txn = create_transaction(
            user=referral.referrer,
            tx_type='deposit',
            amount=reward_amount,
            reference=f"Referral reward: {percent}% of ${deposit_amount}",
            payment_method='referral_bonus'
        )

        # Mark referral credited (transaction still pending approval)
        referral.mark_credited()

        return {
            'ok': True,
            'reward_amount': str(reward_amount),
            'transaction_id': str(txn.id)
        }
    except Exception as e:
        return {'ok': False, 'reason': 'exception', 'error': str(e)}
