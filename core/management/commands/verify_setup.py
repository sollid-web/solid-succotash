from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import connection

from investments.models import InvestmentPlan
from transactions.models import CryptocurrencyWallet


class Command(BaseCommand):
    help = "Verify database setup and critical data for WolvCapital"

    def handle(self, *args, **options):
        self.stdout.write("🔍 Verifying WolvCapital database setup...")

        try:
            # Test database connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            self.stdout.write(self.style.SUCCESS("✅ Database connection: OK"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Database connection failed: {e}"))
            return

        # Check investment plans
        try:
            plans_count = InvestmentPlan.objects.count()
            if plans_count >= 4:
                self.stdout.write(self.style.SUCCESS(f"✅ Investment plans: {plans_count} found"))
                for plan in InvestmentPlan.objects.all():
                    self.stdout.write(f"   - {plan.name}: {plan.roi_percentage}% daily")
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠️ Investment plans: Only {plans_count} found (expected 4)")
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Investment plans check failed: {e}"))

        # Check crypto wallets
        try:
            wallets_count = CryptocurrencyWallet.objects.count()
            if wallets_count >= 4:
                self.stdout.write(self.style.SUCCESS(f"✅ Crypto wallets: {wallets_count} found"))
                for wallet in CryptocurrencyWallet.objects.all():
                    self.stdout.write(f"   - {wallet.currency}: {wallet.network}")
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠️ Crypto wallets: Only {wallets_count} found (expected 4)")
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Crypto wallets check failed: {e}"))

        # Check admin user
        try:
            admin_count = User.objects.filter(is_superuser=True).count()
            if admin_count > 0:
                self.stdout.write(self.style.SUCCESS(f"✅ Admin users: {admin_count} found"))
            else:
                self.stdout.write(self.style.WARNING("⚠️ No admin users found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Admin users check failed: {e}"))

        self.stdout.write("\n🎉 Database verification completed!")
