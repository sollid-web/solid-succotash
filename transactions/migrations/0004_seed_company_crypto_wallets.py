from django.db import migrations


def seed_wallets(apps, schema_editor):
    Wallet = apps.get_model('transactions', 'CryptocurrencyWallet')

    data = [
        {"currency": "BTC", "wallet_address": "bc1qf5f0ktzd6evgvp2vljlkrehek5zgjc8wzalltj", "network": "Bitcoin", "is_active": True},
        {"currency": "ETH", "wallet_address": "0x805F3317c3cE7c22e3ee26AF88fd869f8895cc56", "network": "ERC-20", "is_active": True},
        {"currency": "USDT", "wallet_address": "Fd6bYJ4rHZVo5sVxjytmpRMB71Rbh99obASnav3YnvWf", "network": "Solana", "is_active": True},
        {"currency": "USDC", "wallet_address": "Fd6bYJ4rHZVo5sVxjytmpRMB71Rbh99obASnav3YnvWf", "network": "Solana", "is_active": True},
    ]

    for row in data:
        Wallet.objects.update_or_create(
            currency=row["currency"],
            defaults={
                "wallet_address": row["wallet_address"],
                "network": row["network"],
                "is_active": row["is_active"],
            }
        )


def unseed_wallets(apps, schema_editor):
    Wallet = apps.get_model('transactions', 'CryptocurrencyWallet')
    Wallet.objects.filter(currency__in=["BTC", "ETH", "USDT", "USDC"]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0003_virtualcard_adminnotification_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_wallets, unseed_wallets),
    ]
