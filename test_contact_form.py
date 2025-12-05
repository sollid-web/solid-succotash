"""
Test contact form functionality
"""
import os

os.environ['DEBUG'] = '1'

import django

django.setup()

from django.contrib.auth import get_user_model

from core.forms import ContactForm
from core.models import SupportRequest

User = get_user_model()

# Test 1: Create contact form submission
print("=" * 60)
print("Test 1: Contact Form Submission")
print("=" * 60)

form_data = {
    'full_name': 'Test User',
    'contact_email': 'testuser@example.com',
    'topic': 'Question about investments',
    'message': 'I would like to know more about your investment plans and minimum deposit requirements.',
}

form = ContactForm(data=form_data)
if form.is_valid():
    print("✅ Form is valid")

    # Save without sending email (for testing)
    instance = form.save(commit=False)
    instance.save()

    print(f"✅ Support request created: ID {instance.id}")
    print(f"   From: {instance.full_name} <{instance.contact_email}>")
    print(f"   Subject: {instance.topic}")
    print(f"   Status: {instance.get_status_display()}")
    print(f"   Created: {instance.created_at}")
else:
    print("❌ Form validation failed:")
    print(form.errors)

# Test 2: Check database
print("\n" + "=" * 60)
print("Test 2: Database Check")
print("=" * 60)

total_requests = SupportRequest.objects.count()
pending_requests = SupportRequest.objects.filter(status='pending').count()
print(f"✅ Total support requests: {total_requests}")
print(f"✅ Pending requests: {pending_requests}")

# Test 3: Form with authenticated user
print("\n" + "=" * 60)
print("Test 3: Form with Authenticated User")
print("=" * 60)

try:
    user = User.objects.first()
    if user:
        form_data_user = {
            'full_name': user.get_full_name() or user.email,
            'contact_email': user.email,
            'topic': 'Account inquiry',
            'message': 'I have a question about my account balance.',
        }

        form_user = ContactForm(data=form_data_user)
        if form_user.is_valid():
            instance_user = form_user.save(commit=False)
            instance_user.user = user
            instance_user.save()

            print(f"✅ Support request created for user: {user.email}")
            print(f"   Linked to user ID: {instance_user.user_id}")
        else:
            print("❌ Form validation failed:", form_user.errors)
    else:
        print("⚠️  No users found in database")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 4: Admin email settings
print("\n" + "=" * 60)
print("Test 4: Email Configuration")
print("=" * 60)

from django.conf import settings

print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("ADMIN_EMAIL_RECIPIENTS:")
for email in settings.ADMIN_EMAIL_RECIPIENTS:
    print(f"  - {email}")

print("\n" + "=" * 60)
print("All tests completed!")
print("=" * 60)
print("\nNext steps:")
print("1. Configure ADMIN_EMAIL_RECIPIENTS in .env file")
print("2. Set up SMTP credentials for production email sending")
print("3. Access contact form at: http://localhost:8000/contact/")
print("4. View submissions in admin: http://localhost:8000/admin/core/supportrequest/")
