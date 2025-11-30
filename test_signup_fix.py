"""Quick test for signup fix"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
import json

User = get_user_model()

# Clean up test user if exists
User.objects.filter(email='testsignup@example.com').delete()

# Test signup
client = Client()
response = client.post(
    '/api/auth/complete-signup/',
    data=json.dumps({
        'email': 'testsignup@example.com',
        'password': 'testpass12345'
    }),
    content_type='application/json'
)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

# Check if user was created
user = User.objects.filter(email='testsignup@example.com').first()
if user:
    print(f"✅ User created: {user.email}")
    print(f"   - Username: {user.username}")
    print(f"   - Is Active: {user.is_active}")
    print(f"   - Has password: {user.has_usable_password()}")
else:
    print("❌ User was NOT created")

# Test duplicate signup
print("\nTesting duplicate signup...")
response2 = client.post(
    '/api/auth/complete-signup/',
    data=json.dumps({
        'email': 'testsignup@example.com',
        'password': 'anotherpass123'
    }),
    content_type='application/json'
)
print(f"Status Code: {response2.status_code}")
print(f"Response: {response2.json()}")

# Cleanup
User.objects.filter(email='testsignup@example.com').delete()
print("\n✅ Test cleanup complete")
