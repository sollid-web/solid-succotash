# GitHub Copilot Chat Assistant
"""
WolvCapital Django Email Utilities for SendGrid Integration
"""
# stdlib
import logging

# third-party (Django)
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.exceptions import TemplateDoesNotExist
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

logger = logging.getLogger(__name__)


def send_test_email(recipient_email, subject=None, message=None):
    """
    Send a test email to verify SendGrid configuration
    """
    try:
        subject = subject or "Test Email - WolvCapital SendGrid Configuration"
        message = message or """Hello!

This is a test email from WolvCapital to verify that SendGrid is working correctly.

If you received this email, your email configuration is working properly!

Best regards,
WolvCapital Team
"""
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        logger.info(f"Test email sent successfully to {recipient_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send test email to {recipient_email}: {str(e)}")
        return False


def send_welcome_email(to_email, first_name, user=None):
    """
    Send a welcome email to a new user using dedicated support email address
    """
    try:
        context = {"first_name": first_name, "to_email": to_email, "user": user}
        try:
            html_content = render_to_string("emails/welcome.html", context)
        except TemplateDoesNotExist as template_error:
            logger.warning(f"Welcome template not found; using fallback HTML: {template_error}")
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to WolvCapital</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #2196F3, #0D47A1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }}
        .footer {{ background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }}
        .btn {{ display: inline-block; background: #FFD700; color: #0D47A1; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 WolvCapital</h1>
            <p>Invest Smart, Grow Fast</p>
        </div>
        <div class="content">
            <h2>Welcome {first_name}! 🎉</h2>
            <p>Thank you for joining WolvCapital! Your investment journey starts here.</p>
            <p><strong>What's Next?</strong></p>
            <ul>
                <li>💰 Explore our investment plans</li>
                <li>🔒 Secure your account</li>
                <li>📊 Access your dashboard</li>
                <li>🎯 Start building your portfolio</li>
            </ul>
            <div style="text-align: center;">
                <a href="https://wolvcapital.com/dashboard" class="btn">Access Your Dashboard</a>
            </div>
            <p>Need help? Contact our support team at support@wolvcapital.com</p>
        </div>
        <div class="footer">
            <p><strong>WolvCapital Support Team</strong></p>
            <p>📧 support@wolvcapital.com | 🌐 wolvcapital.com</p>
        </div>
    </div>
</body>
</html>"""
        subject = "🎉 Welcome to WolvCapital - Your Investment Journey Begins!"
        from_email = getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL)

        text_content = f"""Welcome to WolvCapital, {first_name}!

Thank you for joining our investment platform. Your account is now ready and you can start building your financial future.

What's Next:
• Access your dashboard: https://wolvcapital.com/dashboard
• Explore investment plans
• Set up your portfolio
• Contact support if you need help

Why WolvCapital:
• Competitive returns on investments
• Bank-level security for your funds
• Professional portfolio management
• Expert guidance and support

Need assistance? Our support team is here to help:
Email: support@wolvcapital.com
Website: https://wolvcapital.com

Welcome aboard!

Best regards,
WolvCapital Support Team
"""
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content.strip(),
            from_email=from_email,
            to=[to_email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Welcome email sent successfully to {to_email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {str(e)}")
        return False


def send_verification_email(user, request=None):
    """
    Send email verification email to user using compliance email address
    """
    try:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        if request:
            domain = request.get_host()
            protocol = "https" if request.is_secure() else "http"
        else:
            domain = "localhost:8000"
            protocol = "http"
        verification_url = f"{protocol}://{domain}/verify-email/{uid}/{token}/"
        context = {"user": user, "verification_url": verification_url}
        html_content = render_to_string("emails/email_verification.html", context)
        subject = "Verify Your Email - WolvCapital"
        from_email = getattr(settings, "COMPLIANCE_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, please verify your email by clicking the link in this email.",
            from_email=from_email,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Verification email sent successfully to {user.email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False


def send_password_reset_email(user, reset_url):
    """
    Send password reset email to user using privacy email address
    """
    try:
        context = {"user": user, "reset_url": reset_url}
        html_content = render_to_string("emails/password_reset.html", context)
        subject = "Password Reset - WolvCapital"
        from_email = getattr(settings, "PRIVACY_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, click the link to reset your password: {reset_url}",
            from_email=from_email,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Password reset email sent successfully to {user.email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        return False


def send_investment_notification(user, investment_type, amount):
    """
    Send investment notification email to user using admin email address
    """
    try:
        context = {
            "user": user,
            "investment_type": investment_type,
            "amount": amount,
            "date": timezone.now(),
        }
        html_content = render_to_string("emails/investment_notification.html", context)
        subject = f"Investment Confirmation - {investment_type}"
        from_email = getattr(settings, "ADMIN_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, your {investment_type} investment of ${amount} has been processed.",
            from_email=from_email,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Investment notification sent successfully to {user.email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send investment notification to {user.email}: {str(e)}")
        return False


def send_withdrawal_notification(user, amount):
    """
    Send withdrawal notification email to user using admin email address
    """
    try:
        context = {"user": user, "amount": amount, "date": timezone.now()}
        html_content = render_to_string("emails/withdrawal_notification.html", context)
        subject = "Withdrawal Confirmation - WolvCapital"
        from_email = getattr(settings, "ADMIN_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, your withdrawal of ${amount} has been processed.",
            from_email=from_email,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Withdrawal notification sent successfully to {user.email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send withdrawal notification to {user.email}: {str(e)}")
        return False


def send_admin_alert(subject, message, admin_emails=None):
    """
    Send alert email to administrators using admin email address
    """
    try:
        if not admin_emails:
            admin_emails = [getattr(settings, "ADMIN_EMAIL", "admin@wolvcapital.com")]
        from_email = getattr(settings, "ADMIN_EMAIL", settings.DEFAULT_FROM_EMAIL)
        send_mail(
            subject=f"[WolvCapital Admin Alert] {subject}",
            message=message,
            from_email=from_email,
            recipient_list=admin_emails,
            fail_silently=False,
        )
        logger.info(f"Admin alert sent successfully: {subject} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send admin alert '{subject}': {str(e)}")
        return False


def send_marketing_email(to_email, subject, content, user_first_name=None, call_to_action_url=None):
    """
    Send marketing/promotional email using marketing email address
    """
    try:
        context = {
            "first_name": user_first_name,
            "content": content,
            "to_email": to_email,
            "subject": subject,
            "call_to_action_url": call_to_action_url,
        }
        try:
            html_content = render_to_string("emails/marketing.html", context)
        except TemplateDoesNotExist as template_error:
            logger.warning(f"Marketing template missing; using fallback HTML: {template_error}")
            html_content = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2196F3, #0D47A1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>🚀 WolvCapital</h1>
            <p>Invest Smart, Grow Fast</p>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
            <h2>Hello {user_first_name or 'Valued Investor'}!</h2>
            <div style="background: #E3F2FD; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
                {content}
            </div>
            {('<div style="text-align: center; margin: 20px 0;"><a href="' + call_to_action_url + '" style="background: #FFD700; color: #0D47A1; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Opportunities</a></div>') if call_to_action_url else ''}
            <p>Best regards,<br><strong>WolvCapital Marketing Team</strong></p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <p>📧 marketing@wolvcapital.com | 🌐 wolvcapital.com</p>
        </div>
    </div>
</body>
</html>"""
        from_email = getattr(settings, "MARKETING_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hello {user_first_name or 'Valued Investor'},\n\n{content}\n\nBest regards,\nWolvCapital Marketing Team",
            from_email=from_email,
            to=[to_email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Marketing email sent successfully to {to_email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send marketing email to {to_email}: {str(e)}")
        return False


def send_support_email(to_email, subject, message, user_first_name=None):
    """
    Send support response email using support email address
    """
    try:
        context = {"first_name": user_first_name, "message": message}
        try:
            html_content = render_to_string("emails/support_response.html", context)
        except TemplateDoesNotExist as template_error:
            logger.warning(f"Support template missing; using fallback HTML: {template_error}")
            html_content = f"<html><body><p>Hello {user_first_name or 'Valued Customer'},</p><p>{message}</p><p>Best regards,<br>WolvCapital Support Team</p></body></html>"
        from_email = getattr(settings, "SUPPORT_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=from_email,
            to=[to_email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Support email sent successfully to {to_email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send support email to {to_email}: {str(e)}")
        return False


def send_legal_notification(to_email, subject, message, user_first_name=None):
    """
    Send legal/compliance notification using legal email address
    """
    try:
        context = {"first_name": user_first_name, "message": message}
        try:
            html_content = render_to_string("emails/legal_notification.html", context)
        except TemplateDoesNotExist as template_error:
            logger.warning(f"Legal template missing; using fallback HTML: {template_error}")
            html_content = f"<html><body><p>Dear {user_first_name or 'Account Holder'},</p><p>{message}</p><p>Regards,<br>WolvCapital Legal Department</p></body></html>"
        from_email = getattr(settings, "LEGAL_EMAIL", settings.DEFAULT_FROM_EMAIL)
        msg = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=from_email,
            to=[to_email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        logger.info(f"Legal notification sent successfully to {to_email} from {from_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send legal notification to {to_email}: {str(e)}")
        return False
