"""
Pytest configuration and fixtures
"""
import os

import django
from django.conf import settings

# Configure Django settings before importing anything else
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')

# Test runs should not depend on production-only env vars.
os.environ.setdefault('DEBUG', '1')
os.environ.setdefault('SECRET_KEY', 'test-secret-key')

if not settings.configured:
    django.setup()
