with open("transactions/services.py", "r") as f:
    content = f.read()

old = '''    # enforce exact amount
    expected = Decimal("1000.00")
    if amount_decimal != expected:
        raise ValidationError(f"Virtual card purchase amount must be ${expected}")
    if amount_decimal <= 0:
        raise ValidationError("Purchase amount must be positive")
    card = VirtualCard.objects.create('''

new = '''    # enforce exact amount
    expected = Decimal("1000.00")
    if amount_decimal != expected:
        raise ValidationError(f"Virtual card purchase amount must be ${expected}")
    if amount_decimal <= 0:
        raise ValidationError("Purchase amount must be positive")

    # enforce wallet balance — user must have at least $1000 before requesting
    wallet, _ = UserWallet.objects.get_or_create(user=user)
    if wallet.balance < expected:
        raise ValidationError(
            f"Insufficient balance. You need ${expected} in your wallet to request a virtual card. "
            f"Your current balance is ${wallet.balance}."
        )

    # enforce no existing pending or active card
    existing = VirtualCard.objects.filter(user=user, status__in=["pending", "active", "approved"]).first()
    if existing:
        raise ValidationError(
            f"You already have a virtual card ({existing.get_status_display()}). "
            "Only one card per account is allowed."
        )

    card = VirtualCard.objects.create('''

with open("transactions/services.py", "w") as f:
    f.write(content.replace(old, new))

print("Done")
