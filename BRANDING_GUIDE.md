# WolvCapital Branding System

## Overview
Comprehensive branding configuration and assets for the WolvCapital investment platform.

## Configuration

### Settings (`wolvcapital/settings.py`)

```python
BRAND = {
    "name": "WolvCapital",
    "tagline": "Invest Smart, Grow Fast",
    "primary": "#2196F3",
    "primary_light": "#6EC1E4",
    "primary_dark": "#0D47A1",
    "accent_gold": "#FFD700",
    "success": "#10B981",
    "danger": "#EF4444",
    "warning": "#F59E0B",
    "logo_svg": "img/wolvcapital-logo.svg",
    "logo_png": "img/wolvcapital-logo.png",
    "favicon": "img/favicon.ico",
}
```

## Static Files Structure

```
static/
├── css/
│   └── brand.css          # Brand styles and utilities
├── js/
│   └── brand.js           # Brand JavaScript utilities
└── img/
    ├── wolvcapital-logo.svg   # SVG logo
    ├── wolvcapital-logo.png   # PNG logo (optional)
    └── favicon.ico            # Favicon (optional)
```

## Usage in Templates

### Access Brand Configuration

The branding configuration is automatically available in all templates via context processor:

```django
<!-- Display brand name -->
<h1>{{ BRAND_NAME }}</h1>

<!-- Use brand logo -->
{% load static %}
<img src="{% static BRAND_LOGO %}" alt="{{ BRAND_NAME }}">

<!-- Access brand colors -->
<div style="color: {{ BRAND_PRIMARY }}">
    Primary color text
</div>

<!-- Access full BRAND dict -->
<div style="background: {{ BRAND.accent_gold }}">
    Gold background
</div>
```

### Include Brand Styles

```django
{% load static %}
<link rel="stylesheet" href="{% static 'css/brand.css' %}">
```

### Include Brand JavaScript

```django
{% load static %}
<script src="{% static 'js/brand.js' %}"></script>
```

## CSS Utilities

### Color Classes

```html
<!-- Text colors -->
<p class="brand-primary">Primary color text</p>
<p class="brand-accent-gold">Gold text</p>

<!-- Background colors -->
<div class="brand-bg-primary">Primary background</div>
<div class="brand-bg-accent-gold">Gold background</div>
```

### Gradient Classes

```html
<!-- Gradient backgrounds -->
<div class="brand-gradient-primary">Primary gradient</div>
<div class="brand-gradient-light">Light gradient</div>
<div class="brand-gradient-gold">Gold gradient</div>
<div class="brand-gradient-hero">Hero gradient</div>
```

### Button Classes

```html
<!-- Brand buttons -->
<button class="btn-brand-primary">Primary Button</button>
<button class="btn-brand-gold">Gold Button</button>
```

### Card Classes

```html
<!-- Brand cards -->
<div class="brand-card">Standard card with hover effect</div>
<div class="brand-card brand-card-primary">Primary colored card</div>
<div class="brand-card brand-card-gold">Gold colored card</div>
```

### Badge Classes

```html
<!-- Badges -->
<span class="brand-badge brand-badge-primary">Primary</span>
<span class="brand-badge brand-badge-gold">Gold</span>
<span class="brand-badge brand-badge-success">Success</span>
<span class="brand-badge brand-badge-danger">Danger</span>
```

### Text Effects

```html
<!-- Gradient text -->
<h1 class="brand-text-gradient">Gradient Text Effect</h1>

<!-- Text shadow -->
<h2 class="brand-text-shadow">Text with Shadow</h2>
```

### Animation Classes

```html
<!-- Pulse animation -->
<div class="brand-pulse">Pulsing element</div>

<!-- Bounce animation -->
<div class="brand-bounce">Bouncing element</div>
```

## JavaScript Utilities

### Initialize Brand

```javascript
// Automatically initialized on page load
WolvCapitalBrand.init();
```

### Notifications

```javascript
// Success notification
WolvCapitalBrand.showSuccess('Operation completed!');

// Error notification
WolvCapitalBrand.showError('Something went wrong!');

// Info notification
WolvCapitalBrand.showInfo('Here is some information.');

// Warning notification
WolvCapitalBrand.showToast('Warning message', 'warning');
```

### Currency Formatting

```javascript
// Format currency
const formatted = WolvCapitalBrand.formatCurrency(1000.50);
// Output: "$1,000.50"

// Format percentage
const percent = WolvCapitalBrand.formatPercent(15.75);
// Output: "15.75%"
```

### ROI Calculation

```javascript
// Calculate ROI
const roi = WolvCapitalBrand.calculateROI(1000, 1500);
// Output: "50.00" (50% return)
```

### Number Animation

```javascript
// Animate number counter
const element = document.getElementById('counter');
WolvCapitalBrand.animateNumber(element, 0, 1000, 2000);
```

### Smooth Scrolling

```javascript
// Scroll to element
WolvCapitalBrand.scrollTo('#pricing-section', 80);
```

### Clipboard

```javascript
// Copy to clipboard
WolvCapitalBrand.copyToClipboard('Text to copy');
// Shows success/error notification
```

### Utility Functions

```javascript
// Debounce function
const debouncedSearch = WolvCapitalBrand.debounce((query) => {
    console.log('Searching for:', query);
}, 500);
```

## CSS Variables

All brand colors are available as CSS custom properties:

```css
:root {
    --brand-primary: #2196F3;
    --brand-primary-light: #6EC1E4;
    --brand-primary-dark: #0D47A1;
    --brand-accent-gold: #FFD700;
    --brand-success: #10B981;
    --brand-danger: #EF4444;
    --brand-warning: #F59E0B;
    --brand-info: #3B82F6;
}
```

Use in custom CSS:

```css
.my-custom-element {
    color: var(--brand-primary);
    background: var(--brand-accent-gold);
}
```

## Example: Complete Page with Branding

```django
{% extends 'base.html' %}
{% load static %}

{% block extra_css %}
<link rel="stylesheet" href="{% static 'css/brand.css' %}">
{% endblock %}

{% block content %}
<div class="brand-gradient-hero py-20">
    <div class="container mx-auto text-center text-white">
        <img src="{% static BRAND_LOGO %}" alt="{{ BRAND_NAME }}" class="mx-auto mb-6" style="height: 80px;">
        <h1 class="text-5xl font-bold mb-4">Welcome to {{ BRAND_NAME }}</h1>
        <p class="text-xl mb-8">{{ BRAND.tagline }}</p>
        <button class="btn-brand-primary" onclick="WolvCapitalBrand.showSuccess('Welcome!')">
            Get Started
        </button>
    </div>
</div>

<div class="container mx-auto py-16">
    <div class="grid grid-cols-3 gap-6">
        <div class="brand-card">
            <span class="brand-badge brand-badge-primary">Featured</span>
            <h3 class="text-2xl font-bold mt-4 brand-primary">Pioneer Plan</h3>
            <p class="text-gray-600 mt-2">Start your investment journey</p>
            <div class="mt-4">
                <span class="text-3xl font-bold brand-text-gradient">1.00%</span>
                <span class="text-gray-500"> daily ROI</span>
            </div>
        </div>
        
        <div class="brand-card brand-card-primary">
            <span class="brand-badge brand-badge-gold">Popular</span>
            <h3 class="text-2xl font-bold mt-4">Vanguard Plan</h3>
            <p class="mt-2">Balanced growth strategy</p>
            <div class="mt-4">
                <span class="text-3xl font-bold">1.25%</span>
                <span> daily ROI</span>
            </div>
        </div>
        
        <div class="brand-card brand-card-gold">
            <span class="brand-badge brand-badge-primary">Premium</span>
            <h3 class="text-2xl font-bold mt-4">Summit Plan</h3>
            <p class="mt-2">Maximum returns</p>
            <div class="mt-4">
                <span class="text-3xl font-bold">2.00%</span>
                <span> daily ROI</span>
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block extra_js %}
<script src="{% static 'js/brand.js' %}"></script>
<script>
// Example: Animate counters on page load
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        WolvCapitalBrand.animateNumber(counter, 0, target, 2000);
    });
});
</script>
{% endblock %}
```

## Customization

### Update Brand Colors

Edit `wolvcapital/settings.py`:

```python
BRAND = {
    "name": "WolvCapital",
    "primary": "#YOUR_COLOR",  # Change primary color
    "accent_gold": "#YOUR_GOLD",  # Change gold accent
    # ... other settings
}
```

### Add Custom Brand Styles

Create `static/css/custom-brand.css`:

```css
/* Custom brand extensions */
.my-custom-brand-class {
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent-gold));
}
```

Include in template:

```django
{% load static %}
<link rel="stylesheet" href="{% static 'css/brand.css' %}">
<link rel="stylesheet" href="{% static 'css/custom-brand.css' %}">
```

## Dark Mode Support

Brand styles automatically adapt to dark mode:

```css
@media (prefers-color-scheme: dark) {
    .brand-card {
        background: var(--brand-gray-800);
        color: white;
    }
}
```

## Deployment

### Collect Static Files

Before deploying, collect all static files:

```bash
python manage.py collectstatic --noinput
```

This will copy all files from `static/` to `staticfiles/` for production serving.

### WhiteNoise Integration

The platform uses WhiteNoise for serving static files in production. Static files are automatically compressed and cached.

## Best Practices

1. **Always use brand utilities** instead of hardcoding colors
2. **Use the context processor** to access brand settings in templates
3. **Keep brand assets optimized** (compress images, minify CSS/JS)
4. **Test dark mode** compatibility when adding new styles
5. **Use semantic naming** for custom brand classes
6. **Document custom brand extensions** in this file

## Troubleshooting

### Static files not loading

```bash
# Ensure static directory is created
mkdir static static/css static/js static/img

# Collect static files
python manage.py collectstatic --noinput

# Restart server
python manage.py runserver
```

### Brand context not available in template

Ensure context processor is added in settings:

```python
TEMPLATES = [{
    'OPTIONS': {
        'context_processors': [
            # ... other processors
            'core.context_processors.brand_context',
        ],
    },
}]
```

### Colors not applying

1. Check that `brand.css` is included in the template
2. Verify CSS custom properties are supported in the browser
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

## Status: ✅ Fully Implemented

All branding components are configured and ready to use!
