#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the path
sys.path.append('/path/to/your/project')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.contrib.auth.models import User
from transactions.services import create_transaction, approve_transaction
from users.models import UserWallet

def test_wallet_crediting():
    """Test that wallet crediting works correctly after admin approval"""
    print("🔍 Testing wallet crediting functionality...")
    
    # Create a test user
    test_user, created = User.objects.get_or_create(
        email='testuser@example.com',
        defaults={'username': 'testuser', 'first_name': 'Test', 'last_name': 'User'}
    )
    
    # Check initial wallet balance
    wallet, created = UserWallet.objects.get_or_create(user=test_user)
    initial_balance = wallet.balance
    print(f"📊 Initial balance: ${initial_balance}")
    
    # Create a test deposit transaction
    deposit = create_transaction(
        user=test_user,
        tx_type='deposit',
        amount=1000,
        reference='Test deposit to check wallet crediting',
        payment_method='bank_transfer'
    )
    
    print(f"📝 Created deposit transaction: {deposit.id} - Status: {deposit.status}")
    
    # Get admin user
    admin_user = User.objects.get(email='admin@wolvcapital.com')
    
    # Approve the transaction
    try:
        approved_deposit = approve_transaction(deposit, admin_user, 'Test approval')
        print(f"✅ Transaction approved: {approved_deposit.status}")
        
        # Check wallet balance after approval
        wallet.refresh_from_db()
        final_balance = wallet.balance
        print(f"💰 Balance after approval: ${final_balance}")
        
        expected_balance = initial_balance + 1000
        if final_balance == expected_balance:
            print("🎉 SUCCESS: Wallet was credited correctly!")
            return True
        else:
            print(f"❌ FAILED: Expected ${expected_balance}, got ${final_balance}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_wallet_crediting()