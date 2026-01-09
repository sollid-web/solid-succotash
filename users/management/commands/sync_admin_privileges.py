from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from users.models import Profile


class Command(BaseCommand):
    help = "Sync Django admin privileges based on Profile.role (admin/user)."

    def handle(self, *args, **options):
        group, created = Group.objects.get_or_create(name="Platform Admin")
        if created or group.permissions.count() == 0:
            group.permissions.set(Permission.objects.all())

        promoted = 0
        demoted = 0
        for profile in Profile.objects.select_related("user").all():
            user = profile.user
            should_be_admin = profile.role == "admin"

            if should_be_admin:
                if not user.is_staff:
                    user.is_staff = True
                    user.save(update_fields=["is_staff"])
                if not user.is_superuser:
                    user.groups.add(group)
                promoted += 1
            else:
                user.groups.remove(group)
                if user.is_staff and not user.is_superuser:
                    user.is_staff = False
                    user.save(update_fields=["is_staff"])
                demoted += 1

        self.stdout.write(self.style.SUCCESS(f"Synced profiles. Admin-like: {promoted}, user-like: {demoted}"))
