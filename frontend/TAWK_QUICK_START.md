# Tawk.to Quick Implementation Guide

## 🚀 30-Second Setup

### Step 1: Add to Layout (Option A - Recommended)
In `frontend/src/app/layout.tsx`, add this import:
```tsx
import TawkWidget from '@/components/TawkWidget'
```

Then in the body tag, add before the closing tag:
```tsx
<TawkWidget propertyId="YOUR_PROPERTY_ID" />
```

### Step 2: Add to Layout (Option B - Direct Script)
In `frontend/src/app/layout.tsx`, add this Script inside the body:
```tsx
<Script
  id="tawk-widget"
  strategy="afterInteractive"
  src="/tawk-fintech-theme.js"
/>
```

Then add this before the script:
```tsx
<script>
  window.TAWK_PROPERTY_ID = 'YOUR_PROPERTY_ID'
</script>
```

### Step 3: Get Your Property ID
1. Go to [Tawk.to Dashboard](https://dashboard.tawk.to)
2. Settings → Install Code
3. Copy the 12-character ID from the embed URL
4. Replace `YOUR_PROPERTY_ID` in the code above

## 📋 What Gets Styled

✅ Chat header (dark navy background)  
✅ Agent messages (navy with white text)  
✅ Input field (navy border with focus effect)  
✅ Send button (navy, darker on hover)  
✅ Widget badge (navy)  
✅ Pre-chat form (navy accents)  
✅ Links (navy color)  
✅ Mobile responsive  
✅ Accessibility features  

## 🎨 Color Reference

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Dark Navy | #002350 |
| Hover/Dark | Darker Navy | #001840 |
| Text | White | #ffffff |
| Borders | Navy | #002350 |

## ⚙️ File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── TawkWidget.tsx          ← React component
│   └── app/
│       └── layout.tsx               ← Add import/component here
└── public/
    └── tawk-fintech-theme.js        ← Standalone script
```

## 🧪 Test It

1. Start dev server: `npm run dev`
2. Look for widget in bottom-right corner
3. Open DevTools → Inspector
4. Find tawk element and verify navy colors
5. Click widget to test interaction
6. Check mobile view (resize to <480px)

## 🔧 Customize Colors

Edit `frontend/src/components/TawkWidget.tsx` or `frontend/public/tawk-fintech-theme.js`:

Find this section:
```css
background-color: #002350 !important;  /* Change this hex code */
color: #ffffff !important;             /* Or this one */
```

Replace with your colors. Use `!important` to override Tawk defaults.

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| Widget doesn't appear | Verify Property ID is correct and 12 characters |
| Colors don't apply | Check console for errors, clear browser cache |
| Styles override Tawk | Use `!important` flag on CSS properties |
| Mobile looks wrong | Test in mobile viewport, check responsive styles |

## 📚 Full Documentation

See `TAWK_INTEGRATION_GUIDE.md` for complete setup, customization, and troubleshooting.

## 🎯 Key Files Created

1. **TawkWidget.tsx** - React component for Next.js
   - Handles `Tawk_API.onLoad` callback
   - Applies CSS dynamically
   - Client-side component (`'use client'`)

2. **tawk-fintech-theme.js** - Vanilla JavaScript version
   - Can be loaded directly as public script
   - IIFE pattern (self-executing)
   - Includes fallback style injection

3. **TAWK_INTEGRATION_GUIDE.md** - Complete reference
   - Setup instructions
   - Customization options
   - Troubleshooting guide
   - Resource links

## 💡 Pro Tips

- Use `strategy="afterInteractive"` to load Tawk after page content
- The `onLoad` callback ensures styles apply when widget is ready
- CSS injection prevents caching issues
- `!important` flags reliably override Tawk's default styles
- Test on mobile early (fonts should be 16px+ to prevent zoom)

## 🔐 Environment Variables (Optional)

Add to `.env.local` for flexibility:
```env
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id_here
NEXT_PUBLIC_TAWK_ENABLED=true
```

## 📞 Support

If Tawk widget isn't working:
1. Check browser console for errors
2. Verify Property ID is correct
3. Ensure CORS is not blocking Tawk
4. Test in different browser
5. Review [Tawk.to Docs](https://docs.tawk.to/)
