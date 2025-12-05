"""
Test script for Business Email Inbox system
Creates sample inbox data for testing
"""

import os

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from datetime import timedelta

from django.utils import timezone

from core.models import EmailInbox, EmailTemplate
from users.models import User


def create_test_data():
    """Create test emails and templates."""

    print("🚀 Creating test data for Business Email Inbox...")

    # Get or create admin user - use first superuser or any staff user
    admin_user = User.objects.filter(is_staff=True).first()

    if not admin_user:
        # Create a test admin user with unique username
        import uuid

        from django.contrib.auth.hashers import make_password
        username = f"admin_{uuid.uuid4().hex[:8]}"
        admin_user = User.objects.create(
            username=username,
            email='admin@test.com',
            password=make_password('admin123'),
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        print(f"✓ Created admin user: {admin_user.email}")
        print(f"   Username: {username}")
        print("   Password: admin123")
    else:
        print(f"✓ Using admin: {admin_user.email}")

    # Sample emails
    test_emails = [
        {
            'message_id': 'test-001@wolvcapital.com',
            'subject': 'Investment Inquiry - High Net Worth Client',
            'from_email': 'john.smith@example.com',
            'from_name': 'John Smith',
            'to_email': 'support@wolvcapital.com',
            'body_text': '''Hello,

I am interested in your investment plans. I have approximately $50,000 to invest and would like to know more about the Summit plan.

Could you please provide:
1. Expected ROI timeline
2. Risk assessment
3. Withdrawal terms
4. Minimum lock-in period

Looking forward to your response.

Best regards,
John Smith
CEO, Tech Innovations Inc.''',
            'received_at': timezone.now() - timedelta(hours=2),
            'status': EmailInbox.STATUS_UNREAD,
            'priority': EmailInbox.PRIORITY_HIGH,
            'is_starred': True,
        },
        {
            'message_id': 'test-002@wolvcapital.com',
            'subject': 'Question about withdrawal process',
            'from_email': 'sarah.jones@example.com',
            'from_name': 'Sarah Jones',
            'to_email': 'support@wolvcapital.com',
            'body_text': '''Hi Support Team,

I submitted a withdrawal request 3 days ago (Reference: WD-12345) but haven\'t received confirmation yet.

Can you please check the status?

Thanks,
Sarah Jones''',
            'received_at': timezone.now() - timedelta(days=1),
            'status': EmailInbox.STATUS_READ,
            'priority': EmailInbox.PRIORITY_NORMAL,
            'assigned_to': admin_user,
            'read_at': timezone.now() - timedelta(hours=12),
        },
        {
            'message_id': 'test-003@wolvcapital.com',
            'subject': 'Account verification issue',
            'from_email': 'mike.wilson@example.com',
            'from_name': 'Mike Wilson',
            'to_email': 'support@wolvcapital.com',
            'cc': 'admin@wolvcapital.com',
            'body_text': '''Dear WolvCapital,

I\'ve been trying to verify my account for the past 24 hours but the verification email never arrives.

I\'ve checked spam folder and all email settings. Please help!

Account email: mike.wilson@example.com

Thanks,
Mike''',
            'received_at': timezone.now() - timedelta(hours=5),
            'status': EmailInbox.STATUS_UNREAD,
            'priority': EmailInbox.PRIORITY_URGENT,
            'is_starred': True,
        },
        {
            'message_id': 'test-004@wolvcapital.com',
            'subject': 'Partnership Opportunity',
            'from_email': 'business@investmentfirm.com',
            'from_name': 'Investment Partners LLC',
            'to_email': 'admin@wolvcapital.com',
            'body_text': '''Hello WolvCapital Team,

We represent a group of high net worth individuals interested in your investment platform.

We would like to discuss:
- Bulk investment options
- Custom investment plans
- Partnership opportunities

Please schedule a call at your earliest convenience.

Best regards,
Investment Partners LLC''',
            'received_at': timezone.now() - timedelta(days=2),
            'status': EmailInbox.STATUS_REPLIED,
            'priority': EmailInbox.PRIORITY_HIGH,
            'replied_at': timezone.now() - timedelta(days=1),
            'assigned_to': admin_user,
        },
        {
            'message_id': 'test-005@wolvcapital.com',
            'subject': 'Suspicious login attempt',
            'from_email': 'security@wolvcapital.com',
            'from_name': 'WolvCapital Security',
            'to_email': 'admin@wolvcapital.com',
            'body_text': '''SECURITY ALERT

Suspicious login detected:
- IP: 192.168.1.100
- Location: Unknown
- Time: 2 hours ago
- User: investor@example.com

Please review immediately.

WolvCapital Security System''',
            'received_at': timezone.now() - timedelta(minutes=30),
            'status': EmailInbox.STATUS_READ,
            'priority': EmailInbox.PRIORITY_URGENT,
            'is_starred': True,
            'assigned_to': admin_user,
            'read_at': timezone.now() - timedelta(minutes=15),
        },
        {
            'message_id': 'test-006@wolvcapital.com',
            'subject': 'Monthly newsletter subscription',
            'from_email': 'newsletter@example.com',
            'from_name': 'Newsletter Subscriber',
            'to_email': 'support@wolvcapital.com',
            'body_text': 'Please add me to your monthly investment newsletter. Thanks!',
            'received_at': timezone.now() - timedelta(days=3),
            'status': EmailInbox.STATUS_ARCHIVED,
            'priority': EmailInbox.PRIORITY_LOW,
        },
    ]

    created_count = 0
    for email_data in test_emails:
        email, created = EmailInbox.objects.get_or_create(
            message_id=email_data['message_id'],
            defaults=email_data
        )
        if created:
            created_count += 1
            status_icon = '🌟' if email.is_starred else '📧'
            print(f"{status_icon} Created: {email.subject[:50]}")

    print(f"\n✓ Created {created_count} test emails")

    # Create email templates
    templates = [
        {
            'name': 'Welcome Email',
            'category': 'Onboarding',
            'subject': 'Welcome to WolvCapital!',
            'body': '''Dear {{name}},

Welcome to WolvCapital! We're excited to have you join our investment platform.

Your account has been successfully created. You can now:
- Browse our investment plans
- Make deposits
- Track your portfolio

If you have any questions, our support team is here to help 24/7.

Best regards,
WolvCapital Team''',
        },
        {
            'name': 'Withdrawal Approved',
            'category': 'Transactions',
            'subject': 'Withdrawal Request Approved - {{reference}}',
            'body': '''Dear {{name}},

Great news! Your withdrawal request has been approved.

Details:
- Reference: {{reference}}
- Amount: ${{amount}}
- Expected arrival: 2-3 business days

You'll receive a confirmation email once the transfer is complete.

Best regards,
WolvCapital Finance Team''',
        },
        {
            'name': 'Investment Confirmation',
            'category': 'Investments',
            'subject': 'Investment Confirmed - {{plan_name}}',
            'body': '''Dear {{name}},

Your investment has been successfully confirmed!

Investment Details:
- Plan: {{plan_name}}
- Amount: ${{amount}}
- Start Date: {{start_date}}
- Expected Returns: {{roi}}%

Thank you for trusting WolvCapital with your investment.

Best regards,
WolvCapital Investment Team''',
        },
        {
            'name': 'Support Response',
            'category': 'Support',
            'subject': 'Re: {{original_subject}}',
            'body': '''Dear {{name}},

Thank you for contacting WolvCapital support.

{{response_text}}

If you have any additional questions, please don't hesitate to reach out.

Best regards,
{{agent_name}}
WolvCapital Support Team''',
        },
    ]

    template_count = 0
    for template_data in templates:
        template, created = EmailTemplate.objects.get_or_create(
            name=template_data['name'],
            defaults={**template_data, 'created_by': admin_user}
        )
        if created:
            template_count += 1
            print(f"📝 Created template: {template.name}")

    print(f"\n✓ Created {template_count} email templates")

    # Statistics
    total_emails = EmailInbox.objects.count()
    unread = EmailInbox.objects.filter(status=EmailInbox.STATUS_UNREAD).count()
    starred = EmailInbox.objects.filter(is_starred=True).count()
    urgent = EmailInbox.objects.filter(priority=EmailInbox.PRIORITY_URGENT).count()

    print("\n" + "="*60)
    print("📊 INBOX STATISTICS")
    print("="*60)
    print(f"Total Emails: {total_emails}")
    print(f"Unread: {unread}")
    print(f"Starred: {starred}")
    print(f"Urgent: {urgent}")
    print("="*60)

    print("\n✅ Test data creation complete!")
    print("\n🌐 Access your inbox at:")
    print("   http://localhost:8000/inbox/")
    print("   http://localhost:8000/admin/core/emailinbox/")
    print("\n💡 Admin credentials:")
    print(f"   Email: {admin_user.email}")
    print("   Password: admin123 (if newly created)")


if __name__ == '__main__':
    create_test_data()
