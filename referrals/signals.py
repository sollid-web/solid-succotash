from .models import Referral, ReferralCode


def create_referral_if_code(referred_user, code: str, meta: dict | None = None):
    """
    Call this function after a successful registration that included a referral code.
    Must be called server-side (not trust client-only).
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

    # Prevent duplicate referral record for same user
    if Referral.objects.filter(referred_user=referred_user).exists():
        return None

    ref = Referral.objects.create(
        referred_user=referred_user,
        referrer=ref_code.user,
        code=code,
        meta=meta or {}
    )
    return ref
