# Tawk.to Integration Guide

## Overview
This guide explains how to integrate Tawk.to customer support widget with a professional fintech color scheme (dark navy #002350 with white text) for WolvCapital.

## Setup Options

### Option 1: Using the TawkWidget Component (Recommended)

Add the component to your root layout:

```tsx
import TawkWidget from '@/components/TawkWidget'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ... other head content ... */}
      </head>
      <body className="min-h-screen bg-white">
        {/* ... other content ... */}
        <TawkWidget propertyId="YOUR_PROPERTY_ID_HERE" />
      </body>
    </html>
  )
}
```

**Where to find your Property ID:**
1. Log in to [Tawk.to Dashboard](https://dashboard.tawk.to)
2. Go to Settings → Install Code
3. Copy the 12-character property ID from the embed code
4. Replace `YOUR_PROPERTY_ID_HERE` in the component props

### Option 2: Direct Script in Layout

Add this script block directly in your `layout.tsx` (within the body tag):

```tsx
<Script
  id="tawk-widget"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      
      Tawk_API.onLoad = function() {
        applyTawkCustomStyles();
      };
      
      (function() {
        var s1 = document.createElement('script');
        var s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/1h5r7jmq1';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
      
      function applyTawkCustomStyles() {
        const style = document.createElement('style');
        style.textContent = \`
          /* Professional fintech Tawk.to theme */
          #tawk-container {
            --tawk-primary-color: #002350;
            --tawk-text-color: #ffffff;
          }
          
          .tawk-branding-header,
          .tawk-chat-header {
            background-color: #002350 !important;
            color: white !important;
          }
          
          .tawk-message-box.tawk-from-agent {
            background-color: #002350 !important;
            color: white !important;
          }
          
          .tawk-input-box {
            border: 2px solid #002350 !important;
          }
          
          .tawk-input-box:focus {
            border-color: #002350 !important;
            outline: none;
          }
          
          .tawk-send-btn,
          .tawk-action-button {
            background-color: #002350 !important;
            color: white !important;
          }
          
          .tawk-send-btn:hover,
          .tawk-action-button:hover {
            background-color: #001840 !important;
          }
          
          .tawk-widget-badge {
            background-color: #002350 !important;
          }
          
          .tawk-message-box a {
            color: #002350 !important;
          }
        \`;
        document.head.appendChild(style);
      }
    `,
  }}
/>
```

## Color Scheme Details

| Element | Color | Hex Code | Purpose |
|---------|-------|----------|---------|
| Primary (Header, Buttons) | Dark Navy | #002350 | Professional fintech branding |
| Text | White | #ffffff | High contrast, accessibility |
| Hover State | Darker Navy | #001840 | Visual feedback for interactions |
| Borders | Navy | #002350 | Consistent with UI theme |

## Styling Applied

The script automatically applies styles to:

- **Chat Header** - Dark navy background with white text
- **Agent Messages** - Navy background with white text for distinction
- **Input Fields** - Navy border with navy focus state
- **Send Button** - Navy background, white text with hover effect
- **Widget Badge** - Navy branded appearance
- **Pre-chat Form** - Navy accents on form elements
- **Links** - Navy colored for consistency

## Customization

To modify colors, update the hex codes in the CSS:

```css
/* Change primary color */
background-color: #002350 !important;  /* Change this */

/* Change text color */
color: #ffffff !important;  /* Change this */

/* Change hover state */
background-color: #001840 !important;  /* Darker version */
```

## Testing the Integration

1. **Local Development**: Run `npm run dev` and verify the Tawk widget appears in the bottom-right corner
2. **Check Styles**: Open DevTools → Inspector, find the widget element to confirm navy styling
3. **Test Interaction**: Click the widget, type a message, verify colors remain consistent
4. **Mobile**: Test on mobile viewport to ensure responsive styling

## Troubleshooting

### Widget Not Appearing
- Verify Property ID is correct
- Check browser console for CORS or loading errors
- Ensure script strategy is `afterInteractive` or `lazyOnload`

### Styles Not Applying
- Check if Tawk widget fully loaded (look for `Tawk_API.onLoad` callback)
- Verify CSS selectors match current Tawk DOM structure
- Use `!important` flag to override Tawk's default styles

### Colors Look Off
- Clear browser cache
- Check if using different Tawk version (update selectors if needed)
- Verify hex codes: `#002350` (navy), `#ffffff` (white)

## Environment Variables

Add to `.env.local` (optional, for future features):

```env
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id_here
NEXT_PUBLIC_TAWK_ENABLED=true
```

Then use in component:
```tsx
const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || 'default_id'
<TawkWidget propertyId={propertyId} />
```

## Browser Support

The script supports all modern browsers:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Resources

- [Tawk.to Documentation](https://docs.tawk.to/)
- [Tawk_API Reference](https://docs.tawk.to/l/en/article/d45oy4qwc)
- [Widget Customization Guide](https://docs.tawk.to/l/en/article/r26cakma4)

## Notes

- The `Tawk_API.onLoad` function ensures styles apply immediately when the widget becomes interactive
- CSS injection prevents caching issues and ensures fresh styles load each session
- The `!important` flags override Tawk's default styles reliably
- All styles are namespace-scoped to avoid conflicts with page styling
