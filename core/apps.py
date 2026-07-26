from urllib.parse import urlparse

from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_migrate


def _determine_site_domain() -> str:
    """Select the best-fit domain for the Sites framework.
    """

    url_value = getattr(settings, "PUBLIC_SITE_URL", None) or getattr(
        settings, "SITE_URL", None
    )
    if url_value:
        parsed = urlparse(str(url_value))
        host = parsed.hostname or parsed.netloc or parsed.path
        if host:
            return host

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
