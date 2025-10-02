from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Profile, UserWallet


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a profile when a new user is created."""
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    """Save the profile when the user is saved."""
    if hasattr(instance, 'profile'):
        instance.profile.save()


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_wallet(sender, instance, created, **kwargs):
    """Create a wallet when a new user is created."""
    if created:
        UserWallet.objects.create(user=instance)