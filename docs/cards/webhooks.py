import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import CardTransaction, VirtualCard


@csrf_exempt
@require_POST
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    # ── Handle Events ─────────────────────────────────────
    if event["type"] == "issuing_authorization.request":
        # Real-time: fires BEFORE payment — approve or decline
        auth = event["data"]["object"]
        try:
            card = VirtualCard.objects.get(stripe_card_id=auth["card"]["id"])
            amount_dollars = auth["amount"] / 100

            if card.status == "active" and card.current_balance >= amount_dollars:
                stripe.issuing.Authorization.approve(auth["id"])
                print(f"✅ Approved ${amount_dollars} at {auth['merchant_data']['name']}")
            else:
                stripe.issuing.Authorization.decline(auth["id"])
                print("❌ Declined — insufficient balance or inactive card")
        except VirtualCard.DoesNotExist:
            stripe.issuing.Authorization.decline(auth["id"])

    elif event["type"] == "issuing_authorization.created":
        # Payment authorized — record transaction, deduct balance
        auth = event["data"]["object"]
        try:
            card = VirtualCard.objects.get(stripe_card_id=auth["card"]["id"])
            # convert cents to Decimal dollars to avoid mixing float/Decimal
            from decimal import Decimal
            amount = Decimal(auth["amount"]) / Decimal(100)

            CardTransaction.objects.get_or_create(
                stripe_auth_id=auth["id"],
                defaults={
                    "card": card,
                    "amount": amount,
                    "currency": auth["currency"],
                    "merchant": auth["merchant_data"].get("name", "Unknown"),
                    "status": "approved",
                },
            )

            # Deduct from balance
            card.current_balance -= amount
            card.save()

        except VirtualCard.DoesNotExist:
            pass

    elif event["type"] == "issuing_transaction.created":
        # Transaction fully settled
        txn = event["data"]["object"]
        print(f"💳 Transaction settled: ${abs(txn['amount']) / 100}")

    return HttpResponse(status=200)
