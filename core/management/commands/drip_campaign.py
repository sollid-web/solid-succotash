"""
WolvCapital 10-Email Drip Campaign System.

USAGE:
    python manage.py drip_campaign --enroll user@email.com
    python manage.py drip_campaign --send [--dry-run]
    python manage.py drip_campaign --status user@email.com

RAILWAY CRON: python manage.py drip_campaign --send
Schedule: 0 9 * * * (daily 9am)
"""

import os
from datetime import datetime

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings

from core.models import DripCampaign
from core.email_service import EmailService

User = get_user_model()


# ─────────────────────────────────────────────
# EMAIL SEQUENCE DATA
# ─────────────────────────────────────────────

EMAILS = [
    {
        "day": 1,
        "subject": "🎉 Welcome — Start staking with WolvCapital",
        "headline": "Welcome to WolvCapital",
        "subheadline": "Create an account, complete KYC, and start staking BNB or BUSD to earn WOLV rewards.",
        "template": "drip_campaign_day_1.html",
    },
    {
        "day": 2,
        "subject": "📊 How WolvCapital Works — Staking, Rewards, Verification",
        "headline": "How WolvCapital Works",
        "subheadline": "KYC, audited smart contracts, Chainlink price feeds — we make staking verifiable and transparent.",
        "template": "drip_campaign_day_2.html",
    },
    {
        "day": 3,
        "subject": "🔍 Choose a Staking Plan — Pioneer, Vanguard, Horizon, Summit VIP",
        "headline": "Which staking plan fits you?",
        "subheadline": "Compare Pioneer, Vanguard, Horizon and Summit VIP — different lock periods, APYs and minimums.",
        "template": "drip_campaign_day_3.html",
    },
    {
        "day": 4,
        "subject": "🚀 WOLV Token — Proof of your returns on BNB Chain",
        "headline": "WOLV — the proof of your returns",
        "subheadline": "Every reward is recorded on-chain. WOLV tokens represent staking rewards you can verify on BscScan.",
        "template": "drip_campaign_day_4.html",
    },
    {
        "day": 5,
        "subject": "🛡️ Security & Audits — Institutional custody and verified contracts",
        "headline": "Security & transparency",
        "subheadline": "Audited smart contracts, Chainlink oracles and 24/7 monitoring protect your stake.",
        "template": "drip_campaign_day_5.html",
    },
    {
        "day": 6,
        "subject": "⭐ Real customers — performance snapshots & reviews",
        "headline": "Real customers. Transparent results.",
        "subheadline": "See case studies, Trustpilot reviews and performance snapshots in your dashboard.",
        "template": "drip_campaign_day_6.html",
    },
    {
        "day": 7,
        "subject": "💳 Access your funds — Virtual Card & payouts",
        "headline": "Spend your rewards or withdraw them",
        "subheadline": "Use the WolvCapital virtual card or claim/withdraw WOLV rewards to your wallet when eligible.",
        "template": "drip_campaign_day_7.html",
    },
    {
        "day": 8,
        "subject": "❓ Frequently asked questions — KYC, staking, taxes, risks",
        "headline": "Questions? We have answers.",
        "subheadline": "Everything you need to know about staking, fees, eligibility and tax reporting.",
        "template": "drip_campaign_day_8.html",
    },
    {
        "day": 9,
        "subject": "⏰ Early access & limited reward pool",
        "headline": "Opportunity — limited reward pool",
        "subheadline": "The reward pool is finite. Early stakers get priority access to higher APYs.",
        "template": "drip_campaign_day_9.html",
    },
    {
        "day": 10,
        "subject": "🚀 Ready to stake? Open your account and start earning WOLV",
        "headline": "Ready to stake?",
        "subheadline": "Open your account, complete KYC and start earning WOLV rewards on BNB Chain.",
        "template": "drip_campaign_day_10.html",
    },
]


# ─────────────────────────────────────────────
# MANAGEMENT COMMAND
# ─────────────────────────────────────────────


class Command(BaseCommand):
    help = "WolvCapital 10-email drip campaign manager"

    def add_arguments(self, parser):
        parser.add_argument(
            "--enroll",
            type=str,
            help="Enroll a user email into the campaign",
        )
        parser.add_argument(
            "--send",
            action="store_true",
            help="Send today's emails to all enrolled users",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview without sending",
        )
        parser.add_argument(
            "--status",
            type=str,
            help="Check campaign status for a user email",
        )
        parser.add_argument(
            "--send-single",
            type=str,
            help="Send current drip email to a single user email (targeted)",
        )

    def handle(self, *args, **options):
        """Route to appropriate subcommand."""
        if options.get("enroll"):
            self.enroll_user(options["enroll"])

        elif options.get("send"):
            self.send_todays_emails(dry_run=options.get("dry_run", False))

        elif options.get("send_single"):
            self.send_single_user(options.get("send_single"), dry_run=options.get("dry_run", False))

        elif options.get("status"):
            self.check_status(options["status"])

        else:
            self.stdout.write("Usage: --enroll email | --send [--dry-run] | --status email")

    def enroll_user(self, email: str):
        """Enroll a user in the drip campaign."""
        user = User.objects.filter(email=email).first()
        if not user:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return

        campaign, created = DripCampaign.objects.get_or_create(user=user)
        if created:
            self.stdout.write(self.style.SUCCESS(f"✅ Enrolled {email} in drip campaign"))
        else:
            self.stdout.write(
                self.style.WARNING(f"⚠️  {email} already enrolled (day {campaign.current_day})")
            )

    def send_todays_emails(self, dry_run: bool = False):
        """Send today's email to all active enrolled users."""
        campaigns = (
            DripCampaign.objects.filter(
                completed=False,
                active=True,
            )
            .select_related("user")
            .order_by("enrolled_at")
        )

        self.stdout.write(self.style.SUCCESS(f"📧 Found {campaigns.count()} active campaign(s)"))

        sent = 0
        failed = 0
        skipped = 0

        for campaign in campaigns:
            user = campaign.user
            day = campaign.current_day

            # Check if campaign is complete
            if day > 10:
                campaign.completed = True
                campaign.save()
                skipped += 1
                continue

            # Find email for today
            email_data = next((e for e in EMAILS if e["day"] == day), None)
            if not email_data:
                skipped += 1
                continue

            first_name = user.first_name or "Valued Investor"

            if dry_run:
                self.stdout.write(f"  [DRY RUN] Day {day} → {user.email}: {email_data['subject']}")
                sent += 1
                continue

            try:
                # Use EmailService to send templated email
                context = {
                    "first_name": first_name,
                    "headline": email_data.get("headline"),
                    "subheadline": email_data.get("subheadline"),
                    "dashboard_url": "https://wolvcapital.com/dashboard",
                    "plans_url": "https://wolvcapital.com/plans",
                    "wolv_token_url": "https://wolvcapital.com/wolv-token",
                    "card_url": "https://wolvcapital.com/dashboard/card",
                    "contact_url": "https://wolvcapital.com/contact",
                    "new_investment_url": "https://wolvcapital.com/dashboard/new-investment",
                    "compliance_url": "https://wolvcapital.com/compliance",
                    "bscscan_url": "https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c",
                }

                EmailService._send(
                    template_name=email_data["template"].replace(".html", ""),
                    to_emails=user.email,
                    context=context,
                    subject=email_data["subject"],
                )
                # Advance to next day
                campaign.current_day += 1
                campaign.last_sent = timezone.now()
                if campaign.current_day > 10:
                    campaign.completed = True
                campaign.save()

                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  ✅ Day {day} sent to {user.email}"))

            except Exception as e:
                failed += 1
                self.stderr.write(self.style.ERROR(f"  ❌ Failed for {user.email}: {str(e)}"))

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(f"Done — Sent: {sent} | Failed: {failed} | Skipped: {skipped}")
        )

    def check_status(self, email: str):
        """Display campaign status for a user."""
        user = User.objects.filter(email=email).first()
        if not user:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return

        try:
            campaign = DripCampaign.objects.get(user=user)
            self.stdout.write(f"Campaign status for {email}:")
            self.stdout.write(f"  Current day: {campaign.current_day}/10")
            self.stdout.write(f"  Last sent: {campaign.last_sent or 'Never'}")
            self.stdout.write(f"  Active: {'Yes' if campaign.active else 'No'}")
            self.stdout.write(f"  Completed: {'Yes' if campaign.completed else 'No'}")
            self.stdout.write(f"  Enrolled: {campaign.enrolled_at.strftime('%Y-%m-%d %H:%M:%S')}")
        except DripCampaign.DoesNotExist:
            self.stdout.write(self.style.WARNING("  Not enrolled in campaign"))

    def send_single_user(self, email: str, dry_run: bool = False):
        """Send the current drip email to a single user identified by email."""
        user = User.objects.filter(email=email).first()
        if not user:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return

        try:
            campaign = DripCampaign.objects.get(user=user)
        except DripCampaign.DoesNotExist:
            self.stderr.write(self.style.ERROR(f"No drip campaign for {email}"))
            return

        if campaign.completed or not campaign.active:
            self.stdout.write(
                self.style.WARNING(f"Campaign not active or already completed for {email}")
            )
            return

        day = campaign.current_day
        if day > 10:
            campaign.completed = True
            campaign.save()
            self.stdout.write(self.style.WARNING(f"Campaign already complete for {email}"))
            return

        email_data = next((e for e in EMAILS if e["day"] == day), None)
        if not email_data:
            self.stderr.write(self.style.ERROR(f"No email configured for day {day}"))
            return

        first_name = getattr(user, "first_name", None) or "Valued Investor"

        if dry_run:
            self.stdout.write(f"  [DRY RUN] Day {day} → {user.email}: {email_data['subject']}")
            return

        try:
            context = {
                "first_name": first_name,
                "headline": email_data.get("headline"),
                "subheadline": email_data.get("subheadline"),
                "dashboard_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/dashboard",
                "plans_url": getattr(settings, "SITE_URL", "https://wolvcapital.com") + "/plans",
                "wolv_token_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/wolv-token",
                "card_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/dashboard/card",
                "contact_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/contact",
                "new_investment_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/dashboard/new-investment",
                "compliance_url": getattr(settings, "SITE_URL", "https://wolvcapital.com")
                + "/compliance",
                "bscscan_url": "https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c",
            }

            EmailService._send(
                template_name=email_data["template"].replace(".html", ""),
                to_emails=user.email,
                context=context,
                subject=email_data["subject"],
            )

            # Advance campaign
            campaign.current_day += 1
            campaign.last_sent = timezone.now()
            if campaign.current_day > 10:
                campaign.completed = True
            campaign.save()

            self.stdout.write(self.style.SUCCESS(f"  ✅ Day {day} sent to {user.email}"))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"  ❌ Failed for {user.email}: {str(e)}"))
