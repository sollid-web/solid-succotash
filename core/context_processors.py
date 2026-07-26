from django.conf import settings

def brand_context(request):
    """
    Add branding information to template context with safety fallbacks.
    """
    # Get the BRAND dict from settings, default to empty dict if missing entirely
    brand = getattr(settings, "BRAND", {})

    return {
        "BRAND": brand,
        "BRAND_NAME": brand.get("name", "Default Brand"),
        "BRAND_PRIMARY": brand.get("primary", "#000000"), # Fallback to black
        "BRAND_LOGO": brand.get("logo_svg", ""), # Fallback to empty string
    }

