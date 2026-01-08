from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from users.models import User, UserWallet

from .models import AdminAuditLog, Transaction, VirtualCard
from .notifications import create_admin_notification


@transaction.atomic
def approve_transaction(txn: Transaction, admin_user: User, notes: str = "") -> Transaction:
    """
    Approve a transaction and update user wallet accordingly.
    """
    if txn.status != "pending":
        raise ValidationError("Can only approve pending transactions")

    # Get or create user wallet
    try:
        wallet = UserWallet.objects.select_for_update().get(user=txn.user)
    except UserWallet.DoesNotExist:
        wallet = UserWallet.objects.create(user=txn.user)

    if txn.tx_type == "deposit":
        # Credit the wallet
        wallet.balance += txn.amount
        wallet.save(update_fields=["balance", "updated_at"])
    elif txn.tx_type == "withdrawal":
        # Check if user has sufficient funds
        if wallet.balance < txn.amount:
            raise ValidationError(
                f"Insufficient funds. User balance: ${wallet.balance}, Withdrawal amount: ${txn.amount}"
            )

        # Debit the wallet
        wallet.balance -= txn.amount
        wallet.save(update_fields=["balance", "updated_at"])

    # Update transaction
    txn.status = "approved"
    txn.approved_by = admin_user
    txn.notes = notes
    txn.save()

    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="transaction",
        entity_id=str(txn.id),
        action="approve",
        notes=notes,
    )

    # Mark related admin notifications as resolved
    from .models import AdminNotification

    AdminNotification.objects.filter(
        entity_type="transaction", entity_id=str(txn.id), is_resolved=False
    ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())

    # Send user notification (in-app)
    from users.notification_service import (
        notify_deposit_approved,
        notify_withdrawal_approved,
    )

    if txn.tx_type == "deposit":
        notify_deposit_approved(txn.user, txn, notes)
    elif txn.tx_type == "withdrawal":
        notify_withdrawal_approved(txn.user, txn, notes)

    # Send email notification
    from core.email_service import EmailService

    EmailService.send_transaction_notification(txn, 'approved', notes)

    # Process referral rewards for deposits (if applicable)
    if txn.tx_type == "deposit":
        try:
            from referrals.tasks import process_deposit_referral
            process_deposit_referral(
                referred_user_id=txn.user.id,
                deposit_amount=txn.amount,
                currency='USD'
            )
        except Exception:
            # Fail silently - referral processing shouldn't break
            # transaction approval
            pass

    return txn


@transaction.atomic
def reject_transaction(txn: Transaction, admin_user: User, notes: str = "") -> Transaction:
    """
    Reject a transaction.
    """
    if txn.status != "pending":
        raise ValidationError("Can only reject pending transactions")

    # Update transaction
    txn.status = "rejected"
    txn.approved_by = admin_user
    txn.notes = notes
    txn.save()

    # Create audit log
    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="transaction",
        entity_id=str(txn.id),
        action="reject",
        notes=notes,
    )

    # Mark related admin notifications as resolved
    from .models import AdminNotification

    AdminNotification.objects.filter(
        entity_type="transaction", entity_id=str(txn.id), is_resolved=False
    ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())

    # Send user notification (in-app)
    from users.notification_service import (
        notify_deposit_rejected,
        notify_withdrawal_rejected,
    )

    if txn.tx_type == "deposit":
        notify_deposit_rejected(txn.user, txn, notes)
    elif txn.tx_type == "withdrawal":
        notify_withdrawal_rejected(txn.user, txn, notes)

    # Send email notification
    from core.email_service import EmailService

    EmailService.send_transaction_notification(txn, 'rejected', notes)

    return txn


def create_transaction(
    user: User,
    tx_type: str,
    amount: float,
    reference: str,
    payment_method: str = "bank_transfer",
    tx_hash: str = "",
    wallet_address_used: str = "",
    notify_admin: bool = True,
    notify_user: bool = True,
) -> Transaction:
    """
    Create a new transaction and notify admins.
    """
    amount_decimal = amount if isinstance(amount, Decimal) else Decimal(str(amount))

    if amount_decimal <= 0:
        raise ValidationError("Amount must be positive")

    wallet, _ = UserWallet.objects.get_or_create(user=user)

    if tx_type == "withdrawal" and wallet.balance < amount_decimal:
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
        wallet_address_used=wallet_address_used,
    )

    if notify_admin:
        # Create admin notification
        amount_display = amount_decimal.quantize(Decimal("0.01"))

        from django.conf import settings

        thresholds = getattr(settings, "ALERT_THRESHOLDS", {})
        dep_thresh = Decimal(str(thresholds.get("high_deposit", 10000)))
        wd_thresh = Decimal(str(thresholds.get("high_withdrawal", 5000)))
        if tx_type == "deposit":
            notification_type = "new_deposit"
            title = f"New Deposit Request: ${amount_display}"
            priority = "high" if amount_decimal >= dep_thresh else "medium"
        elif tx_type == "withdrawal":
            notification_type = "new_withdrawal"
            title = f"New Withdrawal Request: ${amount_display}"
            priority = "high" if amount_decimal >= wd_thresh else "medium"
        else:
            raise ValidationError("Invalid transaction type")

        payment_info = f" via {payment_method}"
        if payment_method in {"BTC", "USDT", "USDC", "ETH"}:
            payment_info += f" (Hash: {tx_hash[:10]}...)" if tx_hash else ""

        message = (
            f"User {user.email} has submitted a {tx_type} request for ${amount_display}"
            f"{payment_info}. Reference: {reference}"
        )

        create_admin_notification(
            notification_type=notification_type,
            title=title,
            message=message,
            user=user,
            entity_type="transaction",
            entity_id=str(txn.id),
            priority=priority,
        )

        # Send admin email alert for high/urgent priority events
        if priority in {"high", "urgent"}:
            from core.email_service import EmailService

            try:
                EmailService.send_admin_alert(
                    subject=title,
                    message=message,
                )
            except Exception:
                # Do not break flow if admin email fails
                pass

    if notify_user:
        # Send email notification for transaction creation
        from core.email_service import EmailService

        EmailService.send_transaction_notification(txn, "created")

    return txn


@transaction.atomic
def create_virtual_card_request(
    user: User,
    amount: float,
    notes: str = "",
) -> VirtualCard:
    """
    Create a pending virtual card request for the user.
    Does not generate card details; requires manual admin approval.
    Also creates an admin notification for review.
    """
    amount_decimal = amount if isinstance(amount, Decimal) else Decimal(str(amount))

    if amount_decimal <= 0:
        raise ValidationError("Purchase amount must be positive")

    card = VirtualCard.objects.create(
        user=user,
        purchase_amount=amount_decimal,
        status="pending",
        notes=notes or "Virtual card activation request",
    )

    # Create admin notification
    # Determine priority based on amount
    from django.conf import settings

    from .notifications import create_admin_notification
    thresholds = getattr(settings, "ALERT_THRESHOLDS", {})
    card_thresh = Decimal(str(thresholds.get("high_card_purchase", 5000)))
    priority_level = "high" if amount_decimal >= card_thresh else "medium"

    create_admin_notification(
        notification_type="new_card_request",
        title=(
            f"New Virtual Card Request: ${amount_decimal.quantize(Decimal('0.01'))}"
        ),
        message=(
            f"User {user.email} requested a virtual card. Amount: "
            f"${amount_decimal.quantize(Decimal('0.01'))}. Notes: {notes}"
        ),
        user=user,
        entity_type="card",
        entity_id=str(card.id),
        priority=priority_level,
    )

    # Send admin email alert for high/urgent priority card requests
    if priority_level in {"high", "urgent"}:
        from core.email_service import EmailService
        try:
            EmailService.send_admin_alert(
                subject=f"Virtual Card Request: ${amount_decimal.quantize(Decimal('0.01'))}",
                message=(
                    f"User {user.email} requested a virtual card for "
                    f"${amount_decimal.quantize(Decimal('0.01'))}. Notes: {notes}"
                ),
            )
        except Exception:
            # Do not break flow if admin email fails
            pass

    # Optional: send email to user confirming receipt
    from core.email_service import EmailService

    try:
        EmailService.send_generic_email(
            to=user.email,
            subject="Virtual Card Request Received",
            template_slug="virtual_card_request_received",
            context={
                "user_email": user.email,
                "amount": f"${amount_decimal.quantize(Decimal('0.01'))}",
                "card_id": str(card.id),
            },
        )
    except Exception:
        # Log a warning if template is not configured
        import logging
        logging.getLogger(__name__).warning(
            "Virtual card request email template missing or failed to send"
        )

    # Create audit log
    AdminAuditLog.objects.create(
        admin=user,  # actor is the requesting user; admin will appear on approval
        entity="user",
        entity_id=str(user.id),
        action="create",
        notes=f"Virtual card request {card.id} created by user",
    )

    return card
