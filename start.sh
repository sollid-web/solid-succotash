#!/bin/bash

# WolvCapital Render.com Startup Script
echo "🚀 Starting WolvCapital on Render.com..."

# Don't exit on errors during setup - we want to try to start the server even if setup fails
set +e

# Apply database migrations with retry
echo "📦 Running migrations..."
for i in {1..3}; do
    if python manage.py migrate --noinput; then
        echo "✅ Migrations completed successfully"
        break
    else
        echo "❌ Migration attempt $i failed, retrying in 5 seconds..."
        sleep 5
        if [ $i -eq 3 ]; then
            echo "⚠️ Migrations failed after 3 attempts, continuing anyway..."
        fi
    fi
done

# Collect static files (critical for production)
echo "📂 Collecting static files..."
if python manage.py collectstatic --noinput; then
    echo "✅ Static files collected successfully"
else
    echo "⚠️ Static files collection failed, continuing anyway..."
fi

# Seed investment plans (critical for WolvCapital) with retry and verbose logging
echo "💰 Seeding investment plans..."
for i in {1..3}; do
    echo "ℹ️  Attempt $i running: python manage.py seed_plans"
    if python manage.py seed_plans; then
        echo "✅ Investment plans seed attempt $i succeeded"
        echo "📊 Current plans in DB (post-seed):"
        python manage.py shell << 'EOF'
from investments.models import InvestmentPlan
qs = InvestmentPlan.objects.all().order_by('min_amount')
print(f"Total plans: {qs.count()}")
for p in qs:
    print(f" - {p.name}: ROI {p.daily_roi}% | {p.duration_days} days | ${p.min_amount}-${p.max_amount}")
EOF
        break
    else
        echo "❌ Seeding attempt $i failed, retrying in 3 seconds..."
        sleep 3
        if [ $i -eq 3 ]; then
            echo "⚠️  All seeding attempts failed. Continuing startup; /plans/ will show empty until fixed."
        fi
    fi
done

# Seed / update platform operational certificate (non-financial transparency)
echo "📜 Seeding platform certificate (idempotent)..."
if python manage.py seed_platform_certificate --certificate-id "WC-OP-2025-0001" --issuing-authority "Issuing Authority (Placeholder)" --jurisdiction "United States" --verification-url "https://wolvcapital.com/legal/certificate-of-operation"; then
    echo "✅ Platform certificate seeded/updated"
else
    echo "⚠️ Platform certificate seeding failed (continuing)"
fi

# Setup crypto wallets only if enabled (security consideration)
if [[ -n "$SETUP_CRYPTO_WALLETS" && "$SETUP_CRYPTO_WALLETS" == "1" ]]; then
    echo "₿ Setting up cryptocurrency wallets..."
    python manage.py shell << 'EOF' || echo "⚠️ Crypto wallet setup failed, continuing..."
try:
    import os
    from transactions.models import CryptocurrencyWallet

    # Only create wallets if actual addresses are provided via environment
    btc_address = os.getenv('BTC_WALLET_ADDRESS')
    eth_address = os.getenv('ETH_WALLET_ADDRESS')
    usdt_address = os.getenv('USDT_WALLET_ADDRESS')
    usdc_address = os.getenv('USDC_WALLET_ADDRESS')

    wallets = []
    if btc_address:
        wallets.append({'currency': 'BTC', 'address': btc_address, 'network': 'Bitcoin Network'})
    if eth_address:
        wallets.append({'currency': 'ETH', 'address': eth_address, 'network': 'Ethereum'})
    if usdt_address:
        wallets.append({'currency': 'USDT', 'address': usdt_address, 'network': 'ERC-20'})
    if usdc_address:
        wallets.append({'currency': 'USDC', 'address': usdc_address, 'network': 'ERC-20'})

    if not wallets:
        print("⚠️ No crypto wallet addresses configured via environment variables")
    else:
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
else
    echo "⏭️ Skipping crypto wallet setup (set SETUP_CRYPTO_WALLETS=1 to enable)"
fi

# Create admin user if environment variable is set
if [[ -n "$CREATE_INITIAL_ADMIN" && "$CREATE_INITIAL_ADMIN" == "1" ]]; then
    echo "👤 Setting up initial admin user..."
    python manage.py shell << 'EOF' || echo "⚠️ Admin user setup failed, continuing..."
try:
    import os
    from django.contrib.auth import get_user_model
    from users.models import Profile

    User = get_user_model()
    admin_email = os.getenv('INITIAL_ADMIN_EMAIL', 'admin@wolvcapital.com')
    admin_password = os.getenv('INITIAL_ADMIN_PASSWORD')
    
    if not admin_password:
        print("⚠️ INITIAL_ADMIN_PASSWORD not set, skipping admin creation")
    elif not User.objects.filter(email=admin_email).exists():
        user = User.objects.create_user(
            username=admin_email,
            email=admin_email,
            password=admin_password,
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
else
    echo "⏭️ Skipping admin user creation (set CREATE_INITIAL_ADMIN=1 to enable)"
fi

# Test database connection and verify setup
echo "🔍 Verifying database setup..."
python manage.py verify_db || echo "⚠️ Setup verification failed, continuing..."

echo "🎉 WolvCapital startup complete!"
echo "🌐 Admin Login: admin@wolvcapital.com / admin123"
echo "💼 Platform Features: Investment Plans, Crypto Deposits, Virtual Cards, Admin Notifications"

# Enable error handling for the server start
set -e

# Start the application with proper Render.com configuration
echo "🚀 Starting Gunicorn server on port $PORT..."
exec python -m gunicorn wolvcapital.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 2 \
    --timeout 120 \
    --keep-alive 5 \
    --max-requests 1000 \
    --preload
