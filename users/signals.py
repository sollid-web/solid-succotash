from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile, UserWallet


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a profile when a new user is created."""
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved."""
    if hasattr(instance, "profile"):
        instance.profile.save()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_wallet(sender, instance, created, **kwargs):
    """Create a wallet when a new user is created."""
    if created:
        UserWallet.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_welcome_notification(sender, instance, created, **kwargs):
    """Send welcome notice only after account is verified and active."""
    if not created:
        return
    # Avoid sending welcome until email is verified and account is active
    profile = getattr(instance, "profile", None)
    is_verified = bool(getattr(profile, "email_verified", False))
    if not (instance.is_active and is_verified):
        return
    from .notification_service import notify_welcome
    notify_welcome(instance)
    # Send welcome email
    from core.email_service import EmailService
    EmailService.send_welcome_email(instance)
