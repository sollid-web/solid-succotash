"""
WolvCapital Email Service
Centralized email sending functionality with templates for all notifications
"""

import logging
from decimal import Decimal
from typing import Dict, List, Optional, Union

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import get_template, render_to_string
from django.utils import timezone
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()


class EmailService:
    """
    Centralized email service for WolvCapital platform
    Handles all email sending with HTML/text templates
    """
    
    DEFAULT_FROM_EMAIL = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@wolvcapital.com')
    BRAND_NAME = getattr(settings, 'BRAND', {}).get('name', 'WolvCapital')
    
    # Email types for tracking and preferences
    EMAIL_TYPES = {
        'WELCOME': 'welcome',
        'TRANSACTION_CREATED': 'transaction_created',
        'TRANSACTION_APPROVED': 'transaction_approved',
        'TRANSACTION_REJECTED': 'transaction_rejected',
        'INVESTMENT_CREATED': 'investment_created',
        'INVESTMENT_APPROVED': 'investment_approved',
        'INVESTMENT_REJECTED': 'investment_rejected',
        'INVESTMENT_COMPLETED': 'investment_completed',
        'ROI_PAYOUT': 'roi_payout',
        'WALLET_CREDITED': 'wallet_credited',
        'WALLET_DEBITED': 'wallet_debited',
        'CARD_APPROVED': 'card_approved',
        'CARD_REJECTED': 'card_rejected',
        'PASSWORD_RESET': 'password_reset',
        'SECURITY_ALERT': 'security_alert',
        'ADMIN_ALERT': 'admin_alert',
        'SYSTEM_MAINTENANCE': 'system_maintenance',
    }
    
    @classmethod
    def send_templated_email(
        cls,
        template_name: str,
        to_emails: Union[str, List[str]],
        context: Dict,
        subject: str,
        from_email: Optional[str] = None,
        email_type: Optional[str] = None,
        user: Optional[User] = None
    ) -> bool:
        """
        Send an email using HTML and text templates
        
        Args:
            template_name: Base template name (without extension)
            to_emails: Recipient email(s)
            context: Template context dictionary
            subject: Email subject
            from_email: Sender email (defaults to DEFAULT_FROM_EMAIL)
            email_type: Type of email for preference checking
            user: User object to check email preferences
            
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        if isinstance(to_emails, str):
            to_emails = [to_emails]
            
        if from_email is None:
            from_email = cls.DEFAULT_FROM_EMAIL
            
        # Check user email preferences if provided
        if user and email_type and not cls._should_send_email(user, email_type):
            logger.info(f"Email {email_type} skipped for user {user.email} due to preferences")
            return True  # Not an error, user opted out
        
        try:
            # Add common context variables
            context.update({
                'brand_name': cls.BRAND_NAME,
                'current_year': timezone.now().year,
                'brand_config': getattr(settings, 'BRAND', {}),
                'site_url': getattr(settings, 'PUBLIC_SITE_URL', getattr(settings, 'SITE_URL', 'https://wolvcapital.com')),
            })
            
            # Render HTML template
            html_template = f'emails/{template_name}.html'
            html_content = render_to_string(html_template, context)
            
            # Render text template (fallback)
            text_template = f'emails/{template_name}.txt'
            try:
                text_content = render_to_string(text_template, context)
            except:
                # Generate basic text from HTML if text template doesn't exist
                text_content = cls._html_to_text(html_content)
            
            # Create email message
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=to_emails
            )
            msg.attach_alternative(html_content, "text/html")
            
            # Send email
            result = msg.send()
            
            if result:
                logger.info(f"Email sent successfully: {email_type} to {to_emails}")
                return True
            else:
                logger.error(f"Failed to send email: {email_type} to {to_emails}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending email {email_type} to {to_emails}: {str(e)}")
            return False
    
    @classmethod
    def _should_send_email(cls, user: User, email_type: str) -> bool:
        """
        Check if user has opted in for this type of email
        For now, returns True (all emails enabled)
        TODO: Implement user email preferences
        """
        # Check if user has email preferences model/field
        if hasattr(user, 'profile') and hasattr(user.profile, 'email_preferences'):
            preferences = user.profile.email_preferences
            return preferences.get(email_type, True)  # Default to True
        return True  # Send all emails by default
    
    @classmethod
    def _html_to_text(cls, html_content: str) -> str:
        """
        Simple HTML to text conversion
        """
        import re
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', html_content)
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    # Convenience methods for common email types
    
    @classmethod
    def send_welcome_email(cls, user: User) -> bool:
        """Send welcome email to new user"""
        context = {
            'user': user,
            'dashboard_url': '/dashboard/',
            'plans_url': '/plans/',
        }
        return cls.send_templated_email(
            template_name='welcome',
            to_emails=user.email,
            context=context,
            subject=f'Welcome to {cls.BRAND_NAME}!',
            email_type=cls.EMAIL_TYPES['WELCOME'],
            user=user
        )
    
    @classmethod
    def send_transaction_notification(cls, transaction, status: str, admin_notes: str = '') -> bool:
        """Send transaction status notification"""
        user = transaction.user
        
        if status == 'created':
            template = 'transaction_created'
            subject = f'Transaction Submitted - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['TRANSACTION_CREATED']
        elif status == 'approved':
            template = 'transaction_approved'
            subject = f'Transaction Approved - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['TRANSACTION_APPROVED']
        elif status == 'rejected':
            template = 'transaction_rejected'
            subject = f'Transaction Rejected - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['TRANSACTION_REJECTED']
        else:
            logger.warning(f"Unknown transaction status: {status}")
            return False
        
        context = {
            'user': user,
            'transaction': transaction,
            'admin_notes': admin_notes,
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name=template,
            to_emails=user.email,
            context=context,
            subject=subject,
            email_type=email_type,
            user=user
        )
    
    @classmethod
    def send_investment_notification(cls, investment, status: str, admin_notes: str = '') -> bool:
        """Send investment status notification"""
        user = investment.user
        
        if status == 'created':
            template = 'investment_created'
            subject = f'Investment Submitted - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['INVESTMENT_CREATED']
        elif status == 'approved':
            template = 'investment_approved'
            subject = f'Investment Approved - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['INVESTMENT_APPROVED']
        elif status == 'rejected':
            template = 'investment_rejected'
            subject = f'Investment Rejected - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['INVESTMENT_REJECTED']
        elif status == 'completed':
            template = 'investment_completed'
            subject = f'Investment Completed - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['INVESTMENT_COMPLETED']
        else:
            logger.warning(f"Unknown investment status: {status}")
            return False
        
        context = {
            'user': user,
            'investment': investment,
            'admin_notes': admin_notes,
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name=template,
            to_emails=user.email,
            context=context,
            subject=subject,
            email_type=email_type,
            user=user
        )
    
    @classmethod
    def send_roi_payout_notification(cls, user: User, amount: Decimal, investment, payout_date) -> bool:
        """Send ROI payout notification"""
        context = {
            'user': user,
            'amount': amount,
            'investment': investment,
            'payout_date': payout_date,
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name='roi_payout',
            to_emails=user.email,
            context=context,
            subject=f'ROI Payout Received - {cls.BRAND_NAME}',
            email_type=cls.EMAIL_TYPES['ROI_PAYOUT'],
            user=user
        )
    
    @classmethod
    def send_wallet_notification(cls, user: User, amount: Decimal, action: str, reason: str = '') -> bool:
        """Send wallet credit/debit notification"""
        if action == 'credited':
            template = 'wallet_credited'
            subject = f'Wallet Credited - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['WALLET_CREDITED']
        elif action == 'debited':
            template = 'wallet_debited'
            subject = f'Wallet Debited - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['WALLET_DEBITED']
        else:
            logger.warning(f"Unknown wallet action: {action}")
            return False
        
        context = {
            'user': user,
            'amount': amount,
            'reason': reason,
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name=template,
            to_emails=user.email,
            context=context,
            subject=subject,
            email_type=email_type,
            user=user
        )
    
    @classmethod
    def send_virtual_card_notification(cls, user: User, card, status: str, admin_notes: str = '') -> bool:
        """Send virtual card status notification"""
        if status == 'approved':
            template = 'card_approved'
            subject = f'Virtual Card Approved - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['CARD_APPROVED']
        elif status == 'rejected':
            template = 'card_rejected'
            subject = f'Virtual Card Rejected - {cls.BRAND_NAME}'
            email_type = cls.EMAIL_TYPES['CARD_REJECTED']
        else:
            logger.warning(f"Unknown card status: {status}")
            return False
        
        context = {
            'user': user,
            'card': card,
            'admin_notes': admin_notes,
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name=template,
            to_emails=user.email,
            context=context,
            subject=subject,
            email_type=email_type,
            user=user
        )
    
    @classmethod
    def send_security_alert(cls, user: User, alert_type: str, details: str) -> bool:
        """Send security alert email"""
        context = {
            'user': user,
            'alert_type': alert_type,
            'details': details,
            'timestamp': timezone.now(),
            'dashboard_url': '/dashboard/',
        }
        
        return cls.send_templated_email(
            template_name='security_alert',
            to_emails=user.email,
            context=context,
            subject=f'Security Alert - {cls.BRAND_NAME}',
            email_type=cls.EMAIL_TYPES['SECURITY_ALERT'],
            user=user
        )
    
    @classmethod
    def send_admin_alert(cls, subject: str, message: str, admin_emails: List[str] = None) -> bool:
        """Send alert to administrators"""
        if admin_emails is None:
            # Get all admin users
            admin_users = User.objects.filter(is_staff=True, is_active=True)
            admin_emails = [user.email for user in admin_users if user.email]
        
        if not admin_emails:
            logger.warning("No admin emails found for alert")
            return False
        
        context = {
            'message': message,
            'timestamp': timezone.now(),
            'admin_url': '/admin/',
        }
        
        return cls.send_templated_email(
            template_name='admin_alert',
            to_emails=admin_emails,
            context=context,
            subject=f'[ADMIN ALERT] {subject} - {cls.BRAND_NAME}',
            email_type=cls.EMAIL_TYPES['ADMIN_ALERT']
        )
    
    @classmethod
    def send_test_email(cls, to_email: str) -> bool:
        """Send a test email to verify configuration"""
        context = {
            'test_timestamp': timezone.now(),
        }
        
        return cls.send_templated_email(
            template_name='test_email',
            to_emails=to_email,
            context=context,
            subject=f'Test Email - {cls.BRAND_NAME}',
            email_type='test'
        )


# Convenience function for quick email sending
def send_email(template_name: str, to_emails: Union[str, List[str]], context: Dict, subject: str, **kwargs) -> bool:
    """
    Quick wrapper function for sending templated emails
    """
    return EmailService.send_templated_email(
        template_name=template_name,
        to_emails=to_emails,
        context=context,
        subject=subject,
        **kwargs
    )