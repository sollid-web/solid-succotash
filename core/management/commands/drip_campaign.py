"""
WolvCapital 10-Email Drip Campaign System.
USAGE:
    python manage.py drip_campaign --enroll user@email.com
    python manage.py drip_campaign --send [--dry-run]
    python manage.py drip_campaign --status user@email.com
RAILWAY CRON: python manage.py drip_campaign --send
Schedule: 0 9 * * * (daily 9am)
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from core.models import DripCampaign
from core.email_service import EmailService

User = get_user_model()

EMAILS = [
    {
        "day": 1,
        "subject": "Your money should work harder than you do",
        "headline": "Most savings accounts earn less than 1% a year.",
        "subheadline": "WolvCapital was built for people who decided that's not good enough. Earn 8–25% APY on BNB Smart Chain.",
        "template": "drip_wolv_day_1",
        "cta_text": "Explore Investment Plans",
        "cta_url_key": "plans_url",
    },
    {
        "day": 2,
        "subject": "We put your profits on the blockchain",
        "headline": "We don't just say you earned it. We prove it on-chain.",
        "subheadline": "Profits are paid as WOLV tokens — sent to your wallet, recorded permanently on BNB Smart Chain. Verify anytime on BSCScan.",
        "template": "drip_wolv_day_2",
        "cta_text": "View WOLV Contract on BSCScan",
        "cta_url_key": "bscscan_url",
    },
    {
        "day": 3,
        "subject": "Stake once. Earn WOLV automatically.",
        "headline": "Lock BNB or BUSD. Earn WOLV in real time.",
        "subheadline": "Four staking plans from 8% to 25% APY. Rewards accumulate live on-chain from the moment you stake.",
        "template": "drip_wolv_day_3",
        "cta_text": "See Staking Plans",
        "cta_url_key": "stake_url",
    },
    {
        "day": 4,
        "subject": "What $500 looks like after 90 days",
        "headline": "No projections. Just straightforward math.",
        "subheadline": "$500 on Pioneer (8% APY, 90 days) = ~40 WOLV. $5,000 on Horizon (18% APY, 180 days) = ~$443 worth of WOLV.",
        "template": "drip_wolv_day_4",
        "cta_text": "Open My Account",
        "cta_url_key": "signup_url",
    },
    {
        "day": 5,
        "subject": "Here's everything we can't hide (and why that's good)",
        "headline": "Transparency is our competitive advantage.",
        "subheadline": "Verified smart contracts. 87.14/100 audit score. 1M WOLV reward pool on-chain. KYC/AML compliant. Fixed supply of 1 billion WOLV.",
        "template": "drip_wolv_day_5",
        "cta_text": "Read Our Smart Contracts",
        "cta_url_key": "smart_contracts_url",
    },
    {
        "day": 6,
        "subject": "You're earning — here's how to earn more",
        "headline": "Stack your returns. Two income streams, one platform.",
        "subheadline": "Your investment plan runs in the background. Simultaneously stake BNB or BUSD to earn additional WOLV on top.",
        "template": "drip_wolv_day_6",
        "cta_text": "Go to Staking Dashboard",
        "cta_url_key": "stake_url",
    },
    {
        "day": 7,
        "subject": "Your WOLV is waiting — have you claimed it?",
        "headline": "Your WOLV tokens are ready to collect.",
        "subheadline": "Connect MetaMask or Trust Wallet to your dashboard to see your pending WOLV balance in real time.",
        "template": "drip_wolv_day_7",
        "cta_text": "Connect Wallet & Check Balance",
        "cta_url_key": "dashboard_url",
    },
    {
        "day": 8,
        "subject": "The questions everyone asks before they invest",
        "headline": "Is it safe? What's the catch? Is WOLV real?",
        "subheadline": "We answer the five hardest questions about WolvCapital — honestly, with on-chain proof for every answer.",
        "template": "drip_wolv_day_8",
        "cta_text": "Read Full FAQ",
        "cta_url_key": "faq_url",
    },
    {
        "day": 9,
        "subject": "The reward pool won't last forever",
        "headline": "1,000,000 WOLV. Finite. Verified on-chain.",
        "subheadline": "Every reward paid reduces the pool. Early stakers earn while rates are highest. This isn't fake urgency — check the pool balance yourself on BSCScan.",
        "template": "drip_wolv_day_9",
        "cta_text": "Claim My Spot Now",
        "cta_url_key": "signup_url",
    },
    {
        "day": 10,
        "subject": "Last email. One question.",
        "headline": "What would it take for you to start?",
        "subheadline": "Reply to this email and I'll answer personally. Or start now — Pioneer plan begins at $100 and takes 5 minutes.",
        "template": "drip_wolv_day_10",
        "cta_text": "I'm Ready →",
        "cta_url_key": "signup_url",
    },
]


class Command(BaseCommand):
    help = "WolvCapital 10-email WOLV drip campaign manager"

    def add_arguments(self, parser):
        parser.add_argument("--enroll", type=str, help="Enroll a user email into the campaign")
        parser.add_argument("--send", action="store_true", help="Send today's emails to all enrolled users")
        parser.add_argument("--dry-run", action="store_true", help="Preview without sending")
        parser.add_argument("--status", type=str, help="Check campaign status for a user email")
        parser.add_argument("--send-single", type=str, help="Send current drip email to a single user")

    def handle(self, *args, **options):
        if options.get("enroll"):
            self.enroll_user(options["enroll"])
        elif options.get("send"):
            self.send_todays_emails(dry_run=options.get("dry_run", False))
        elif options.get("send_single"):
            self.send_single_user(options["send_single"], dry_run=options.get("dry_run", False))
        elif options.get("status"):
            self.check_status(options["status"])
        else:
            self.stdout.write("Usage: --enroll email | --send [--dry-run] | --status email")

    def _build_context(self, user, email_data):
        base = getattr(settings, "SITE_URL", "https://wolvcapital.com")
        return {
            "first_name": user.first_name or "Valued Investor",
            "headline": email_data["headline"],
            "subheadline": email_data["subheadline"],
            "cta_text": email_data["cta_text"],
            "dashboard_url": f"{base}/dashboard",
            "signup_url": f"{base}/accounts/signup",
            "plans_url": f"{base}/plans",
            "stake_url": f"{base}/dashboard/stake",
            "wolv_token_url": f"{base}/wolv-token",
            "smart_contracts_url": f"{base}/smart-contracts",
            "faq_url": f"{base}/faq",
            "contact_url": f"{base}/contact",
            "bscscan_url": "https://bscscan.com/token/0xe0167279aef7bf4ad313d261da82e8366822270c",
            "pool_address": "https://bscscan.com/address/0xb233cf74b14abf9d9702d585c540030125599579",
            "cta_url": f"{base}/" + email_data["cta_url_key"].replace("_url", "").replace("_", "/"),
        }

    def enroll_user(self, email: str):
        user = User.objects.filter(email=email).first()
        if not user:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return
        campaign, created = DripCampaign.objects.get_or_create(user=user)
        if created:
            self.stdout.write(self.style.SUCCESS(f"✅ Enrolled {email} in drip campaign"))
        else:
            self.stdout.write(self.style.WARNING(f"⚠️  {email} already enrolled (day {campaign.current_day}/10)"))

    def send_todays_emails(self, dry_run: bool = False):
        campaigns = (
            DripCampaign.objects.filter(completed=False, active=True)
            .select_related("user")
            .order_by("enrolled_at")
        )
        self.stdout.write(self.style.SUCCESS(f"📧 Found {campaigns.count()} active campaign(s)"))
        sent = failed = skipped = 0

        for campaign in campaigns:
            user = campaign.user
            day = campaign.current_day

            if day > 10:
                campaign.completed = True
                campaign.save()
                skipped += 1
                continue

            email_data = next((e for e in EMAILS if e["day"] == day), None)
            if not email_data:
                skipped += 1
                continue

            if dry_run:
                self.stdout.write(f"  [DRY RUN] Day {day} → {user.email}: {email_data['subject']}")
                sent += 1
                continue

            try:
                context = self._build_context(user, email_data)
                EmailService._send(
                    template_name=email_data["template"],
                    to_emails=user.email,
                    context=context,
                    subject=email_data["subject"],
                )
                campaign.current_day += 1
                campaign.last_sent = timezone.now()
                if campaign.current_day > 10:
                    campaign.completed = True
                campaign.save()
                sent += 1
                self.stdout.write(self.style.SUCCESS(f"  ✅ Day {day} → {user.email}"))
            except Exception as e:
                failed += 1
                self.stderr.write(self.style.ERROR(f"  ❌ Failed for {user.email}: {e}"))

        self.stdout.write(f"\nDone — Sent: {sent} | Failed: {failed} | Skipped: {skipped}")

    def send_single_user(self, email: str, dry_run: bool = False):
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
            self.stdout.write(self.style.WARNING(f"Campaign not active or completed for {email}"))
            return
        day = campaign.current_day
        email_data = next((e for e in EMAILS if e["day"] == day), None)
        if not email_data:
            self.stderr.write(self.style.ERROR(f"No email for day {day}"))
            return
        if dry_run:
            self.stdout.write(f"  [DRY RUN] Day {day} → {user.email}: {email_data['subject']}")
            return
        try:
            context = self._build_context(user, email_data)
            EmailService._send(
                template_name=email_data["template"],
                to_emails=user.email,
                context=context,
                subject=email_data["subject"],
            )
            campaign.current_day += 1
            campaign.last_sent = timezone.now()
            if campaign.current_day > 10:
                campaign.completed = True
            campaign.save()
            self.stdout.write(self.style.SUCCESS(f"  ✅ Day {day} sent to {user.email}"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"  ❌ Failed: {e}"))

    def check_status(self, email: str):
        user = User.objects.filter(email=email).first()
        if not user:
            self.stderr.write(self.style.ERROR(f"User not found: {email}"))
            return
        try:
            campaign = DripCampaign.objects.get(user=user)
            self.stdout.write(f"\nCampaign status for {email}:")
            self.stdout.write(f"  Current day : {campaign.current_day}/10")
            self.stdout.write(f"  Last sent   : {campaign.last_sent or 'Never'}")
            self.stdout.write(f"  Active      : {'Yes' if campaign.active else 'No'}")
            self.stdout.write(f"  Completed   : {'Yes' if campaign.completed else 'No'}")
            self.stdout.write(f"  Enrolled    : {campaign.enrolled_at.strftime('%Y-%m-%d %H:%M')}")
        except DripCampaign.DoesNotExist:
            self.stdout.write(self.style.WARNING("Not enrolled in campaign"))
