"""
WolvCapital Django Email Utilities for SendGrid Integration

This module provides email functions for user notifications, welcome messages,
and email verification using SendGrid as the email backend.
"""

from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


def send_test_email(recipient_email, subject=None, message=None):
    """
    Send a test email to verify SendGrid configuration
    
    Args:
        recipient_email (str): Email address to send test email to
        subject (str, optional): Custom subject line
        message (str, optional): Custom message content
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        subject = subject or "Test Email - WolvCapital SendGrid Configuration"
        message = message or """
        Hello!
        
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


def send_welcome_email(to_email, first_name):
    """
    Send a welcome email to a new user
    
    Args:
        to_email (str): Recipient email address
        first_name (str): User's first name
    """
    try:
        context = {
            "first_name": first_name,
        }
        
        # Render HTML template
        html_content = render_to_string("emails/welcome.html", context)
        
        # Create email message
        subject = "Welcome to WolvCapital - Your Investment Journey Begins!"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Welcome {first_name}! Thanks for joining WolvCapital.",
            from_email=from_email,
            to=[to_email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Welcome email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send welcome email to {to_email}: {str(e)}")
        return False


def send_verification_email(user, request=None):
    """
    Send email verification email to user
    
    Args:
        user: Django User object
        request: HTTP request object (optional)
    """
    try:
        # Generate verification token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build verification URL
        if request:
            domain = request.get_host()
            protocol = 'https' if request.is_secure() else 'http'
        else:
            domain = 'localhost:8000'  # fallback for testing
            protocol = 'http'
        
        verification_url = f"{protocol}://{domain}/verify-email/{uid}/{token}/"
        
        context = {
            "user": user,
            "verification_url": verification_url,
        }
        
        # Render HTML template
        html_content = render_to_string("emails/email_verification.html", context)
        
        # Create email message
        subject = "Verify Your Email - WolvCapital"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, please verify your email by clicking the link in this email.",
            from_email=from_email,
            to=[user.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Verification email sent successfully to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {str(e)}")
        return False


def send_password_reset_email(user, reset_url):
    """
    Send password reset email to user
    
    Args:
        user: Django User object
        reset_url (str): Password reset URL
    """
    try:
        context = {
            "user": user,
            "reset_url": reset_url,
        }
        
        # Render HTML template
        html_content = render_to_string("emails/password_reset.html", context)
        
        # Create email message
        subject = "Password Reset - WolvCapital"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, click the link to reset your password: {reset_url}",
            from_email=from_email,
            to=[user.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Password reset email sent successfully to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send password reset email to {user.email}: {str(e)}")
        return False


def send_investment_notification(user, investment_type, amount):
    """
    Send investment notification email to user
    
    Args:
        user: Django User object
        investment_type (str): Type of investment
        amount (float): Investment amount
    """
    try:
        context = {
            "user": user,
            "investment_type": investment_type,
            "amount": amount,
            "date": timezone.now(),
        }
        
        # Render HTML template
        html_content = render_to_string("emails/investment_notification.html", context)
        
        # Create email message
        subject = f"Investment Confirmation - {investment_type}"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, your {investment_type} investment of ${amount} has been processed.",
            from_email=from_email,
            to=[user.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Investment notification sent successfully to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send investment notification to {user.email}: {str(e)}")
        return False


def send_withdrawal_notification(user, amount):
    """
    Send withdrawal notification email to user
    
    Args:
        user: Django User object
        amount (float): Withdrawal amount
    """
    try:
        context = {
            "user": user,
            "amount": amount,
            "date": timezone.now(),
        }
        
        # Render HTML template
        html_content = render_to_string("emails/withdrawal_notification.html", context)
        
        # Create email message
        subject = "Withdrawal Confirmation - WolvCapital"
        from_email = settings.DEFAULT_FROM_EMAIL
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=f"Hi {user.first_name}, your withdrawal of ${amount} has been processed.",
            from_email=from_email,
            to=[user.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Withdrawal notification sent successfully to {user.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send withdrawal notification to {user.email}: {str(e)}")
        return False


def send_admin_alert(subject, message, admin_emails=None):
    """
    Send alert email to administrators
    
    Args:
        subject (str): Email subject
        message (str): Email message
        admin_emails (list, optional): List of admin emails. Uses settings.ADMIN_EMAIL if not provided
    """
    try:
        if not admin_emails:
            admin_emails = [getattr(settings, 'ADMIN_EMAIL', 'admin@wolvcapital.com')]
        
        send_mail(
            subject=f"[WolvCapital Admin Alert] {subject}",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=admin_emails,
            fail_silently=False,
        )
        
        logger.info(f"Admin alert sent successfully: {subject}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send admin alert '{subject}': {str(e)}")
        return False