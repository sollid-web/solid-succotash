from django.core.management.base import BaseCommand
from django.core.mail import EmailMultiAlternatives

class Command(BaseCommand):
    help = "Send account validation reminder email"

    def add_arguments(self, parser):
        parser.add_argument("--to", required=True)
        parser.add_argument("--name", default="Investor")

    def handle(self, *args, **opts):
        to_email = opts["to"]
        investor_name = opts["name"]

        from_header = "WolvCapital Support <support@mail.wolvcapital.com>"
        subject = "Reminder: Please Complete Your Account Validation"

        text_body = f"""Dear {investor_name},

I hope you are well.

This is a gentle reminder that your WolvCapital account restoration has been completed successfully.

To keep your account running smoothly and to ensure transactions process without interruption, please complete the final Account Validation step in your dashboard.

How to do it (securely):
1) Open your browser and type www.wolvcapital.com manually (avoid forwarded links).
2) Log in to your dashboard.
3) Complete the “Account Validation” step shown on your dashboard.

For your protection:
- We will never ask for your password, OTP, or private access details by email.
- Please complete all actions only inside your official dashboard.

Warm regards,
WolvCapital Support
support@mail.wolvcapital.com
"""

        html_body = f"""
        <div style="font-family:Arial,Helvetica,sans-serif;">
          <p>Dear {investor_name},</p>
          <p>I hope you are well.</p>
          <p>This is a gentle reminder that your WolvCapital account restoration has been completed successfully.</p>
          <p>To keep your account running smoothly and to ensure transactions process without interruption, please complete the final <b>Account Validation</b> step in your dashboard.</p>
          <p><b>How to do it (securely):</b><br/>
          1) Open your browser and type <b>www.wolvcapital.com</b> manually (avoid forwarded links).<br/>
          2) Log in to your dashboard.<br/>
          3) Complete the <b>Account Validation</b> step shown on your dashboard.</p>
          <p><b>For your protection:</b><br/>
          • We will never ask for your password, OTP, or private access details by email.<br/>
          • Please complete all actions only inside your official dashboard.</p>
          <p style="margin-top:14px;"><b>Warm regards,</b><br/>WolvCapital Support<br/><span style="color:#6b7280; font-size:12px;">support@mail.wolvcapital.com</span></p>
        </div>
        """

        msg = EmailMultiAlternatives(subject, text_body, from_header, [to_email])
        msg.attach_alternative(html_body, "text/html")
        sent = msg.send(fail_silently=False)

        self.stdout.write(self.style.SUCCESS(f"Sent={sent} to {to_email}"))
