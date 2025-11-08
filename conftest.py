"""
Pytest configuration and fixtures
"""
import os

import django
from django.conf import settings

# Configure Django settings before importing anything else
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')

if not settings.configured:
    django.setup()
