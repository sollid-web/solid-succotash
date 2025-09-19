#!/bin/bash

# Railway startup script
echo "Starting WolvCapital deployment..."

# Run migrations
python manage.py migrate --noinput

# Create superuser if it doesn't exist
echo "
from django.contrib.auth.models import User
if not User.objects.filter(email='admin@wolvcapital.com').exists():
    User.objects.create_superuser('admin@wolvcapital.com', 'admin@wolvcapital.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
" | python manage.py shell

# Create crypto wallets if they don't exist
echo "
from transactions.models import CryptocurrencyWallet
wallets_created = 0
currencies = [
    ('BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'Bitcoin Network'),
    ('USDT', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A1234', 'ERC-20'),
    ('USDC', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A5678', 'ERC-20'),
    ('ETH', '0x742d35Cc6C84D6A5a6A9dd1f6C4A4B2A7D3A9ABC', 'Ethereum')
]

for currency, address, network in currencies:
    wallet, created = CryptocurrencyWallet.objects.get_or_create(
        currency=currency,
        defaults={
            'wallet_address': address,
            'network': network,
            'is_active': True
        }
    )
    if created:
        wallets_created += 1

print(f'Created {wallets_created} new crypto wallets')
" | python manage.py shell

# Collect static files
python manage.py collectstatic --noinput

echo "Setup complete! Starting server..."

# Start the application
gunicorn wolvcapital.wsgi --log-file -