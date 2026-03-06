from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string

class Command(BaseCommand):
    help = "Send WolvCapital Virtual Card email to investors"

    def handle(self, *args, **kwargs):
        # List of recipients
        recipients = [
            "rick@steenbock.me",           
 # Add more emails as needed
        ]

        # Path to your HTML template in Django templates folder
        html_template = "virtual_card_announcement.html"

        for email in recipients:
            # Render template
            html_content = render_to_string(html_template, {})

            # Email subject
            subject = "Introducing Your WolvCapital Virtual Card"

            # Build email message
            msg = EmailMultiAlternatives(
                subject=subject,
                body="This is an HTML email. Please enable HTML view.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email]
            )
            msg.attach_alternative(html_content, "text/html")

            # Send email
            msg.send()
            self.stdout.write(self.style.SUCCESS(f"Email sent to {email}"))
