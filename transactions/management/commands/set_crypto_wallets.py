from __future__ import annotations

from django.core.management.base import BaseCommand

from transactions.models import CryptocurrencyWallet


class Command(BaseCommand):
    help = (
        "Create/update company crypto deposit wallets (BTC/ETH/USDT/USDC). "
        "Idempotent and safe to run multiple times."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--btc",
            required=True,
            help="BTC address (bech32/legacy)",
        )
        parser.add_argument(
            "--eth",
            required=True,
            help="ETH address",
        )
        parser.add_argument(
            "--usdt",
            required=True,
            help="USDT address",
        )
        parser.add_argument(
            "--usdc",
            required=True,
            help="USDC address",
        )
        parser.add_argument(
            "--eth-network",
            default="Ethereum",
            help="Network label for ETH (default: Ethereum)",
        )
        parser.add_argument(
            "--btc-network",
            default="Bitcoin",
            help="Network label for BTC (default: Bitcoin)",
        )
        parser.add_argument(
            "--usdt-network",
            default="Arbitrum",
            help="Network label for USDT (default: Arbitrum)",
        )
        parser.add_argument(
            "--usdc-network",
            default="Arbitrum",
            help="Network label for USDC (default: Arbitrum)",
        )

    def _upsert(self, *, currency: str, address: str, network: str) -> str:
        address = (address or "").strip()
        network = (network or "").strip()

        wallet, created = CryptocurrencyWallet.objects.get_or_create(
            currency=currency,
            defaults={
                "wallet_address": address,
                "network": network,
                "is_active": True,
            },
        )

        changed_fields: list[str] = []
        if not created:
            if wallet.wallet_address != address:
                wallet.wallet_address = address
                changed_fields.append("wallet_address")
            if wallet.network != network:
                wallet.network = network
                changed_fields.append("network")
            if not wallet.is_active:
                wallet.is_active = True
                changed_fields.append("is_active")

            if changed_fields:
                wallet.save(update_fields=changed_fields)

        if created:
            return f"{currency}: created"
        if changed_fields:
            return f"{currency}: updated ({', '.join(changed_fields)})"
        return f"{currency}: unchanged"

    def handle(self, *args, **options):
        results = [
            self._upsert(
                currency="BTC",
                address=options["btc"],
                network=options["btc_network"],
            ),
            self._upsert(
                currency="ETH",
                address=options["eth"],
                network=options["eth_network"],
            ),
            self._upsert(
                currency="USDT",
                address=options["usdt"],
                network=options["usdt_network"],
            ),
            self._upsert(
                currency="USDC",
                address=options["usdc"],
                network=options["usdc_network"],
            ),
        ]

        for line in results:
            self.stdout.write(line)

        self.stdout.write(self.style.SUCCESS("Crypto deposit wallets saved."))
