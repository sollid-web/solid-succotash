#!/usr/bin/env python
"""Test email sending functionality"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from core.email_service import EmailService
from django.conf import settings

def test_email_config():
    """Display current email configuration"""
    print('='*60)
    print('EMAIL CONFIGURATION')
    print('='*60)
    print(f'EMAIL_BACKEND: {settings.EMAIL_BACKEND}')
    print(f'EMAIL_HOST: {getattr(settings, "EMAIL_HOST", "Not configured")}')
    print(f'EMAIL_PORT: {getattr(settings, "EMAIL_PORT", "Not configured")}')
    print(f'EMAIL_USE_TLS: {getattr(settings, "EMAIL_USE_TLS", False)}')
    print(f'EMAIL_HOST_USER: {getattr(settings, "EMAIL_HOST_USER", "Not configured")}')
    print(f'DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}')
    print()

def test_welcome_email():
    """Test sending a welcome email"""
    print('='*60)
    print('TESTING WELCOME EMAIL')
    print('='*60)
    
    test_recipient = input('Enter recipient email address: ').strip()
    if not test_recipient:
        print('No email provided, using test@example.com')
        test_recipient = 'test@example.com'
    
    print(f'\nSending welcome email to: {test_recipient}')
    
    try:
        result = EmailService.send_welcome_email(
            user_email=test_recipient,
            user_name='Test User'
        )
        
        if result:
            print('✓ Welcome email sent successfully!')
            if 'console' in settings.EMAIL_BACKEND.lower():
                print('\n(Check console output above for email content)')
        else:
            print('✗ Email sending failed')
            
    except Exception as e:
        print(f'✗ Error sending email: {e}')
        import traceback
        traceback.print_exc()

def test_transaction_email():
    """Test sending a transaction notification"""
    print('='*60)
    print('TESTING TRANSACTION EMAIL')
    print('='*60)
    
    test_recipient = input('Enter recipient email address: ').strip()
    if not test_recipient:
        print('No email provided, using test@example.com')
        test_recipient = 'test@example.com'
    
    print(f'\nSending transaction approval email to: {test_recipient}')
    
    try:
        result = EmailService.send_transaction_approved_email(
            user_email=test_recipient,
            user_name='Test User',
            transaction_type='deposit',
            amount='1000.00',
            reference='TEST-12345'
        )
        
        if result:
            print('✓ Transaction email sent successfully!')
            if 'console' in settings.EMAIL_BACKEND.lower():
                print('\n(Check console output above for email content)')
        else:
            print('✗ Email sending failed')
            
    except Exception as e:
        print(f'✗ Error sending email: {e}')
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    print('\n' + '='*60)
    print('WOLVCAPITAL EMAIL SERVICE TEST')
    print('='*60 + '\n')
    
    test_email_config()
    
    print('\nSelect test to run:')
    print('1. Welcome Email')
    print('2. Transaction Approval Email')
    print('3. Both')
    
    choice = input('\nEnter choice (1-3): ').strip()
    print()
    
    if choice == '1':
        test_welcome_email()
    elif choice == '2':
        test_transaction_email()
    elif choice == '3':
        test_welcome_email()
        print()
        test_transaction_email()
    else:
        print('Invalid choice')
    
    print('\n' + '='*60)
    print('TEST COMPLETE')
    print('='*60)
