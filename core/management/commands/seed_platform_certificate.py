from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import PlatformCertificate


class Command(BaseCommand):
    help = "Create or update a default Platform Certificate for non-production environments. Idempotent."

    def add_arguments(self, parser):
        parser.add_argument("--certificate-id", dest="certificate_id", default="WC-OP-2025-0001")
        parser.add_argument("--title", dest="title", default="Certificate of Operation")
        parser.add_argument("--jurisdiction", dest="jurisdiction", default="United States")
        parser.add_argument("--issuing-authority", dest="issuing_authority", default="Issuing Authority (Placeholder)")
        parser.add_argument("--verification-url", dest="verification_url", default="https://wolvcapital.com/legal/certificate-of-operation")
        parser.add_argument("--issue-date", dest="issue_date", default=None, help="YYYY-MM-DD; defaults to today")
        parser.add_argument("--authority-seal-url", dest="authority_seal_url", default="")
        parser.add_argument("--signature-1-url", dest="signature_1_url", default="")
        parser.add_argument("--signature-2-url", dest="signature_2_url", default="")
        parser.add_argument("--inactive", action="store_true", dest="inactive", help="Create as inactive.")

    def handle(self, *args, **options):
        certificate_id = options["certificate_id"].strip()
        title = options["title"].strip()
        jurisdiction = options["jurisdiction"].strip()
        issuing_authority = options["issuing_authority"].strip()
        verification_url = options["verification_url"].strip()
        authority_seal_url = options["authority_seal_url"].strip()
        signature_1_url = options["signature_1_url"].strip()
        signature_2_url = options["signature_2_url"].strip()
        is_active = not options.get("inactive", False)

        issue_date_opt = options.get("issue_date")
        if issue_date_opt:
            try:
                issue_date = timezone.datetime.fromisoformat(issue_date_opt).date()
            except Exception:  # noqa: BLE001
                self.stderr.write(self.style.WARNING(f"Invalid --issue-date '{issue_date_opt}', using today."))
                issue_date = timezone.now().date()
        else:
            issue_date = timezone.now().date()

        obj, created = PlatformCertificate.objects.update_or_create(
            certificate_id=certificate_id,
            defaults={
                "title": title,
                "jurisdiction": jurisdiction,
                "issuing_authority": issuing_authority,
                "verification_url": verification_url,
                "authority_seal_url": authority_seal_url,
                "signature_1_url": signature_1_url,
                "signature_2_url": signature_2_url,
                "issue_date": issue_date,
                "is_active": is_active,
            },
        )

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} PlatformCertificate {obj.certificate_id} (active={obj.is_active})"))
