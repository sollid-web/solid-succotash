from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ("user", "language_preference")
    list_editable = ("language_preference",)
    list_filter = ("language_preference",)
    list_fullwidth = True
    list_filter_sheet = True
    list_fullwidth = True
    
    # Custom Unfold styling for the profile section
    fieldsets = (
        (None, {
            "fields": (
                "user",
                "language_preference",
            ),
        }),
    )
