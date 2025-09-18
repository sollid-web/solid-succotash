from django.db import transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Transaction, AdminAuditLog
from users.models import UserWallet


@transaction.atomic
def approve_transaction(txn: Transaction, admin_user: User, notes: str = "") -> Transaction:
    """
    Approve a transaction and update user wallet accordingly.
    """
    if txn.status != 'pending':
        raise ValidationError("Can only approve pending transactions")
    
    # Get or create user wallet
    wallet, created = UserWallet.objects.get_or_create(user=txn.user)
    
    if txn.tx_type == 'deposit':
        # Credit the wallet
        wallet.balance += txn.amount
        wallet.save()
    elif txn.tx_type == 'withdrawal':
        # Check if user has sufficient funds
        if wallet.balance < txn.amount:
            raise ValidationError(f"Insufficient funds. User balance: ${wallet.balance}, Withdrawal amount: ${txn.amount}")
        
        # Debit the wallet
        wallet.balance -= txn.amount
        wallet.save()
    
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
    
    return txn


def create_transaction(user: User, tx_type: str, amount: float, reference: str) -> Transaction:
    """
    Create a new transaction.
    """
    if amount <= 0:
        raise ValidationError("Amount must be positive")
    
    return Transaction.objects.create(
        user=user,
        tx_type=tx_type,
        amount=amount,
        reference=reference
    )