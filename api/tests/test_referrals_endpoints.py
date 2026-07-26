from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from referrals.models import Referral, ReferralCode, ReferralReward


def test_referrals_summary_returns_code_and_counts(db):
    User = get_user_model()
    user = User.objects.create_user(
        username="test@example.com",
        email="test@example.com",
        password="pass12345",
    )
    client = APIClient()
    client.force_authenticate(user=user)

    url = "/api/referrals/summary/"
    resp = client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "code" in data and isinstance(data["code"], str)
    assert data["referred_count"] == 0
    assert data["total_rewards"] == 0

    # ReferralCode should exist for user
    assert ReferralCode.objects.filter(user=user).exists()


def test_referrals_rewards_lists_items(db):
    User = get_user_model()
    referrer = User.objects.create_user(
        username="ref@example.com",
        email="ref@example.com",
        password="pass12345",
    )
    referred = User.objects.create_user(
        username="friend@example.com",
        email="friend@example.com",
        password="pass12345",
    )

    # Create referral + reward
    referral = Referral.objects.create(
        referrer=referrer,
        referred_user=referred,
    )
    ReferralReward.objects.create(
        referral=referral,
        amount="10.00",
        currency="USD",
        approved=True,
    )

    client = APIClient()
    client.force_authenticate(user=referrer)

    url = "/api/referrals/rewards/"
    resp = client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "results" in data
    assert data["count"] == 1
    assert len(data["results"]) == 1
