import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings

from investments.models import InvestmentPlan
from transactions.models import CryptocurrencyWallet
from users.models import Profile


class Command(BaseCommand):
    help = "Verify database setup for WolvCapital deployment"

    def handle(self, *args, **options):
        self.stdout.write("🔍 Verifying WolvCapital database setup...")

        User = get_user_model()

        # Database engine and Railway environment check
        db_engine = settings.DATABASES['default']['ENGINE']
        db_name = settings.DATABASES['default']['NAME']
        
        self.stdout.write("📊 Database Configuration:")
        self.stdout.write(f"   Engine: {db_engine}")
        self.stdout.write(f"   Name: {db_name}")
        
        # Railway environment detection
        railway_vars = [k for k in os.environ.keys() if k.startswith('RAILWAY_')]
        if railway_vars:
            self.stdout.write("🚂 Railway Environment Detected")
            # Critical SQLite check for Railway
            if 'sqlite' in db_engine.lower() and not settings.DEBUG:
                self.stdout.write(self.style.ERROR(
                    "🚨 CRITICAL: Railway production using SQLite!\n"
                    "   Users will be LOST on every redeploy.\n"
                    "   Add PostgreSQL service and set DATABASE_URL."
                ))
        
        database_url = os.environ.get('DATABASE_URL')
        if database_url:
            masked_url = database_url[:25] + "..." + database_url[-15:] if len(database_url) > 40 else database_url
            self.stdout.write(f"🔗 DATABASE_URL: {masked_url}")
        else:
            self.stdout.write("❌ DATABASE_URL: Not set")

        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            self.stdout.write(self.style.SUCCESS("✅ Database connection: OK"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Database connection failed: {e}"))
            return

        # Check user data integrity
        try:
            total_users = User.objects.count()
            admin_users = User.objects.filter(is_superuser=True).count()
            active_users = User.objects.filter(is_active=True).count()
            
            self.stdout.write("👥 User Statistics:")
            self.stdout.write(f"   Total Users: {total_users}")
            self.stdout.write(f"   Admin Users: {admin_users}")
            self.stdout.write(f"   Active Users: {active_users}")
            
            if total_users == 0:
                self.stdout.write(self.style.WARNING("⚠️  No users found - fresh database"))
            
            # Show recent admin users
            recent_admins = User.objects.filter(is_superuser=True).order_by('-date_joined')[:3]
            if recent_admins:
                self.stdout.write("🔑 Recent Admin Users:")
                for user in recent_admins:
                    profile = getattr(user, 'profile', None)
                    role = profile.role if profile else 'No profile'
                    self.stdout.write(f"   • {user.email} ({role}) - Created: {user.date_joined.strftime('%Y-%m-%d %H:%M')}")
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error checking user data: {e}"))

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
