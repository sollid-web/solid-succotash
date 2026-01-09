"""
URL configuration for WolvCapital investment platform.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def healthcheck(request):
    return HttpResponse("OK", status=200)


urlpatterns = [
    path("", healthcheck),  # 👈 CRITICAL: root must return 200
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/", include("api.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/referrals/", include("referrals.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Customize admin site
admin.site.site_header = "WolvCapital Administration"
admin.site.site_title = "WolvCapital Admin"
admin.site.index_title = "Welcome to WolvCapital Administration"
