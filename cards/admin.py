import stripe
from django.conf import settings
from django.contrib import admin, messages
from django.utils import timezone

from .models import VirtualCard

# initialize Stripe key for admin actions
stripe.api_key = settings.STRIPE_SECRET_KEY


@admin.action(description="Approve selected cards")
def approve_selected_cards(modeladmin, request, queryset):
    """Admin action to mirror the logic in ApproveCardView.

    Only pending cards are processed. For each, we call Stripe to create a
    cardholder and issue a virtual card. On success we activate the card and
    display a success message; on failure we catch the StripeError and send a
    warning message back to the admin.
    """
    pending = queryset.filter(status="pending")
    for card in pending:
        user = card.user
        try:
            # create Stripe cardholder
            cardholder = stripe.issuing.Cardholder.create(
                name=user.get_full_name() or user.username,
                email=user.email,
                phone_number=getattr(user, "phone_number", "+15555555555"),
                status="active",
                type="individual",
                individual={
                    "first_name": user.first_name or "User",
                    "last_name": user.last_name or "Name",
                    "dob": {"day": 1, "month": 1, "year": 1990},
                },
                billing={
                    "address": {
                        "line1": "1234 Main St",
                        "city": "San Francisco",
                        "state": "CA",
                        "postal_code": "94111",
                        "country": "US",
                    }
                },
            )

            # issue Stripe virtual card
            stripe_card = stripe.issuing.Card.create(
                cardholder=cardholder.id,
                currency="usd",
                type="virtual",
                status="active",
                spending_controls={
                    "spending_limits": [{
                        "amount": int(card.purchase_amount * 100),
                        "interval": "all_time",
                    }],
                },
                metadata={
                    "wolvcapital_card_id": str(card.id),
                    "user_id": str(user.id),
                    "user_email": user.email,
                },
            )

            # update local record
            card.stripe_cardholder_id = cardholder.id
            card.stripe_card_id = stripe_card.id
            card.last4 = stripe_card.last4
            card.exp_month = stripe_card.exp_month
            card.exp_year = stripe_card.exp_year
            card.brand = stripe_card.brand
            card.status = "active"
            card.current_balance = card.purchase_amount
            card.activated_at = timezone.now()
            card.save()

            messages.success(request, f"Activated card {card.id} for {user.email}")
        except stripe.error.StripeError as e:
            messages.warning(request, f"Stripe error for card {card.id}: {str(e)}")


@admin.register(VirtualCard)
class VirtualCardAdmin(admin.ModelAdmin):
    list_display = ("user", "status", "purchase_amount", "created_at")
    actions = [approve_selected_cards]
