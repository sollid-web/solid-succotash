"""Ad-hoc script to exercise referral flow end-to-end.
Run: python test_referral_flow.py
Assumes Django environment; uses in-memory actions.
"""
import os
from decimal import Decimal

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
django.setup()

from django.contrib.auth import get_user_model

from referrals.models import ReferralCode, ReferralReward
from referrals.services import create_referral_if_code
from transactions.services import approve_transaction, create_transaction
from users.models import UserWallet

User = get_user_model()


def main():
    print("=== Referral Flow Test ===")

    # 1. Create referrer
    referrer_email = "referrer@example.com"
    referrer, _ = User.objects.get_or_create(
        username=referrer_email, email=referrer_email, defaults={"is_active": True}
    )

    # Ensure wallet exists
    UserWallet.objects.get_or_create(user=referrer)

    # 2. Generate referral code
    code_obj, _ = ReferralCode.objects.get_or_create(user=referrer, defaults={"code": "TESTCODE", "active": True})
    if not code_obj.code:
        code_obj.code = "TESTCODE"
        code_obj.active = True
        code_obj.save()
    print(f"Referral code: {code_obj.code}")

    # 3. Create referred user and attach referral via service
    referred_email = "referred@example.com"
    referred, _ = User.objects.get_or_create(
        username=referred_email,
        email=referred_email,
        defaults={"is_active": True},
    )

    ref = create_referral_if_code(referred, code_obj.code)
    print(f"Referral attached: {bool(ref)} (id={getattr(ref, 'id', None)})")

    # 4. Create a deposit transaction for referred user (simulates user deposit request)
    deposit_txn = create_transaction(
        user=referred,
        tx_type="deposit",
        amount=Decimal("1000"),
        reference="Initial deposit",
        payment_method="bank_transfer",
    )
    print(f"Created deposit txn (pending): {deposit_txn.id}")

    # 5. Approve the deposit transaction (triggers referral processing internally)
    admin = referrer  # simulate admin; ensure is_staff
    if not admin.is_staff:
        admin.is_staff = True
        admin.save(update_fields=["is_staff"])
    approve_transaction(deposit_txn, admin, notes="Approved for referral test")
    print("Deposit approved.")

    # 6. Inspect referral reward
    rewards = ReferralReward.objects.filter(referral=ref)
    print(f"Referral rewards count: {rewards.count()}")
    for r in rewards:
        print(f" - Reward {r.id}: amount={r.amount} approved={r.approved}")

    print("=== Referral Flow Test Complete ===")


if __name__ == "__main__":
    main()
