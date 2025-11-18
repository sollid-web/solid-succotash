"""WolvCapital Email Service
Centralized email sending functionality with templates for all notifications
"""
import logging
from decimal import Decimal

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

logger = logging.getLogger(__name__)
User = get_user_model()

class EmailService:
    DEFAULT_FROM_EMAIL = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@wolvcapital.com')
    BRAND_NAME = getattr(settings, 'BRAND', {}).get('name', 'WolvCapital')

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
    def send_templated_email(cls, template_name: str, to_emails: str | list[str], context: dict, subject: str, from_email: str | None = None, email_type: str | None = None, user: User | None = None) -> bool:
        if isinstance(to_emails, str):
            to_emails = [to_emails]
        if from_email is None:
            from_email = cls.DEFAULT_FROM_EMAIL
        if user and email_type and not cls._should_send_email(user, email_type):
            logger.info(f"Email {email_type} skipped for user {user.email} due to preferences")
            return True
        try:
            context.update({
                'brand_name': cls.BRAND_NAME,
                'current_year': timezone.now().year,
                'brand_config': getattr(settings, 'BRAND', {}),
                'site_url': getattr(settings, 'PUBLIC_SITE_URL', getattr(settings, 'SITE_URL', 'https://wolvcapital.com')),
                'admin_site_url': getattr(settings, 'ADMIN_SITE_URL', getattr(settings, 'SITE_URL', 'https://wolvcapital.com')),
            })
            html_template = f'emails/{template_name}.html'
            html_content = render_to_string(html_template, context)
            text_template = f'emails/{template_name}.txt'
            try:
                text_content = render_to_string(text_template, context)
            except Exception:
                import re
                text_content = re.sub(r'<[^>]+>', '', html_content)
                text_content = re.sub(r'\s+', ' ', text_content).strip()
            msg = EmailMultiAlternatives(subject=subject, body=text_content, from_email=from_email, to=to_emails)
            msg.attach_alternative(html_content, "text/html")
            result = msg.send()
            if result:
                logger.info(f"Email sent successfully: {email_type} to {to_emails}")
                return True
            logger.error(f"Failed to send email: {email_type} to {to_emails}")
            return False
        except Exception as e:
            logger.error(f"Error sending email {email_type} to {to_emails}: {str(e)}")
            return False

    @classmethod
    def _should_send_email(cls, user: User, email_type: str) -> bool:
        if hasattr(user, 'profile') and hasattr(user.profile, 'email_preferences'):
            preferences = user.profile.email_preferences
            return preferences.get(email_type, True)
        return True

    @classmethod
    def send_welcome_email(cls, user: User) -> bool:
        context = {'user': user, 'dashboard_url': '/dashboard/', 'plans_url': '/plans/'}
        return cls.send_templated_email(template_name='welcome', to_emails=user.email, context=context, subject=f'Welcome to {cls.BRAND_NAME}!', email_type=cls.EMAIL_TYPES['WELCOME'], user=user)

    @classmethod
    def send_transaction_notification(cls, transaction, status: str, admin_notes: str = '') -> bool:
        user = transaction.user
        if status == 'created':
            template = 'transaction_created'; subject = f'Transaction Submitted - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['TRANSACTION_CREATED']
        elif status == 'approved':
            template = 'transaction_approved'; subject = f'Transaction Approved - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['TRANSACTION_APPROVED']
        elif status == 'rejected':
            template = 'transaction_rejected'; subject = f'Transaction Rejected - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['TRANSACTION_REJECTED']
        else:
            logger.warning(f"Unknown transaction status: {status}"); return False
        context = {'user': user, 'transaction': transaction, 'admin_notes': admin_notes, 'dashboard_url': '/dashboard/'}
        return cls.send_templated_email(template_name=template, to_emails=user.email, context=context, subject=subject, email_type=email_type, user=user)

    @classmethod
    def send_investment_notification(cls, investment, status: str, admin_notes: str = '') -> bool:
        user = investment.user
        if status == 'created':
            template = 'investment_created'; subject = f'Investment Submitted - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['INVESTMENT_CREATED']
        elif status == 'approved':
            template = 'investment_approved'; subject = f'Investment Approved - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['INVESTMENT_APPROVED']
        elif status == 'rejected':
            template = 'investment_rejected'; subject = f'Investment Rejected - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['INVESTMENT_REJECTED']
        elif status == 'completed':
            template = 'investment_completed'; subject = f'Investment Completed - {cls.BRAND_NAME}'; email_type = cls.EMAIL_TYPES['INVESTMENT_COMPLETED']
        else:
            logger.warning(f"Unknown investment status: {status}"); return False
        context = {'user': user, 'investment': investment, 'admin_notes': admin_notes, 'dashboard_url': '/dashboard/'}
        return cls.send_templated_email(template_name=template, to_emails=user.email, context=context, subject=subject, email_type=email_type, user=user)

    @classmethod
    def send_test_email(cls, to_email: str) -> bool:
        context = {'test_timestamp': timezone.now()}
        return cls.send_templated_email(template_name='test_email', to_emails=to_email, context=context, subject=f'Test Email - {cls.BRAND_NAME}', email_type='test')
