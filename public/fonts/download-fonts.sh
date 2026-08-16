#!/bin/bash
# Download Google Fonts and convert to self-hosted format
# Run from: frontend/public/fonts/

set -e

DEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📥 Downloading fonts from Google Fonts API..."
echo "Target directory: $DEST_DIR"

# Google Fonts URL template
GOOGLE_FONTS_URL="https://fonts.google.com/download"

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Function to download font files
download_font() {
    local family=$1
    local weight=$2
    local variant=${3:-normal}  # normal or italic
    
    echo "  ↓ $family ($weight)"
    
    # Construct query for Google API
    local query="family=${family}:wght@${weight}"
    
    # Use google-webfonts-helper API (no auth needed)
    # Format: https://gwfh.mranftl.com/api/fonts/{{family}}?download=zip&subsets={{subsets}}
    local safe_family=$(echo "$family" | sed 's/ /+/g')
    local url="https://gwfh.mranftl.com/api/fonts/${safe_family}?subsets=latin"
    
    # For simplicity, use curl to fetch from Google's official endpoint
    # This is a manual approach - you can also use google-webfont-offline-helper
}

# Alternative: Use direct CDN links with conversion tools
# For now, provide manual download instructions

cat > "$DEST_DIR/SETUP.md" << 'EOF'
# Self-Hosted Fonts Setup

## Option 1: Using google-webfonts-helper (Recommended - No Installation)

Visit: https://gwfh.mranftl.com/

1. Search for each font family:
   - Playfair Display
   - DM Sans
   - DM Mono

2. Select the required weights:
   - Playfair Display: 400, 600, 700
   - DM Sans: 300, 400, 500, 600
   - DM Mono: 400, 500

3. Select Subset: **Latin** (or all if needed)

4. Click **Download** - you'll get a ZIP with:
   - Font files (.woff, .woff2)
   - CSS file

5. Extract to this directory and rename files to match `fonts.css`

---

## Option 2: Using curl + woff2 conversion

If you have `woff2` tools installed:

```bash
# Install woff2 (macOS)
brew install woff2

# Or Ubuntu/Debian
sudo apt-get install woff2

# Download from Google API and convert
curl "https://fonts.google.com/download?family=Playfair%20Display:wght@400;600;700" \
  -o playfair-display.zip
unzip playfair-display.zip
```

---

## Option 3: NPM Package

```bash
npm install --save-dev fontsource

# Then copy files from node_modules/@fontsource/{family}/files/
```

---

## File Structure

After setup, your `frontend/public/fonts/` should contain:

```
fonts/
├── fonts.css                    ✓ (already created)
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

---

## Update Your Code

### For Email Templates

Replace:
```html
<style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');</style>
```

With:
```html
<style>@import url('https://your-domain.com/fonts/fonts.css');</style>
```

Or if hosting locally during dev:
```html
<style>@import url('/fonts/fonts.css');</style>
```

### For Next.js Frontend

In your layout or global styles:
```tsx
import '@/styles/fonts.css'  // if you copy fonts.css there
// OR reference from public:
<link rel="stylesheet" href="/fonts/fonts.css" />
```

---

## Deployment to Your Domain

1. Upload the entire `fonts/` directory to your domain's static files server
2. Update URLs in templates to use your domain:
   ```
   https://yourdomain.com/fonts/fonts.css
   ```

3. Or set up a CDN/static host like:
   - Cloudflare (free)
   - AWS S3 + CloudFront
   - Your VPS public folder

---

## Verification

Check browser DevTools Network tab:
- Fonts should load from your domain (not googleapis.com)
- Status should be 200 (not 304 if no cache issues)
- File sizes: .woff2 ~20-50KB each, .woff ~40-80KB each

EOF

cat "$DEST_DIR/SETUP.md"

echo ""
echo "✅ Setup guide created at: $DEST_DIR/SETUP.md"
echo ""
echo "📋 Next steps:"
echo "  1. Visit https://gwfh.mranftl.com/"
echo "  2. Download fonts as described in SETUP.md"
echo "  3. Extract to this directory"
echo "  4. Update email templates & frontend to use /fonts/fonts.css"
