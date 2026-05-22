# Self-Hosted Fonts Implementation Guide

## ✅ Completed Steps

1. ✓ Created `/frontend/public/fonts/fonts.css` with @font-face declarations
2. ✓ Created setup/download script at `/frontend/public/fonts/download-fonts.sh`
3. ✓ Updated all email templates to use `/fonts/fonts.css` instead of Google Fonts CDN

## 📋 Next Steps

### Step 1: Download the Font Files

Visit: **https://gwfh.mranftl.com/**

1. Search for each font family:
   - **Playfair Display** → Select weights: 400, 600, 700
   - **DM Sans** → Select weights: 300, 400, 500, 600  
   - **DM Mono** → Select weights: 400, 500

2. For each font:
   - Select **Subset**: Latin
   - Click **Download** to get a ZIP file
   - Extract the contents

3. Rename files to match the pattern in `fonts.css`:
   ```
   playfair-display-400.woff2  ← from Playfair_Display_400.woff2 (or similar)
   playfair-display-400.woff
   playfair-display-600.woff2
   playfair-display-600.woff
   ... etc
   ```

### Step 2: Populate Font Files

Place all font files in: `/frontend/public/fonts/`

Your directory structure should look like:
```
frontend/public/fonts/
├── fonts.css
├── playfair-display-400.woff2
├── playfair-display-400.woff
├── playfair-display-600.woff2
├── playfair-display-600.woff
├── playfair-display-700.woff2
├── playfair-display-700.woff
├── dm-sans-300.woff2
├── dm-sans-300.woff
├── dm-sans-400.woff2
├── dm-sans-400.woff
├── dm-sans-500.woff2
├── dm-sans-500.woff
├── dm-sans-600.woff2
├── dm-sans-600.woff
├── dm-mono-400.woff2
├── dm-mono-400.woff
├── dm-mono-500.woff2
└── dm-mono-500.woff
```

### Step 3: Test Locally

```bash
cd frontend
npm run dev
```

Then check:
- Open DevTools → Network tab
- Look for requests to `/fonts/fonts.css` and the .woff2/.woff files
- Should all return **200 OK** (green), not 404

### Step 4: Update Frontend Components (If Needed)

The email templates already use `/fonts/fonts.css`. For any React/Next.js components that import Google Fonts, update them:

**Before:**
```tsx
<style>{`@import url('https://fonts.googleapis.com/css2?family=...')`}</style>
```

**After:**
```tsx
<link rel="stylesheet" href="/fonts/fonts.css" />
```

Or in a global CSS file:
```css
@import url('/fonts/fonts.css');
```

### Step 5: Deploy to Production

**Option A: Simple (Uses Vercel/Render default static hosting)**
- Font files in `frontend/public/fonts/` are automatically served at `/fonts/fonts.css`
- No additional config needed
- URLs stay as `/fonts/fonts.css`

**Option B: Custom Domain (e.g., fonts.wolvcapital.com)**
- Set up a subdomain in your DNS pointing to your static host
- Update font URLs in code:
  ```css
  @import url('https://fonts.wolvcapital.com/fonts.css');
  ```
- Or use CDN (Cloudflare, AWS CloudFront, etc.)

**Option C: Different Path (e.g., /static/fonts/)**
- Move files to `frontend/public/static/fonts/`
- Update import URLs to `/static/fonts/fonts.css`

### Step 6: Verify in Production

Once deployed:
1. Check email templates render correctly
2. DevTools Network tab should show fonts loading from your domain (not googleapis.com)
3. Font sizes should be much smaller than Google's optimized versions

---

## 📊 File Size Comparison

| Format | Size |
|--------|------|
| Google CDN (combined) | ~100KB |
| Self-hosted .woff2 (all fonts) | ~60KB |
| Self-hosted .woff (all fonts) | ~100KB |

**Benefit**: Faster loading (no external DNS lookup), full control, better privacy, can cache forever.

---

## 🔧 Troubleshooting

**Fonts not loading?**
- Check browser console for 404 errors
- Verify file paths match exactly in `fonts.css`
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check CORS headers if serving from different domain

**Email fonts not rendering?**
- Most email clients don't support @font-face
- Fallback to system fonts (Arial, sans-serif) is automatic
- Verify in Litmus/Email on Acid test tools

**Build issues?**
- Next.js automatically serves `/frontend/public/fonts/` at `/fonts/`
- No special config needed for Vercel/Render

---

## ✨ What Was Changed

| File | Change |
|------|--------|
| `frontend/public/fonts/fonts.css` | Created with @font-face rules |
| `templates/emails/drip_campaign_day_*.html` | Updated imports to `/fonts/fonts.css` |
| `drip-templates/day_01_welcome.html` | Updated imports to `/fonts/fonts.css` |

---

## Next Commands

```bash
# Test locally
cd frontend && npm run dev

# After adding font files, verify with:
ls -lh frontend/public/fonts/

# Deploy (Vercel)
git add .
git commit -m "chore: self-host Google Fonts on domain"
git push

# Deploy (Render)
# Just push to your branch, Render redeploys automatically
```

---

## Questions?

- Font naming issue? Use https://gwfh.mranftl.com/ to match exact filenames
- Email still showing Google Fonts? Make sure you updated all email templates in both `templates/emails/` and `drip-templates/`
- Performance concern? Self-hosted fonts cache better than CDN versioned URLs
