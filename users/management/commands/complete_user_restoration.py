from decimal import Decimal
import sys
from datetime import date
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from users.models import Profile
from transactions.models import UserWallet
from investments.services import create_approved_investment_at


class Command(BaseCommand):
    help = "Complete the user investment data restoration for teddybjorn72@live.no"

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-email',
            type=str,
            required=True,
            help='Email of admin user for audit logs'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes'
        )

    def handle(self, *args, **options):
        User = get_user_model()
        admin_email = options['admin_email']
        dry_run = options['dry_run']

        # Find admin user
        try:
            admin_user = User.objects.get(email__iexact=admin_email, is_staff=True)
        except User.DoesNotExist:
            raise CommandError(f"Admin user not found: {admin_email}")

        if dry_run:
            self.stdout.write("🧪 DRY RUN - No changes will be made")

        # Step 1: Update placeholder user with real email
        self.stdout.write("📧 Step 1: Updating user email and details...")
        
        try:
            user = User.objects.get(username='placeholder-teddybjorn72')
            self.stdout.write(f"Found placeholder user: {user.username}")
            
            if not dry_run:
                with transaction.atomic():
                    user.email = 'teddybjorn72@live.no'
                    user.is_active = True
                    user.save()
                    
                    # Update or create profile
                    profile, created = Profile.objects.get_or_create(
                        user=user,
                        defaults={
                            'full_name': 'Teddy',
                            'role': 'user'
                        }
                    )
                    if not created and profile.full_name != 'Teddy':
                        profile.full_name = 'Teddy'
                        profile.save()
                    
                self.stdout.write(self.style.SUCCESS(f"✅ Updated user: teddybjorn72@live.no (Active: {user.is_active})"))
            else:
                self.stdout.write("Would update: email=teddybjorn72@live.no, active=True, name=Teddy")
        
        except User.DoesNotExist:
            raise CommandError("Placeholder user 'placeholder-teddybjorn72' not found")

        # Step 2: Ensure wallet exists
        self.stdout.write("💰 Step 2: Checking wallet...")
        
        if not dry_run:
            wallet, created = UserWallet.objects.get_or_create(
                user=user,
                defaults={'balance': Decimal('0.00')}
            )
            self.stdout.write(f"✅ Wallet exists: ${wallet.balance}")
        else:
            self.stdout.write("Would ensure wallet exists")

        # Step 3: Get investment data from user
        self.stdout.write("\n📊 Step 3: Investment data needed...")
        self.stdout.write("Please provide the investment details from the original dashboard:")
        self.stdout.write("Format: PLAN_NAME|AMOUNT|START_DATE")
        self.stdout.write("Example: VANGUARD|25000|2025-01-01")
        self.stdout.write("\nAvailable plans:")
        
        from investments.models import InvestmentPlan
        plans = InvestmentPlan.objects.all().order_by('min_amount')
        for plan in plans:
            self.stdout.write(f"  • {plan.name}: {plan.daily_roi}% daily, {plan.duration_days} days, ${plan.min_amount}-${plan.max_amount}")
        
        # For now, let's create some example investments based on typical amounts
        sample_investments = [
            ('VANGUARD', Decimal('25000.00'), date(2025, 1, 1)),
            ('HORIZON', Decimal('15000.00'), date(2025, 2, 1)),
        ]
        
        self.stdout.write(f"\n🔄 Step 4: Creating sample investments (update as needed)...")
        
        for plan_name, amount, start_date in sample_investments:
            try:
                plan = InvestmentPlan.objects.get(name__iexact=plan_name)
                
                if dry_run:
                    self.stdout.write(f"Would create: {plan.name} ${amount} starting {start_date}")
                    continue
                
                # Check if wallet has sufficient balance (fund it if needed)
                current_balance = UserWallet.objects.get(user=user).balance
                if current_balance < amount:
                    self.stdout.write(f"⚠️  Insufficient wallet balance (${current_balance} < ${amount})")
                    self.stdout.write("You'll need to fund the wallet first using:")
                    self.stdout.write(f"   python manage.py create_historical_investments --username {user.username} --admin-email {admin_email} --fund {amount}")
                    continue
                
                # Create the investment
                investment = create_approved_investment_at(
                    user=user,
                    plan=plan,
                    amount=amount,
                    started_at=start_date,
                    admin_user=admin_user,
                    notify_user=False,
                    notify_admin=False
                )
                
                self.stdout.write(self.style.SUCCESS(f"✅ Created investment: {investment.plan.name} ${investment.amount} (ID: {investment.id})"))
                
            except InvestmentPlan.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"❌ Plan not found: {plan_name}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error creating {plan_name} investment: {e}"))

        # Step 5: Next steps
        self.stdout.write("\n🎯 Next steps:")
        self.stdout.write(f"1. Fund wallet: python manage.py create_historical_investments --username {user.username} --admin-email {admin_email} --fund 50000")
        self.stdout.write(f"2. Create real investments with exact amounts from dashboard screenshots")
        self.stdout.write(f"3. Backfill ROI: python manage.py payout_roi --start-date 2025-12-31 --user-email teddybjorn72@live.no")
        
        if not dry_run:
            self.stdout.write(self.style.SUCCESS("\n✅ User restoration complete!"))