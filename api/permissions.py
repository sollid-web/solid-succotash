from rest_framework.permissions import BasePermission


class IsPlatformAdmin(BasePermission):
    """Allows access to platform admins.

    One rule: authenticated Django staff OR superuser.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False

        return bool(getattr(user, "is_staff", False) or getattr(user, "is_superuser", False))
