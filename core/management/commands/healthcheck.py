"""
Django management command to run health checks
Usage: python manage.py healthcheck
"""

from django.core.management.base import BaseCommand

from core.health_check import run_full_check


class Command(BaseCommand):
    help = "Run comprehensive health checks for WolvCapital deployment"

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("\n🏥 Starting WolvCapital Health Check...\n"))

        all_passed = run_full_check()

        if all_passed:
            self.stdout.write(self.style.SUCCESS("\n✅ All health checks passed!\n"))
            return
        else:
            self.stdout.write(
                self.style.ERROR("\n❌ Some health checks failed. See details above.\n")
            )
            exit(1)
