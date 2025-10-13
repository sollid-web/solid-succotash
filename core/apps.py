from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_migrate
from urllib.parse import urlparse


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
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        post_migrate.connect(self._ensure_site_record, sender=self)

    def _ensure_site_record(self, **_kwargs):
        # Lazily import to avoid triggering model imports before Django is ready.
        from django.contrib.sites.models import Site

        domain = _determine_site_domain()
        site_defaults = {"domain": domain, "name": settings.BRAND.get("name", "WolvCapital")}

        site, created = Site.objects.get_or_create(id=settings.SITE_ID, defaults=site_defaults)

        if not created:
            updated = False
            if site.domain != site_defaults["domain"]:
                site.domain = site_defaults["domain"]
                updated = True
            if site.name != site_defaults["name"]:
                site.name = site_defaults["name"]
                updated = True

            if updated:
                site.save(update_fields=["domain", "name"])
