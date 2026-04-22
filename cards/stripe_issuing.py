"""
Stripe Issuing helper functions for virtual card management.
Handles creating cardholders, issuing cards, and managing card states.
"""

from django.conf import settings
import stripe

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


def _get_billing_address(profile):
    return {
        "line1": getattr(profile, "address_line1", None)
        or getattr(profile, "street_address", None)
        or getattr(profile, "address", None)
        or getattr(profile, "billing_address", None)
        or "123 Main St",
        "line2": getattr(profile, "address_line2", None) or None,
        "city": getattr(profile, "city", None) or "San Francisco",
        "state": getattr(profile, "state", None) or "CA",
        "postal_code": getattr(profile, "postal_code", None)
        or getattr(profile, "zip_code", None)
        or "94105",
        "country": getattr(profile, "country", None) or "US",
    }


def create_cardholder(user):
    """
    Create a Stripe Cardholder for a user.

    Only creates if stripe_cardholder_id is not already set on the profile.
    Stores the cardholder ID in the user profile for future reference.
    """
    if not hasattr(user, "profile"):
        raise ValueError(f"User {user.id} has no profile")

    profile = user.profile

    # Skip if cardholder already exists
    if profile.stripe_cardholder_id:
        return stripe.issuing.Cardholder.retrieve(profile.stripe_cardholder_id)

    try:
        cardholder = stripe.issuing.Cardholder.create(
            type="individual",
            name=user.get_full_name() or user.username,
            email=user.email,
            billing={"address": _get_billing_address(profile)},
        )

        profile.stripe_cardholder_id = cardholder.id
        profile.save(update_fields=["stripe_cardholder_id"])

        return cardholder
    except stripe.error.StripeError as e:
        raise Exception(f"Failed to create Stripe cardholder: {str(e)}")


def create_virtual_card(user):
    """
    Create a virtual card for a user via Stripe Issuing.

    Only creates if stripe_card_id is not already set on the profile.
    First ensures cardholder exists, then issues a virtual card.
    Stores card details (last4, exp_month, exp_year) in the profile.
    """
    if not hasattr(user, "profile"):
        raise ValueError(f"User {user.id} has no profile")

    profile = user.profile

    if profile.stripe_card_id:
        return stripe.issuing.Card.retrieve(profile.stripe_card_id)

    try:
        if not profile.stripe_cardholder_id:
            create_cardholder(user)

        card = stripe.issuing.Card.create(
            cardholder=profile.stripe_cardholder_id,
            currency="usd",
            type="virtual",
        )

        profile.stripe_card_id = card.id
        profile.card_last4 = card.last4
        profile.card_exp_month = str(card.exp_month)
        profile.card_exp_year = str(card.exp_year)
        profile.save(update_fields=[
            "stripe_card_id",
            "card_last4",
            "card_exp_month",
            "card_exp_year",
        ])

        return card
    except stripe.error.StripeError as e:
        raise Exception(f"Failed to create virtual card: {str(e)}")


def get_card_details(user):
    """
    Retrieve full card details from Stripe Issuing (including number and CVC).

    NOTE: Full card number and CVC are NEVER stored in the database.
    They are fetched on-demand from Stripe and returned in memory only.
    """
    if not hasattr(user, "profile"):
        raise ValueError(f"User {user.id} has no profile")

    profile = user.profile

    if not profile.stripe_card_id:
        raise ValueError(f"User {user.id} has no virtual card")

    try:
        card = stripe.issuing.Card.retrieve(
            profile.stripe_card_id,
            expand=["number", "cvc"],
        )

        return {
            "number": card.number if hasattr(card, "number") else "****",
            "cvc": card.cvc if hasattr(card, "cvc") else "***",
            "exp_month": card.exp_month,
            "exp_year": card.exp_year,
            "last4": card.last4,
            "status": card.status,
        }
    except stripe.error.StripeError as e:
        raise Exception(f"Failed to retrieve card details: {str(e)}")


def toggle_card_freeze(user):
    """
    Toggle a card's frozen status between 'active' and 'inactive'.
    """
    if not hasattr(user, "profile"):
        raise ValueError(f"User {user.id} has no profile")

    profile = user.profile

    if not profile.stripe_card_id:
        raise ValueError(f"User {user.id} has no virtual card")

    try:
        card = stripe.issuing.Card.retrieve(profile.stripe_card_id)
        new_status = "inactive" if card.status == "active" else "active"

        stripe.issuing.Card.modify(profile.stripe_card_id, status=new_status)

        profile.is_card_frozen = new_status == "inactive"
        profile.save(update_fields=["is_card_frozen"])

        return new_status
    except stripe.error.StripeError as e:
        raise Exception(f"Failed to toggle card freeze: {str(e)}")


def get_card_transactions(user, limit=20):
    """
    Retrieve recent transactions for a user's virtual card.
    """
    if not hasattr(user, "profile"):
        raise ValueError(f"User {user.id} has no profile")

    profile = user.profile

    if not profile.stripe_card_id:
        raise ValueError(f"User {user.id} has no virtual card")

    try:
        transactions_obj = stripe.issuing.Transaction.list(
            card=profile.stripe_card_id,
            limit=limit,
        )

        transactions = []
        for txn in transactions_obj.data:
            transactions.append({
                "merchant": txn.merchant_data.get("name", "Unknown Merchant") if txn.merchant_data else "Unknown",
                "amount": abs(txn.amount),
                "currency": txn.currency.upper(),
                "date": txn.created,
                "type": "purchase" if txn.amount < 0 else "refund",
            })

        return transactions
    except stripe.error.StripeError as e:
        raise Exception(f"Failed to retrieve card transactions: {str(e)}")
