"""Send the 'account_ready' templated email for diagnostics.

This prints the active EMAIL_BACKEND and, when using Resend, the provider message id.

Usage:
  python manage.py send_account_ready --to user@example.com
  python manage.py send_account_ready --to user@example.com --first-name Teddy
  python manage.py send_account_ready --user-email existing@user.com
"""

from __future__ import annotations

from dataclasses import dataclass

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string

from core.email_service import EmailService


@dataclass
class _SimpleUser:
    email: str
    first_name: str = ""


class Command(BaseCommand):
    help = "Send the account_ready templated email (diagnostic)"

    def add_arguments(self, parser):
        parser.add_argument("--to", type=str, help="Recipient email address")
        parser.add_argument(
            "--user-email",
            type=str,
            help="Look up an existing User by email and send to them",
        )
        parser.add_argument(
            "--first-name",
            type=str,
            default="",
            help="Optional first name (only used with --to)",
        )

    def handle(self, *args, **options):
        to_email = (options.get("to") or "").strip()
        user_email = (options.get("user_email") or "").strip()
        first_name = (options.get("first_name") or "").strip()

        if not to_email and not user_email:
            self.stderr.write("Provide either --to or --user-email")
            return

        self.stdout.write("Email configuration:")
        self.stdout.write(f"  EMAIL_BACKEND: {getattr(settings, 'EMAIL_BACKEND', '(not set)')}")
        self.stdout.write(
            f"  DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', '(not set)')}"
        )

        user = None
        if user_email:
            User = get_user_model()
            try:
                user = User.objects.get(email__iexact=user_email)
            except User.DoesNotExist:
                self.stderr.write(f"No user found with email: {user_email}")
                return
            to_email = user.email
            self.stdout.write(f"Using existing user: {user.email}")
        else:
            user = _SimpleUser(email=to_email, first_name=first_name)

        self.stdout.write(f"Sending account_ready to: {to_email}")

        base_url = getattr(
            settings,
            "PUBLIC_SITE_URL",
            getattr(settings, "SITE_URL", "https://wolvcapital.com"),
        )
        context = {
            "user": user,
            "dashboard_url": "/dashboard/",
            "login_url": "/accounts/login/",
            "password_reset_url": "/accounts/password/reset/",
            "dashboard_link": f"{base_url}/dashboard/",
            "login_link": f"{base_url}/accounts/login/",
            "password_reset_link": f"{base_url}/accounts/password/reset/",
            "brand_name": getattr(settings, "BRAND", {}).get("name", "WolvCapital"),
            "brand_config": getattr(settings, "BRAND", {}),
            "site_url": base_url,
            "admin_site_url": getattr(settings, "ADMIN_SITE_URL", base_url),
        }

        subject = f"Your account is ready - {context['brand_name']}"
        html_content = render_to_string("emails/account_ready.html", context)
        try:
            text_content = render_to_string("emails/account_ready.txt", context)
        except Exception:
            text_content = EmailService._html_to_text(html_content)

        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            to=[to_email],
            reply_to=["support@mail.wolvcapital.com"],
        )
        msg.attach_alternative(html_content, "text/html")

        try:
            sent_count = msg.send(fail_silently=False)
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"❌ Send failed: {exc}"))
            raise

        anymail_id = None
        anymail_status = getattr(msg, "anymail_status", None)
        if anymail_status is not None:
            anymail_id = getattr(anymail_status, "message_id", None) or getattr(
                anymail_status, "id", None
            )
            if not anymail_id:
                recipients_status = getattr(anymail_status, "recipients", None)
                if isinstance(recipients_status, dict):
                    rec = recipients_status.get(to_email)
                    if rec is not None:
                        anymail_id = getattr(rec, "message_id", None) or getattr(rec, "id", None)

        resend_id = getattr(msg, "resend_id", None)
        if not resend_id:
            headers = getattr(msg, "extra_headers", None) or {}
            if isinstance(headers, dict):
                resend_id = headers.get("X-Resend-Id")

        if sent_count and sent_count > 0:
            if "console" in str(getattr(settings, "EMAIL_BACKEND", "")).lower():
                self.stdout.write(self.style.WARNING("⚠️ Console backend: email was printed, not delivered."))
                self.stdout.write(
                    "Set `DEBUG=0` and configure `RESEND_API_KEY` (or SMTP) to actually deliver emails."
                )
                return

            if resend_id:
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Accepted for delivery (Resend id: {resend_id})")
                )
                self.stdout.write(
                    "If the user still didn't receive it, check that id in Resend logs for bounce/suppression."
                )
            elif anymail_id:
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Accepted for delivery (Anymail message id: {anymail_id})")
                )
                self.stdout.write(
                    "If the user still didn't receive it, check that message id in Resend logs for bounce/suppression."
                )
            else:
                self.stdout.write(self.style.SUCCESS("✅ Accepted for delivery"))
                self.stdout.write(
                    "If the user still didn't receive it, check SMTP/provider logs and recipient spam/quarantine."
                )
        else:
            self.stdout.write(self.style.ERROR("❌ Not accepted for delivery (sent_count=0)"))
