#!/bin/bash

# WolvCapital Render.com Startup Script
echo "🚀 Starting WolvCapital on Render.com..."

# Exit on any error
set -e

# Apply database migrations
echo "📦 Running migrations..."
python manage.py migrate --noinput

# Seed investment plans (critical for WolvCapital)
echo "💰 Seeding investment plans..."
python manage.py seed_plans

# Create crypto wallets for deposits
echo "₿ Setting up cryptocurrency wallets..."
python manage.py shell << 'EOF'
from transactions.models import CryptocurrencyWallet

# Create sample crypto wallets if they don't exist
wallets = [
    {'currency': 'BTC', 'address': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'network': 'Bitcoin Network'},
    {'currency': 'USDT', 'address': '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A1234', 'network': 'ERC-20'},
    {'currency': 'USDC', 'address': '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A5678', 'network': 'ERC-20'},
    {'currency': 'ETH', 'address': '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A9ABC', 'network': 'Ethereum'}
]

for wallet_data in wallets:
    wallet, created = CryptocurrencyWallet.objects.get_or_create(
        currency=wallet_data['currency'],
        defaults={
            'wallet_address': wallet_data['address'],
            'network': wallet_data['network'],
            'is_active': True
        }
    )
    if created:
        print(f"Created {wallet_data['currency']} wallet")
    else:
        print(f"{wallet_data['currency']} wallet already exists")
EOF

# Create admin user if not exists
echo "👤 Setting up admin user..."
python manage.py shell << 'EOF'
from django.contrib.auth.models import User
from users.models import Profile

admin_email = 'admin@wolvcapital.com'
if not User.objects.filter(email=admin_email).exists():
    user = User.objects.create_user(
        username=admin_email,
        email=admin_email,
        password='admin123',
        is_staff=True,
        is_superuser=True
    )
    Profile.objects.update_or_create(
        user=user,
        defaults={'role': 'admin'}
    )
    print(f"✅ Admin user created: {admin_email}")
else:
    print(f"✅ Admin user already exists: {admin_email}")
EOF

echo "🎉 WolvCapital startup complete!"
echo "🌐 Admin Login: admin@wolvcapital.com / admin123"
echo "💼 Platform Features: Investment Plans, Crypto Deposits, Virtual Cards, Admin Notifications"

# Start the application with proper Render.com configuration
echo "🚀 Starting Gunicorn server on port $PORT..."
exec gunicorn wolvcapital.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --preload