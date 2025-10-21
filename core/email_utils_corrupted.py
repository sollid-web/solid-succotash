""""""

WolvCapital Django Email Utilities for SendGrid IntegrationEmail utilities for WolvCapital

Provides functions for sending various types of emails using SendGrid

This module provides email functions for user notifications, welcome messages,"""

and email verification using SendGrid as the email backend.

"""from django.core.mail import EmailMultiAlternatives, send_mail

from django.template.loader import render_to_string

import loggingfrom django.contrib.auth.tokens import default_token_generator

from django.conf import settingsfrom django.utils.http import urlsafe_base64_encode

from django.core.mail import send_mail, EmailMultiAlternativesfrom django.utils.encoding import force_bytes

from django.template.loader import render_to_stringfrom django.urls import reverse

from django.contrib.auth.tokens import default_token_generatorfrom django.conf import settings

from django.utils.http import urlsafe_base64_encodefrom django.utils import timezone

from django.utils.encoding import force_bytesimport logging



logger = logging.getLogger(__name__)logger = logging.getLogger(__name__)





def send_test_email(recipient_email, subject=None, message=None):def send_welcome_email(to_email, first_name):

    """    """

    Send a test email to verify SendGrid configuration    Send a welcome email to a new user

        

    Args:    Args:

        recipient_email (str): Email address to send test email to        to_email (str): Recipient email address

        subject (str, optional): Custom subject line        first_name (str): User's first name

        message (str, optional): Custom message content    """

        try:

    Returns:        context = {

        bool: True if email sent successfully, False otherwise            "first_name": first_name,

    """        }

    try:        

        subject = subject or "Test Email - WolvCapital SendGrid Configuration"        # Render HTML template

        message = message or """        html_content = render_to_string("emails/welcome.html", context)

    This is a test email from WolvCapital.        

        # Create email message

    If you receive this email, SendGrid is configured correctly!        msg = EmailMultiAlternatives(

            subject="Welcome to WolvCapital - Your Account is Ready",

    - Email Backend: SendGrid            body="Welcome to WolvCapital! Your email client does not support HTML emails. Please contact support for assistance.",

    - From: {from_email}            from_email=settings.DEFAULT_FROM_EMAIL,

    - Sent at: {timestamp}            to=[to_email],

        )

    Best regards,        

    WolvCapital Team        # Attach HTML version

        """.format(        msg.attach_alternative(html_content, "text/html")

            from_email=settings.DEFAULT_FROM_EMAIL,        

            timestamp=str(timezone.now()) if 'timezone' in globals() else 'now'        # Send email

        )        msg.send()

                

        result = send_mail(        logger.info(f"Welcome email sent successfully to {to_email}")

            subject=subject,        return True

            message=message,        

            from_email=settings.DEFAULT_FROM_EMAIL,    except Exception as e:

            recipient_list=[recipient_email],        logger.error(f"Failed to send welcome email to {to_email}: {str(e)}")

            fail_silently=False,        return False

        )

        

        if result:def send_verification_email(user, request):

            logger.info(f"Simple email sent successfully to {recipient_email}")    """

            return True    Send email verification link to user

        else:    

            logger.error(f"Failed to send email to {recipient_email}")    Args:

            return False        user: User instance

                    request: Django request object

    except Exception as e:    """

        logger.error(f"Error sending test email: {str(e)}")    try:

        return False        # Generate verification token

        uid = urlsafe_base64_encode(force_bytes(user.pk))

        token = default_token_generator.make_token(user)

def send_welcome_email(recipient_email, first_name="User"):        

    """        # Build verification URL

    Send a welcome email to new users using HTML template        verification_url = request.build_absolute_uri(

                reverse("verify-email", args=[uid, token])

    Args:        )

        recipient_email (str): Email address of the new user        

        first_name (str): User's first name for personalization        context = {

                "first_name": user.first_name or user.username,

    Returns:            "verification_url": verification_url,

        bool: True if email sent successfully, False otherwise        }

    """        

    try:        # Render HTML template

        subject = "Welcome to WolvCapital - Your Account is Ready"        html_content = render_to_string("emails/verify_email.html", context)

                

        # Render HTML template        # Create email message

        html_content = render_to_string('emails/welcome.html', {        msg = EmailMultiAlternatives(

            'first_name': first_name,            subject="Verify Your Email - WolvCapital",

            'user_email': recipient_email,            body=f"Please verify your email by clicking this link: {verification_url}",

        })            from_email=settings.DEFAULT_FROM_EMAIL,

                    to=[user.email],

        # Plain text fallback        )

        text_content = f"""        

        Welcome to WolvCapital, {first_name}!        # Attach HTML version

                msg.attach_alternative(html_content, "text/html")

        Your account has been successfully created. You can now access our platform        

        to manage your investments, deposits, and withdrawals.        # Send email

                msg.send()

        Visit: http://127.0.0.1:8000/dashboard/        

                logger.info(f"Verification email sent successfully to {user.email}")

        Best regards,        return True

        WolvCapital Team        

        """    except Exception as e:

                logger.error(f"Failed to send verification email to {user.email}: {str(e)}")

        # Send multipart email        return False

        email = EmailMultiAlternatives(

            subject=subject,

            body=text_content.strip(),def send_simple_email(subject, message, to_email, from_email=None):

            from_email=settings.DEFAULT_FROM_EMAIL,    """

            to=[recipient_email]    Send a simple text email

        )    

            Args:

        # Attach HTML version        subject (str): Email subject

        email.attach_alternative(html_content, "text/html")        message (str): Email message

                to_email (str): Recipient email

        result = email.send()        from_email (str, optional): Sender email (uses DEFAULT_FROM_EMAIL if None)

            """

        if result:    try:

            logger.info(f"Welcome email sent successfully to {recipient_email}")        send_mail(

            return True            subject=subject,

        else:            message=message,

            logger.error(f"Failed to send welcome email to {recipient_email}")            from_email=from_email or settings.DEFAULT_FROM_EMAIL,

            return False            recipient_list=[to_email],

                        fail_silently=False,

    except Exception as e:        )

        logger.error(f"Error sending welcome email: {str(e)}")        

        return False        logger.info(f"Simple email sent successfully to {to_email}")

        return True

        

def send_verification_email(user, request):    except Exception as e:

    """        logger.error(f"Failed to send simple email to {to_email}: {str(e)}")

    Send email verification link to user        return False

    

    Args:

        user: User model instancedef send_test_email(to_email):

        request: Django request object for building absolute URLs    """

        Send a test email to verify SendGrid configuration

    Returns:    

        bool: True if email sent successfully, False otherwise    Args:

    """        to_email (str): Test recipient email

    try:    """

        # Generate verification token    subject = "Test Email - WolvCapital SendGrid Configuration"

        token = default_token_generator.make_token(user)    message = """

        uid = urlsafe_base64_encode(force_bytes(user.pk))    This is a test email from WolvCapital.

            

        # Build verification URL    If you receive this email, SendGrid is configured correctly!

        verification_url = request.build_absolute_uri(    

            f"/verify/{uid}/{token}/"    - Email Backend: SendGrid

        )    - From: {from_email}

            - Sent at: {timestamp}

        subject = "Verify Your Email - WolvCapital"    

            Best regards,

        # Render HTML template    WolvCapital Team

        html_content = render_to_string('emails/verify_email.html', {    """.format(

            'user': user,        from_email=settings.DEFAULT_FROM_EMAIL,

            'verification_url': verification_url,        timestamp=str(timezone.now())

        })    )

            

        # Plain text fallback    return send_simple_email(subject, message, to_email)

        text_content = f"""

        Hi {user.first_name or user.username},

        def send_password_reset_email(user, reset_link):

        Please verify your email address by clicking the link below:    """

            Send password reset email

        {verification_url}    

            Args:

        If you didn't create an account, please ignore this email.        user: User instance

                reset_link (str): Password reset URL

        Best regards,    """

        WolvCapital Team    subject = "Password Reset - WolvCapital"

        """    message = f"""

            Hello {user.first_name or user.username},

        # Send multipart email    

        email = EmailMultiAlternatives(    You requested a password reset for your WolvCapital account.

            subject=subject,    

            body=text_content.strip(),    Click the link below to reset your password:

            from_email=settings.DEFAULT_FROM_EMAIL,    {reset_link}

            to=[user.email]    

        )    This link will expire in 24 hours for security reasons.

            

        # Attach HTML version    If you did not request this reset, please ignore this email and contact support.

        email.attach_alternative(html_content, "text/html")    

            Best regards,

        result = email.send()    WolvCapital Security Team

            """

        if result:    

            logger.info(f"Verification email sent successfully to {user.email}")    return send_simple_email(subject, message, user.email)

            return True

        else:

            logger.error(f"Failed to send verification email to {user.email}")def send_transaction_notification(user, transaction_type, amount, status):

            return False    """

                Send transaction notification email

    except Exception as e:    

        logger.error(f"Error sending verification email: {str(e)}")    Args:

        return False        user: User instance
        transaction_type (str): Type of transaction (deposit, withdrawal, investment)
        amount (str): Transaction amount
        status (str): Transaction status
    """
    subject = f"Transaction {status.title()} - WolvCapital"
    message = f"""
    Hello {user.first_name or user.username},
    
    Your {transaction_type} transaction has been {status}.
    
    Transaction Details:
    - Type: {transaction_type.title()}
    - Amount: {amount}
    - Status: {status.title()}
    - Time: {timezone.now()}
    
    You can view full transaction details in your dashboard.
    
    Best regards,
    WolvCapital Team
    """
    
    return send_simple_email(subject, message, user.email)