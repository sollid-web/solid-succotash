"""
Context processor to make branding configuration available in all templates
"""
from django.conf import settings


def brand_context(request):
    """
    Add branding information to template context
    """
    return {
        'BRAND': settings.BRAND,
        'BRAND_NAME': settings.BRAND['name'],
        'BRAND_PRIMARY': settings.BRAND['primary'],
        'BRAND_LOGO': settings.BRAND['logo_svg'],
    }
