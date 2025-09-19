#!/bin/bash
# Render.com build script

echo "Building WolvCapital for Render..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

# Create superuser and crypto wallets
echo "
from django.contrib.auth.models import User
from transactions.models import CryptocurrencyWallet

# Create superuser if it doesn't exist
if not User.objects.filter(email='admin@wolvcapital.com').exists():
    User.objects.create_superuser('admin@wolvcapital.com', 'admin@wolvcapital.com', 'admin123')
    print('Superuser created')

# Create crypto wallets
currencies = [
    ('BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'Bitcoin Network'),
    ('USDT', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A1234', 'ERC-20'),
    ('USDC', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A5678', 'ERC-20'),
    ('ETH', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A9ABC', 'Ethereum')
]

for currency, address, network in currencies:
    CryptocurrencyWallet.objects.get_or_create(
        currency=currency,
        defaults={'wallet_address': address, 'network': network, 'is_active': True}
    )
print('Setup complete!')
" | python manage.py shell

echo "Build complete!"