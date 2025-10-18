from urllib.parse import urlparse

from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_migrate


def _determine_site_domain() -> str:
    """Select the best-fit domain for the Sites framework.

    Prefer the custom domain when provided; otherwise fall back to Render's
    generated URL, and finally use localhost so tests still run happily.
    """

    custom = getattr(settings, "CUSTOM_DOMAIN", None)
    if custom:
        # Custom domain may be a comma-separated string; use the first entry.
        return custom.split(",")[0].strip()

    render_url = getattr(settings, "RENDER_EXTERNAL_URL", None)
    if render_url:
        parsed = urlparse(render_url)
        return parsed.netloc or parsed.path or "localhost"

    return "localhost"


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        post_migrate.connect(self._ensure_site_record, sender=self)

    def _ensure_site_record(self, **_kwargs):
        # Lazily import to avoid triggering model imports before Django is ready.
        from django.contrib.sites.models import Site

        domain = _determine_site_domain()
        site_defaults = {
            "domain": domain,
            "name": settings.BRAND.get("name", "WolvCapital"),
        }

        target_domain = site_defaults["domain"]

        # Remove conflicting domain rows so the unique constraint stays happy.
        Site.objects.filter(domain=target_domain).exclude(id=settings.SITE_ID).delete()

        site, created = Site.objects.update_or_create(
            id=settings.SITE_ID,
            defaults={"domain": target_domain, "name": site_defaults["name"]},
        )
