from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import connection

from investments.models import InvestmentPlan
from transactions.models import CryptocurrencyWallet
from users.models import Profile


class Command(BaseCommand):
    help = "Verify database setup for WolvCapital deployment"

    def handle(self, *args, **options):
        self.stdout.write("🔍 Verifying WolvCapital database setup...")

        User = get_user_model()

        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            self.stdout.write(self.style.SUCCESS("✅ Database connection: OK"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Database connection failed: {e}"))
            return

        # Check investment plans
        try:
            plan_count = InvestmentPlan.objects.count()
            if plan_count >= 4:
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Investment plans: {plan_count} plans available")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f"⚠️ Investment plans: Only {plan_count} plans found (expected 4)"
                    )
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Investment plans check failed: {e}"))

        # Check crypto wallets
        try:
            wallet_count = CryptocurrencyWallet.objects.count()
            currencies = list(CryptocurrencyWallet.objects.values_list("currency", flat=True))
            if wallet_count >= 4:
                self.stdout.write(
                    self.style.SUCCESS(
                        f"✅ Crypto wallets: {wallet_count} wallets ({', '.join(currencies)})"
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠️ Crypto wallets: Only {wallet_count} wallets found")
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Crypto wallets check failed: {e}"))

        # Check admin user
        try:
            admin_users = User.objects.filter(is_staff=True, is_superuser=True).count()
            if admin_users > 0:
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Admin users: {admin_users} admin(s) available")
                )
            else:
                self.stdout.write(self.style.WARNING("⚠️ No admin users found"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Admin users check failed: {e}"))

        self.stdout.write("🎉 Database verification complete!")
