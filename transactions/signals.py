from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Transaction, VirtualCard
from core.email_service import EmailService


@receiver(pre_save, sender=Transaction)
def transaction_pre_save(sender, instance, **kwargs):
    """Store the old status before saving."""
    if instance.pk:
        try:
            old_instance = Transaction.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Transaction.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=Transaction)
def transaction_post_save(sender, instance, created, **kwargs):
    """Send email notifications when transaction status changes from pending."""
    if instance._old_status == 'pending' and instance.status in ['approved', 'rejected']:
        try:
            if instance.status == 'approved':
                EmailService.send_transaction_notification(instance, 'approved')
            elif instance.status == 'rejected':
                EmailService.send_transaction_notification(instance, 'rejected')
        except Exception as e:
            # Log the error but don't crash the app
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send transaction notification for {instance.id}: {str(e)}")


@receiver(pre_save, sender=VirtualCard)
def virtual_card_pre_save(sender, instance, **kwargs):
    """Store the old status before saving."""
    if instance.pk:
        try:
            old_instance = VirtualCard.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except VirtualCard.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=VirtualCard)
def virtual_card_post_save(sender, instance, created, **kwargs):
    """Send email notifications when virtual card status changes from pending."""
    if instance._old_status == 'pending' and instance.status in ['approved', 'rejected']:
        try:
            if instance.status == 'approved':
                EmailService.send_card_approved_notification(instance.user, instance)
            elif instance.status == 'rejected':
                EmailService.send_card_rejected_notification(instance.user, instance)
        except Exception as e:
            # Log the error but don't crash the app
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send card notification for {instance.id}: {str(e)}")