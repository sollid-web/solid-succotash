"""
Management command to sync emails from IMAP inbox
"""

from django.conf import settings
from django.core.management.base import BaseCommand

from core.email_inbox_service import fetch_new_emails


class Command(BaseCommand):
    help = 'Fetch new emails from IMAP server and save to database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Maximum number of emails to fetch (default: 100)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Test IMAP connection without saving emails'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']

        self.stdout.write(self.style.SUCCESS('Starting email sync...'))
        self.stdout.write(f'Limit: {limit} emails')

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No emails will be saved'))

            # Test connection
            from core.email_inbox_service import EmailInboxService
            service = EmailInboxService()
            mail = service.connect()

            if mail:
                self.stdout.write(self.style.SUCCESS('✓ IMAP connection successful!'))
                try:
                    mail.select(service.folder)
                    status, messages = mail.search(None, 'ALL')
                    if status == 'OK':
                        count = len(messages[0].split())
                        self.stdout.write(self.style.SUCCESS(f'✓ Found {count} emails in inbox'))
                    mail.close()
                    mail.logout()
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'✗ Error: {e}'))
            else:
                self.stdout.write(self.style.ERROR('✗ IMAP connection failed'))
                self.stdout.write('Check your settings:')
                self.stdout.write(f'  INBOX_IMAP_HOST: {getattr(settings, "INBOX_IMAP_HOST", "Not set")}')
                self.stdout.write(f'  INBOX_EMAIL_USER: {getattr(settings, "INBOX_EMAIL_USER", "Not set")}')
                self.stdout.write(f'  INBOX_EMAIL_PASSWORD: {"***" if getattr(settings, "INBOX_EMAIL_PASSWORD", "") else "Not set"}')

            return

        try:
            count = fetch_new_emails(limit=limit)

            if count > 0:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Successfully fetched and saved {count} new email(s)')
                )
            elif count == 0:
                self.stdout.write(
                    self.style.WARNING('No new emails found (all already synced)')
                )
            else:
                self.stdout.write(
                    self.style.ERROR('✗ Email sync failed - check logs for details')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Error during sync: {e}')
            )
            raise
