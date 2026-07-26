# WolvCapital Admin Configuration Snippets
# Add these to your wolvcapital/settings.py

# 1. Django Constance Configuration (Financial Controls)
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... existing apps ...
    'constance',
    'constance.backends.database',
    # ... rest of apps ...
]

# Constance Configuration
CONSTANCE_BACKEND = 'constance.backends.database.DatabaseBackend'

CONSTANCE_CONFIG = {
    'DAILY_INTEREST_RATE': {
        'default': 0.5,
        'help_text': 'Daily interest rate as percentage (e.g., 0.5 for 0.5%)',
    },
    'WITHDRAWAL_FEE_PERCENT': {
        'default': 2.0,
        'help_text': 'Withdrawal fee as percentage (e.g., 2.0 for 2%)',
    },
    'MIN_INVESTMENT_AMOUNT': {
        'default': 100.00,
        'help_text': 'Minimum investment amount in USD',
    },
    'MAINTENANCE_MODE': {
        'default': False,
        'help_text': 'Enable maintenance mode to disable new investments',
    },
}

CONSTANCE_CONFIG_FIELDSETS = {
    'Financial Settings': (
        'DAILY_INTEREST_RATE',
        'WITHDRAWAL_FEE_PERCENT',
        'MIN_INVESTMENT_AMOUNT',
    ),
    'System Settings': (
        'MAINTENANCE_MODE',
    ),
}

# 2. Django Unfold Configuration (Modern Dashboard UI)
# Add to INSTALLED_APPS (replace django-jazzmin if present)
INSTALLED_APPS = [
    # ... existing apps ...
    'unfold',
    'unfold.contrib.filters',
    'unfold.contrib.forms',
    'unfold.contrib.inlines',
    # ... rest of apps ...
]

# Django Unfold Configuration
UNFOLD = {
    "SITE_TITLE": "WolvCapital Command Center",
    "SITE_HEADER": "WolvCapital Administration",
    "SITE_URL": "/",
    "SITE_ICON": {
        "light": "/static/admin/img/logo-light.svg",
        "dark": "/static/admin/img/logo-dark.svg"
    },
    "SITE_LOGO": {
        "light": "/static/admin/img/logo-light.svg",
        "dark": "/static/admin/img/logo-dark.svg"
    },
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "32x32",
            "src": "/static/admin/img/favicon-32x32.png",
            "type": "image/png",
        },
    ],
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "THEME": "dark",
    "STYLES": [
        lambda request: "/static/admin/css/custom.css" if request.user.is_superuser else "",
    ],
    "SCRIPTS": [
        lambda request: "/static/admin/js/custom.js" if request.user.is_superuser else "",
    ],
    "COLORS": {
        "primary": {
            "50": "245 243 255",
            "100": "241 237 252",
            "200": "233 230 255",
            "300": "216 207 255",
            "400": "196 181 253",
            "500": "168 147 255",
            "600": "147 128 255",
            "700": "126 105 255",
            "800": "110 89 255",
            "900": "88 28 135",
            "950": "59 7 100",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇺🇸",
                "fr": "🇫🇷",
                "es": "🇪🇸",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Dashboard",
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": "Dashboard",
                        "icon": "dashboard",
                        "link": "/admin/",
                    },
                    {
                        "title": "System Status",
                        "icon": "settings",
                        "link": "/admin/system-status/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
            {
                "title": "Financial Operations",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Transactions",
                        "icon": "payment",
                        "link": "/admin/transactions/transaction/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": "Virtual Cards",
                        "icon": "credit_card",
                        "link": "/admin/transactions/virtualcard/",
                    },
                    {
                        "title": "Crypto Wallets",
                        "icon": "account_balance_wallet",
                        "link": "/admin/transactions/cryptocurrencywallet/",
                    },
                    {
                        "title": "Financial Settings",
                        "icon": "settings",
                        "link": "/admin/constance/config/",
                        "permission": lambda request: request.user.is_superuser,
                    },
                ],
            },
            {
                "title": "User Management",
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": "Users",
                        "icon": "people",
                        "link": "/admin/users/user/",
                    },
                    {
                        "title": "User Profiles",
                        "icon": "person",
                        "link": "/admin/users/profile/",
                    },
                    {
                        "title": "User Wallets",
                        "icon": "account_balance",
                        "link": "/admin/users/userwallet/",
                    },
                ],
            },
        ],
    },
    "TABS": [
        {
            "models": [
                "users.user",
                "users.profile",
                "users.userwallet",
            ],
            "items": [
                {
                    "title": "Users",
                    "link": "/admin/users/user/",
                },
                {
                    "title": "Profiles",
                    "link": "/admin/users/profile/",
                },
                {
                    "title": "Wallets",
                    "link": "/admin/users/userwallet/",
                },
            ],
        },
    ],
}

# Dashboard Configuration for Quick Stats
DASHBOARD_CONFIG = {
    "cards": [
        {
            "title": "Total Deposits Today",
            "value": lambda request: f"${Transaction.objects.filter(tx_type='deposit', status='approved', created_at__date=timezone.now().date()).aggregate(total=Sum('amount'))['total'] or 0:.2f}",
            "icon": "trending_up",
            "color": "green",
        },
        {
            "title": "Active Investors",
            "value": lambda request: User.objects.filter(transactions__tx_type='deposit', transactions__status='approved').distinct().count(),
            "icon": "people",
            "color": "blue",
        },
        {
            "title": "Pending Withdrawals",
            "value": lambda request: Transaction.objects.filter(tx_type='withdrawal', status='pending').count(),
            "icon": "schedule",
            "color": "orange",
        },
        {
            "title": "System Status",
            "value": "Online",
            "icon": "check_circle",
            "color": "green",
        },
    ],
    "charts": [
        {
            "title": "Recent Transactions",
            "type": "line",
            "data": lambda request: {
                "labels": [f"Day {i}" for i in range(7)],
                "datasets": [
                    {
                        "label": "Deposits",
                        "data": [
                            Transaction.objects.filter(
                                tx_type='deposit',
                                status='approved',
                                created_at__date=timezone.now().date() - timezone.timedelta(days=i)
                            ).aggregate(total=Sum('amount'))['total'] or 0
                            for i in range(6, -1, -1)
                        ],
                        "borderColor": "rgb(75, 192, 192)",
                    }
                ],
            },
        },
    ],
}

# 3. URL Configuration
# Add to wolvcapital/urls.py
from django.urls import path
from transactions.admin import SystemStatusView

# Add to urlpatterns
urlpatterns = [
    # ... existing patterns ...
    path("admin/system-status/", SystemStatusView.as_view(), name="system_status"),
    # ... rest of patterns ...
]

# 4. Template for System Status View
# Create templates/admin/system_status.html
"""
{% extends "admin/base.html" %}
{% load static %}

{% block title %}System Status - {{ site_title }}{% endblock %}

{% block content %}
<div class="module">
    <h2>System Health & Logs</h2>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div class="card" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Quick Stats</h3>
            <p><strong>Deposits Today:</strong> ${{ deposits_today }}</p>
            <p><strong>Active Investors:</strong> {{ active_investors }}</p>
            <p><strong>Pending Withdrawals:</strong> {{ pending_withdrawals }}</p>
        </div>

        <div class="card" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Database Status</h3>
            <p><strong>Supabase Connection:</strong>
                <span style="color: {% if supabase_status == 'Connected' %}green{% else %}red{% endif %}">
                    {{ supabase_status }}
                </span>
            </p>
        </div>
    </div>

    <div class="card" style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>Last 50 Lines of django.log</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; max-height: 400px; overflow-y: auto;">{{ log_content }}</pre>
    </div>
</div>
{% endblock %}
"""

# 5. Requirements
# Add to requirements.txt
"""
django-constance==2.9.1
django-unfold==0.35.0
"""

# 6. Migration for Constance
# Run after adding to INSTALLED_APPS:
# python manage.py migrate</content>
<parameter name="filePath">c:\Users\Radical\repo\wolvcapital_admin_config.py