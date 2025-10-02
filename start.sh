#!/bin/bash

# WolvCapital Render.com Startup Script
echo "🚀 Starting WolvCapital on Render.com..."

# Exit on any error
set -e

# Apply database migrations with retry
echo "📦 Running migrations..."
for i in {1..3}; do
    if python manage.py migrate --noinput; then
        echo "✅ Migrations completed successfully"
        break
    else
        echo "❌ Migration attempt $i failed, retrying in 5 seconds..."
        sleep 5
    fi
done

# Seed investment plans (critical for WolvCapital) with retry
echo "💰 Seeding investment plans..."
for i in {1..3}; do
    if python manage.py seed_plans; then
        echo "✅ Investment plans seeded successfully"
        break
    else
        echo "❌ Seeding attempt $i failed, retrying in 3 seconds..."
        sleep 3
    fi
done

# Create crypto wallets for deposits with error handling
echo "₿ Setting up cryptocurrency wallets..."
python manage.py shell << 'EOF' || echo "⚠️ Crypto wallet setup failed, continuing..."
try:
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
    print("✅ Crypto wallets setup completed")
except Exception as e:
    print(f"❌ Crypto wallet setup error: {e}")
EOF

# Create admin user if not exists with error handling
echo "👤 Setting up admin user..."
python manage.py shell << 'EOF' || echo "⚠️ Admin user setup failed, continuing..."
try:
    from django.contrib.auth import get_user_model
    from users.models import Profile

    User = get_user_model()
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
except Exception as e:
    print(f"❌ Admin user setup error: {e}")
EOF

# Test database connection and verify setup
echo "🔍 Verifying database setup..."
python manage.py verify_db || echo "⚠️ Setup verification failed, continuing..."

echo "🎉 WolvCapital startup complete!"
echo "🌐 Admin Login: admin@wolvcapital.com / admin123"
echo "💼 Platform Features: Investment Plans, Crypto Deposits, Virtual Cards, Admin Notifications"

# Start the application with proper Render.com configuration
echo "🚀 Starting Gunicorn server on port $PORT..."
exec python -m gunicorn wolvcapital.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --preload