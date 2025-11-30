from django.core.management.base import BaseCommand
from referrals.models import ReferralSetting


class Command(BaseCommand):
    help = 'Seed default referral settings'

    def handle(self, *args, **options):
        settings_data = {
            'signup_bonus': {
                "amount": 10,
                "currency": "USD",
                "enabled": False,
                "require_kyc": True
            },
            'deposit_reward': {
                "percent": 2.5,
                "enabled": True,
                "apply_once": True,
                "min_deposit": 10,
                "max_reward_amount": 100
            },
            'fraud_protection': {
                "prevent_same_ip": True,
                "max_referrals_per_ip": 3,
                "require_deposit_verification": True
            }
        }

        for key, value in settings_data.items():
            setting, created = ReferralSetting.objects.update_or_create(
                key=key,
                defaults={'value': value}
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(
                self.style.SUCCESS(f'{action} referral setting: {key}')
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded referral settings'))
