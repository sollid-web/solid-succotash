from django.core.management.base import BaseCommand
from transactions.models import VirtualCard

class Command(BaseCommand):
    help = "Set card_pin to NULL for all cards where it is an empty string or 'None' (string)."

    def handle(self, *args, **options):
        updated = 0
        # Fix empty string
        updated += VirtualCard.objects.filter(card_pin="").update(card_pin=None)
        # Fix string 'None'
        updated += VirtualCard.objects.filter(card_pin="None").update(card_pin=None)
        # Fix whitespace
        updated += VirtualCard.objects.filter(card_pin__regex=r'^\s+$').update(card_pin=None)
        self.stdout.write(self.style.SUCCESS(f"Updated {updated} cards: set card_pin to NULL where needed."))
