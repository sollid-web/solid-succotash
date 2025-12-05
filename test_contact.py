"""
Test script for contact form functionality
"""
from django.conf import settings
from django.core.mail import send_mail

from core.forms import ContactForm

# Test 1: Create and save contact form
print("=" * 60)
print("Test 1: Contact Form Creation")
print("=" * 60)

form_data = {
    'full_name': 'Test User',
    'contact_email': 'testuser@example.com',
    'topic': 'Test Support Request',
    'message': 'This is a test message to verify the contact form functionality.',
}

form = ContactForm(data=form_data)

if form.is_valid():
    print("✓ Form validation passed")

    # Save and send notification
    try:
        support_request = form.save_and_notify()
        print(f"✓ Support request created with ID: {support_request.id}")
        print(f"  - Name: {support_request.full_name}")
        print(f"  - Email: {support_request.contact_email}")
        print(f"  - Topic: {support_request.topic}")
        print(f"  - Status: {support_request.get_status_display()}")
        print(f"  - Created: {support_request.created_at}")
        print(f"✓ Email notification sent to: {', '.join(settings.ADMIN_EMAIL_RECIPIENTS)}")
    except Exception as e:
        print(f"✗ Error saving/sending: {e}")
else:
    print("✗ Form validation failed:")
    for field, errors in form.errors.items():
        print(f"  - {field}: {errors}")

print()

# Test 2: Direct email test
print("=" * 60)
print("Test 2: Direct Email Test")
print("=" * 60)

try:
    send_mail(
        subject='[WolvCapital Test] Direct Email Test',
        message='This is a direct test email to verify SMTP configuration.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=settings.ADMIN_EMAIL_RECIPIENTS,
        fail_silently=False,
    )
    print(f"✓ Test email sent successfully to: {', '.join(settings.ADMIN_EMAIL_RECIPIENTS)}")
except Exception as e:
    print(f"✗ Email sending failed: {e}")

print()

# Test 3: List all support requests
print("=" * 60)
print("Test 3: All Support Requests")
print("=" * 60)

from core.models import SupportRequest

requests = SupportRequest.objects.all()[:5]
if requests:
    for req in requests:
        print(f"ID {req.id}: {req.topic} - {req.contact_email} ({req.get_status_display()})")
else:
    print("No support requests found")

print()
print("=" * 60)
print("Testing Complete!")
print("=" * 60)
print()
print("Next Steps:")
print("1. Visit http://localhost:8000/contact/ to test the form")
print("2. Check Django admin at http://localhost:8000/admin/core/supportrequest/")
print("3. Configure ADMIN_EMAIL_RECIPIENTS in .env for production")
