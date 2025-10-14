from decimal import Decimal

from django.db import transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Transaction, AdminAuditLog
from .notifications import create_admin_notification
from users.models import UserWallet


@transaction.atomic
def approve_transaction(txn: Transaction, admin_user: User, notes: str = "") -> Transaction:
    """
    Approve a transaction and update user wallet accordingly.
    """
    if txn.status != 'pending':
        raise ValidationError("Can only approve pending transactions")
    
    # Get or create user wallet
    try:
        wallet = UserWallet.objects.select_for_update().get(user=txn.user)
    except UserWallet.DoesNotExist:
        wallet = UserWallet.objects.create(user=txn.user)
    
    if txn.tx_type == 'deposit':
        # Credit the wallet
        wallet.balance += txn.amount
        wallet.save(update_fields=['balance', 'updated_at'])
    elif txn.tx_type == 'withdrawal':
        # Check if user has sufficient funds
        if wallet.balance < txn.amount:
            raise ValidationError(f"Insufficient funds. User balance: ${wallet.balance}, Withdrawal amount: ${txn.amount}")
        
        # Debit the wallet
        wallet.balance -= txn.amount
        wallet.save(update_fields=['balance', 'updated_at'])
    
    # Update transaction
    txn.status = 'approved'
    txn.approved_by = admin_user
    txn.notes = notes
    txn.save()
    
    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity='transaction',
        entity_id=str(txn.id),
        action='approve',
        notes=notes
    )
    
    # Mark related admin notifications as resolved
    from .models import AdminNotification
    AdminNotification.objects.filter(
        entity_type='transaction',
        entity_id=str(txn.id),
        is_resolved=False
    ).update(
        is_resolved=True,
        resolved_by=admin_user,
        resolved_at=timezone.now()
    )
    
    # Send user notification
    from users.notification_service import notify_deposit_approved, notify_withdrawal_approved
    if txn.tx_type == 'deposit':
        notify_deposit_approved(txn.user, txn, notes)
    elif txn.tx_type == 'withdrawal':
        notify_withdrawal_approved(txn.user, txn, notes)
    
    return txn


@transaction.atomic
def reject_transaction(txn: Transaction, admin_user: User, notes: str = "") -> Transaction:
    """
    Reject a transaction.
    """
    if txn.status != 'pending':
        raise ValidationError("Can only reject pending transactions")
    
    # Update transaction
    txn.status = 'rejected'
    txn.approved_by = admin_user
    txn.notes = notes
    txn.save()
    
    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity='transaction',
        entity_id=str(txn.id),
        action='reject',
        notes=notes
    )
    
    # Mark related admin notifications as resolved
    from .models import AdminNotification
    AdminNotification.objects.filter(
        entity_type='transaction',
        entity_id=str(txn.id),
        is_resolved=False
    ).update(
        is_resolved=True,
        resolved_by=admin_user,
        resolved_at=timezone.now()
    )
    
    # Send user notification
    from users.notification_service import notify_deposit_rejected, notify_withdrawal_rejected
    if txn.tx_type == 'deposit':
        notify_deposit_rejected(txn.user, txn, notes)
    elif txn.tx_type == 'withdrawal':
        notify_withdrawal_rejected(txn.user, txn, notes)
    
    return txn


def create_transaction(user: User, tx_type: str, amount: float, reference: str, 
                     payment_method: str = 'bank_transfer', tx_hash: str = '', 
                     wallet_address_used: str = '') -> Transaction:
    """
    Create a new transaction and notify admins.
    """
    amount_decimal = amount if isinstance(amount, Decimal) else Decimal(str(amount))

    if amount_decimal <= 0:
        raise ValidationError("Amount must be positive")

    wallet, _ = UserWallet.objects.get_or_create(user=user)

    if tx_type == 'withdrawal' and wallet.balance < amount_decimal:
        raise ValidationError(
            f"Insufficient balance. Wallet balance is ${wallet.balance}; withdrawal request was ${amount_decimal}"
        )
    
    txn = Transaction.objects.create(
        user=user,
        tx_type=tx_type,
        payment_method=payment_method,
        amount=amount_decimal,
        reference=reference,
        tx_hash=tx_hash,
        wallet_address_used=wallet_address_used
    )
    
    # Create admin notification
    amount_display = amount_decimal.quantize(Decimal('0.01'))

    if tx_type == 'deposit':
        notification_type = 'new_deposit'
        title = f"New Deposit Request: ${amount_display}"
        priority = 'high' if amount_decimal >= Decimal('10000') else 'medium'
    elif tx_type == 'withdrawal':
        notification_type = 'new_withdrawal'
        title = f"New Withdrawal Request: ${amount_display}"
        priority = 'high' if amount_decimal >= Decimal('5000') else 'medium'
    else:
        raise ValidationError("Invalid transaction type")
    
    payment_info = f" via {payment_method}"
    if payment_method in ['BTC', 'USDT', 'USDC', 'ETH']:
        payment_info += f" (Hash: {tx_hash[:10]}...)" if tx_hash else ""
    
    message = f"User {user.email} has submitted a {tx_type} request for ${amount_display}{payment_info}. Reference: {reference}"
    
    create_admin_notification(
        notification_type=notification_type,
        title=title,
        message=message,
        user=user,
        entity_type='transaction',
    entity_id=str(txn.id),
        priority=priority
    )
    
    return txn