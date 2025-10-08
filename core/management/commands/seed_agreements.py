from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import Agreement

TERMS_BODY = """Terms of Service (Draft)\nEffective Date: October 2025\n\nWelcome to WolvCapital. By accessing or using our services, you agree to the following terms:\n\n1. Eligibility\nUsers must be at least 18 years old and legally permitted to invest in cryptocurrencies in their jurisdiction.\n\nBy creating an account, you confirm that you meet these requirements.\n\n2. Account Responsibilities\nYou are responsible for maintaining the confidentiality of your login credentials.\n\nAny activity conducted under your account will be deemed your responsibility.\n\n3. Services\nWolvCapital provides digital investment opportunities, virtual Visa cards, and multi-currency deposit options.\n\nServices may be modified, suspended, or discontinued at our discretion.\n\n4. Investment Risks\nAll investments carry risk. Returns are not guaranteed and may fluctuate due to market conditions.\n\nUsers should review our Risk Disclosure before investing.\n\n5. Fees\nTransaction and service fees may apply. These will be disclosed prior to execution.\n\n6. Compliance\nUsers agree not to use WolvCapital for unlawful purposes, including money laundering, fraud, or terrorist financing.\n\nWe reserve the right to suspend or terminate accounts that violate compliance standards.\n\n7. Limitation of Liability\nWolvCapital is not liable for losses arising from market volatility, third-party service providers, or user negligence.\n\n8. Governing Law\nThese terms are governed by the laws of the United Kingdom. Disputes will be resolved in UK courts unless otherwise required by law."""

PRIVACY_BODY = """Privacy Policy (Draft)\nEffective Date: October 2025\n\nAt WolvCapital, we respect your privacy and are committed to protecting your personal data.\n\n1. Information We Collect\nPersonal Data: Name, email, phone number, and identity verification documents.\n\nFinancial Data: Deposit and withdrawal details, transaction history.\n\nTechnical Data: IP address, device information, cookies.\n\n2. How We Use Your Data\nTo provide and improve our services.\n\nTo comply with legal and regulatory obligations (AML/KYC).\n\nTo enhance security and prevent fraud.\n\nTo communicate with you about your account and services.\n\n3. Data Sharing\nWe do not sell your data.\n\nData may be shared with trusted third-party providers (e.g., payment processors, compliance partners).\n\nData may be disclosed to regulators or law enforcement when legally required.\n\n4. Data Security\nWe use encryption, secure authentication, and manual transaction reviews to safeguard your data.\n\n5. Data Retention\nWe retain personal data only as long as necessary for legal, regulatory, and operational purposes.\n\n6. Your Rights\nYou may request access, correction, or deletion of your personal data.\n\nYou may opt out of non-essential communications at any time.\n\n7. Contact\nFor privacy-related inquiries, contact: support@wolv-invest.io"""

class Command(BaseCommand):
    help = "Seed default Terms of Service and Privacy Policy agreements if they do not exist."

    def handle(self, *args, **options):
        created = []
        now = timezone.now().date()
        tos, tos_created = Agreement.objects.get_or_create(
            slug="terms-of-service",
            version="1.0.0",
            defaults={
                "title": "Terms of Service (Draft)",
                "body": TERMS_BODY,
                "effective_date": now,
                "is_active": True,
            },
        )
        if tos_created:
            created.append(tos.slug)

        privacy, privacy_created = Agreement.objects.get_or_create(
            slug="privacy-policy",
            version="1.0.0",
            defaults={
                "title": "Privacy Policy (Draft)",
                "body": PRIVACY_BODY,
                "effective_date": now,
                "is_active": True,
            },
        )
        if privacy_created:
            created.append(privacy.slug)

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created agreements: {', '.join(created)}"))
        else:
            self.stdout.write("No new agreements created (already present).")
