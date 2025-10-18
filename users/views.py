"""
Views for user notifications
"""

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.views.generic import ListView

from .models import UserNotification


class NotificationListView(LoginRequiredMixin, ListView):
    """Display all notifications for the logged-in user"""

    model = UserNotification
    template_name = "users/notifications.html"
    context_object_name = "notifications"
    paginate_by = 20
    login_url = "/accounts/login/"

    def get_queryset(self):
        """Get notifications for current user"""
        return UserNotification.objects.filter(user=self.request.user).order_by("-created_at")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["unread_count"] = UserNotification.objects.filter(
            user=self.request.user, is_read=False
        ).count()
        return context


@login_required
@require_POST
def mark_notification_read(request, notification_id):
    """Mark a single notification as read"""
    notification = get_object_or_404(UserNotification, id=notification_id, user=request.user)
    notification.mark_as_read()

    return JsonResponse(
        {
            "success": True,
            "notification_id": str(notification.id),
            "is_read": notification.is_read,
        }
    )


@login_required
@require_POST
def mark_all_read(request):
    """Mark all notifications as read for the current user"""
    from .notification_service import mark_all_read as service_mark_all_read

    count = service_mark_all_read(request.user)

    return JsonResponse({"success": True, "count": count})


@login_required
def get_unread_count(request):
    """Get count of unread notifications"""
    count = UserNotification.objects.filter(user=request.user, is_read=False).count()

    return JsonResponse({"count": count})
