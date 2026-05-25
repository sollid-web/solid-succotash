with open("transactions/services.py", "r") as f:
    content = f.read()

# Fix 1: wallet credit — include manual_credit
content = content.replace(
    'if txn.tx_type == "deposit":',
    'if txn.tx_type in ("deposit", "manual_credit"):',
    1
)

# Fix 2: notification after approval — second occurrence
old = 'if txn.tx_type == "deposit":\n            notify_deposit_approved(txn.user, txn, notes)'
new = 'if txn.tx_type in ("deposit", "manual_credit"):\n            notify_deposit_approved(txn.user, txn, notes)'
content = content.replace(old, new)

# Fix 3: add manual_credit branch before the else raise
old3 = '        else:\n            raise ValidationError("Invalid transaction type")'
new3 = '        elif tx_type == "manual_credit":\n            notification_type = "new_deposit"\n            title = f"Manual Credit Applied: ${amount_display}"\n            priority = "medium"\n        else:\n            raise ValidationError("Invalid transaction type")'
content = content.replace(old3, new3)

with open("transactions/services.py", "w") as f:
    f.write(content)

print("Done")
