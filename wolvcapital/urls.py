"""
URL configuration for WolvCapital investment platform.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/", include("api.urls")),
    path("", include("core.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Customize admin site
admin.site.site_header = "WolvCapital Administration"
admin.site.site_title = "WolvCapital Admin"
admin.site.index_title = "Welcome to WolvCapital Administration"

# -------------------------
# Custom error handlers (used when DEBUG=False)
# -------------------------
# Ensure these point to view callables in `core.views` that render branded templates.
handler404 = "core.views.custom_404"
handler500 = "core.views.custom_500"
