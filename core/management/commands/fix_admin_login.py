"""
Management command to fix admin login issues
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Profile, UserWallet

User = get_user_model()


class Command(BaseCommand):
    help = 'Fix admin login issues by ensuring all users have proper profiles and wallets'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n🔧 Fixing user authentication setup...\n'))
        
        users = User.objects.all()
        fixed_count = 0
        
        for user in users:
            changes = []
            
            # Ensure profile exists
            if not hasattr(user, 'profile'):
                Profile.objects.create(user=user)
                changes.append('profile')
                
            # Ensure wallet exists
            if not hasattr(user, 'wallet'):
                UserWallet.objects.create(user=user)
                changes.append('wallet')
            
            # Make sure staff users have admin role in profile
            if user.is_staff and user.profile.role != 'admin':
                user.profile.role = 'admin'
                user.profile.save()
                changes.append('admin role')
            
            if changes:
                fixed_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f'  Fixed {user.email}: {", ".join(changes)}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ {user.email} - OK')
                )
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Fixed {fixed_count} users\n'))
        self.stdout.write(self.style.SUCCESS(f'Total users: {users.count()}\n'))
