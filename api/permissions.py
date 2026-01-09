from rest_framework.permissions import BasePermission


class IsPlatformAdmin(BasePermission):
    """Allows access to platform admins.

    Treats either Django staff/superuser or a profile.role == "admin" user
    as an admin for API purposes.
    """

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not getattr(user, "is_authenticated", False):
            return False

        if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
            return True

        profile = getattr(user, "profile", None)
        return bool(profile and getattr(profile, "role", None) == "admin")
