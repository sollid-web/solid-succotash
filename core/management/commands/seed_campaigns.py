from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import CampaignAnnouncement


class Command(BaseCommand):
    help = "Seed campaign announcements for the public campaigns page."

    def handle(self, *args, **options):
        now = timezone.now()

        campaigns = [
            {
                "slug": "bnb-staking-boost",
                "title": "BNB Staking Boost",
                "summary": "A featured staking campaign for users interested in BNB yield opportunities.",
                "body": (
                    "New staking spotlight for BNB-focused users. "
                    "This campaign can be used to highlight staking education, rewards windows, "
                    "or limited-time onboarding offers."
                ),
                "cta_label": "View staking",
                "cta_url": "/dashboard/stake",
                "publish_at": now,
                "expires_at": None,
                "is_published": True,
            },
            {
                "slug": "bsc-token-updates",
                "title": "BSC Token Updates",
                "summary": "A public campaign slot for verified BSC token news and platform updates.",
                "body": (
                    "Use this slot for verified BSC token announcements, roadmap updates, "
                    "or community-driven product notices. Keep the messaging aligned with the "
                    "verified native token and the platform's staking activity."
                ),
                "cta_label": "Open token page",
                "cta_url": "/dashboard/wolv-token",
                "publish_at": now,
                "expires_at": None,
                "is_published": True,
            },
        ]

        created = []
        updated = []
        for item in campaigns:
            obj, was_created = CampaignAnnouncement.objects.update_or_create(
                slug=item["slug"],
                defaults=item,
            )
            if was_created:
                created.append(obj.slug)
            else:
                updated.append(obj.slug)

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created campaigns: {', '.join(created)}"))
        if updated:
            self.stdout.write(self.style.WARNING(f"Updated campaigns: {', '.join(updated)}"))
        if not created and not updated:
            self.stdout.write("No campaigns changed.")