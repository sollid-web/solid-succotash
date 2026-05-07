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

from core.models import DripCampaign
from core.email_service import EmailService

User = get_user_model()


# ─────────────────────────────────────────────
# EMAIL SEQUENCE DATA
# ─────────────────────────────────────────────

EMAILS = [
    {
        "day": 1,
        "subject": "🎉 You Made a Smart Move — Welcome to WolvCapital",
        "headline": "You Made a Smart Move.",
        "subheadline": "Welcome to professional-grade investing.",
        "template": "drip_campaign_day_1.html",
    },
    {
        "day": 2,
        "subject": "📊 Here's Exactly How WolvCapital Works",
        "headline": "Simple. Transparent. Profitable.",
        "subheadline": "Here's exactly how your money grows.",
        "template": "drip_campaign_day_2.html",
    },
    {
        "day": 3,
        "subject": "💎 Which Investment Plan Is Right for You?",
        "headline": "Which Plan Is Right for You?",
        "subheadline": "Four tiers. One goal — growing your wealth.",
        "template": "drip_campaign_day_3.html",
    },
    {
        "day": 4,
        "subject": "🚀 Introducing WOLV Token — Your Profits On the Blockchain",
        "headline": "Meet WOLV Token.",
        "subheadline": "Your profits — on the blockchain, forever.",
        "template": "drip_campaign_day_4.html",
    },
    {
        "day": 5,
        "subject": "🛡️ Your Money Is Safe With Us — Here's the Proof",
        "headline": "Your Money Is Safe With Us.",
        "subheadline": "Here's the proof — not just the promise.",
        "template": "drip_campaign_day_5.html",
    },
    {
        "day": 6,
        "subject": "⭐ Real Investors. Real Returns. Real Stories.",
        "headline": "Real Investors. Real Returns.",
        "subheadline": "Don't take our word for it.",
        "template": "drip_campaign_day_6.html",
    },
    {
        "day": 7,
        "subject": "💳 Spend Your Profits Anywhere — The WolvCapital Virtual Card",
        "headline": "Spend Your Profits Anywhere.",
        "subheadline": "Introducing the WolvCapital Virtual Visa Card.",
        "template": "drip_campaign_day_7.html",
    },
    {
        "day": 8,
        "subject": "❓ Your Honest Questions — Answered",
        "headline": "We Know You Have Questions.",
        "subheadline": "Here are the honest answers.",
        "template": "drip_campaign_day_8.html",
    },
    {
        "day": 9,
        "subject": "⏰ Don't Miss the Early Mover Advantage — WOLV Token",
        "headline": "Don't Miss the Early Mover Advantage.",
        "subheadline": "WOLV Token is brand new. Early investors win most.",
        "template": "drip_campaign_day_9.html",
    },
    {
        "day": 10,
        "subject": "🚀 This Is Your Moment — Everything You Need, You Already Know",
        "headline": "This Is Your Moment.",
        "subheadline": "Everything you need to know — you know.",
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

    def handle(self, *args, **options):
        """Route to appropriate subcommand."""
        if options.get("enroll"):
            self.enroll_user(options["enroll"])

        elif options.get("send"):
            self.send_todays_emails(dry_run=options.get("dry_run", False))

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
                email_service = EmailService
                context = {
                    "first_name": first_name,
                    "dashboard_url": "https://wolvcapital.com/dashboard",
                    "plans_url": "https://wolvcapital.com/plans",
                    "wolv_token_url": "https://wolvcapital.com/wolv-token",
                    "card_url": "https://wolvcapital.com/dashboard/card",
                    "contact_url": "https://wolvcapital.com/contact",
                    "new_investment_url": "https://wolvcapital.com/dashboard/new-investment",
                    "compliance_url": "https://wolvcapital.com/compliance",
                    "bscscan_url": "https://bscscan.com/token/0xbcb3d35bcbbd141f1955aaf8f51b48b801b117bf",
                }

                email_service.send_template(
                    template_name=email_data["template"],
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
            self.stdout.write(self.style.WARNING(f"  Not enrolled in campaign"))
