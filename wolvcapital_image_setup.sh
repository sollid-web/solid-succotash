#!/bin/bash

# ============================================================
# WolvCapital — Complete Image Setup Script
# Run this from your project root: bash wolvcapital_image_setup.sh
# Requires: curl, wget (pre-installed on most Linux systems)
# ============================================================

echo "🔵 WolvCapital Image Setup Starting..."
echo "================================================"

# Create public image directories
mkdir -p ./frontend/public/images/hero
mkdir -p ./frontend/public/images/sections
mkdir -p ./frontend/public/images/og
mkdir -p ./frontend/public/images/blog

echo "✅ Directories created"

# ============================================================
# IMAGE 1 — HERO BACKGROUND
# Abstract blue financial/network visual
# Source: Unsplash (free, no attribution required)
# ============================================================
echo ""
echo "⬇️  Downloading Hero Background..."

curl -L "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1920&q=85&fm=webp" \
  -o ./frontend/public/images/hero/hero-bg.webp \
  --silent --show-error

# Fallback if above fails
if [ ! -f ./frontend/public/images/hero/hero-bg.webp ] || [ ! -s ./frontend/public/images/hero/hero-bg.webp ]; then
  echo "   Trying fallback hero image..."
  curl -L "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=85&fm=webp" \
    -o ./frontend/public/images/hero/hero-bg.webp \
    --silent --show-error
fi

# Second fallback
if [ ! -f ./frontend/public/images/hero/hero-bg.webp ] || [ ! -s ./frontend/public/images/hero/hero-bg.webp ]; then
  echo "   Trying second fallback hero image..."
  curl -L "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=85&fm=webp" \
    -o ./frontend/public/images/hero/hero-bg.webp \
    --silent --show-error
fi

echo "   ✅ Hero background saved → /public/images/hero/hero-bg.webp"

# ============================================================
# IMAGE 2 — VIRTUAL CARD SECTION BACKGROUND
# Minimal desk / lifestyle image
# Source: Unsplash
# ============================================================
echo ""
echo "⬇️  Downloading Virtual Card Background..."

curl -L "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&q=80&fm=webp" \
  -o ./frontend/public/images/sections/card-bg.webp \
  --silent --show-error

if [ ! -f ./frontend/public/images/sections/card-bg.webp ] || [ ! -s ./frontend/public/images/sections/card-bg.webp ]; then
  echo "   Trying fallback card image..."
  curl -L "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&fm=webp" \
    -o ./frontend/public/images/sections/card-bg.webp \
    --silent --show-error
fi

echo "   ✅ Card background saved → /public/images/sections/card-bg.webp"

# ============================================================
# IMAGE 3 — HOW IT WORKS SECTION
# Clean process / workflow visual
# ============================================================
echo ""
echo "⬇️  Downloading Process Section Image..."

curl -L "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&fm=webp" \
  -o ./frontend/public/images/sections/process-bg.webp \
  --silent --show-error

echo "   ✅ Process image saved → /public/images/sections/process-bg.webp"

# ============================================================
# IMAGE 4 — BLOG DEFAULT COVER
# Finance / data analysis visual for blog posts
# ============================================================
echo ""
echo "⬇️  Downloading Blog Default Cover..."

curl -L "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&fm=webp" \
  -o ./frontend/public/images/blog/default-cover.webp \
  --silent --show-error

echo "   ✅ Blog cover saved → /public/images/blog/default-cover.webp"

# ============================================================
# IMAGE 5 — BLOG COVER 2 (Crypto/DeFi topics)
# ============================================================
echo ""
echo "⬇️  Downloading Blog Cover 2..."

curl -L "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80&fm=webp" \
  -o ./frontend/public/images/blog/crypto-cover.webp \
  --silent --show-error

echo "   ✅ Crypto blog cover saved → /public/images/blog/crypto-cover.webp"

# ============================================================
# IMAGE 6 — BLOG COVER 3 (Security/Compliance topics)
# ============================================================
echo ""
echo "⬇️  Downloading Blog Cover 3..."

curl -L "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&fm=webp" \
  -o ./frontend/public/images/blog/security-cover.webp \
  --silent --show-error

echo "   ✅ Security blog cover saved → /public/images/blog/security-cover.webp"

# ============================================================
# OG IMAGE — Generate via HTML/CSS (no download needed)
# Created as an SVG that can be screenshot or converted
# ============================================================
echo ""
echo "🎨 Generating OG Share Image (SVG)..."

cat > ./frontend/public/images/og/og-image.svg << 'SVGEOF'
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1E3A8A"/>
      <stop offset="100%" style="stop-color:#2A52BE"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid pattern -->
  <g opacity="0.06" stroke="#ffffff" stroke-width="0.5">
    <line x1="0" y1="105" x2="1200" y2="105"/>
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="150" y1="0" x2="150" y2="630"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="450" y1="0" x2="450" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="750" y1="0" x2="750" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="1050" y1="0" x2="1050" y2="630"/>
  </g>

  <!-- Decorative circle -->
  <circle cx="1050" cy="150" r="200" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.08"/>
  <circle cx="1050" cy="150" r="320" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.05"/>

  <!-- Logo dot -->
  <rect x="96" y="200" width="16" height="16" rx="3" fill="#e2f5ff"/>

  <!-- Logo text -->
  <text x="120" y="214" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="#ffffff">WolvCapital</text>

  <!-- Main headline -->
  <text x="96" y="310" font-family="system-ui, sans-serif" font-size="56" font-weight="700" fill="#ffffff" letter-spacing="-1">Managed Digital Asset</text>
  <text x="96" y="380" font-family="system-ui, sans-serif" font-size="56" font-weight="700" fill="#ffffff" letter-spacing="-1">Portfolios.</text>

  <!-- Subtext -->
  <text x="96" y="430" font-family="system-ui, sans-serif" font-size="22" fill="rgba(255,255,255,0.7)">Transparent fees. Institutional custody. No guaranteed returns.</text>

  <!-- Bottom strip -->
  <rect x="0" y="560" width="1200" height="70" fill="rgba(0,0,0,0.2)"/>

  <!-- Bottom badges -->
  <text x="96" y="602" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)" letter-spacing="2">FINCEN REGISTERED</text>
  <text x="96" y="602" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.3)" dx="200">·</text>
  <text x="320" y="602" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)" letter-spacing="2">KYC VERIFIED</text>
  <text x="320" y="602" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.3)" dx="170">·</text>
  <text x="510" y="602" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)" letter-spacing="2">INSTITUTIONAL CUSTODY</text>
  <text x="510" y="602" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.3)" dx="260">·</text>
  <text x="790" y="602" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)" letter-spacing="2">256-BIT ENCRYPTED</text>
</svg>
SVGEOF

echo "   ✅ OG image SVG saved → /public/images/og/og-image.svg"

# ============================================================
# VERIFY ALL DOWNLOADS
# ============================================================
echo ""
echo "================================================"
echo "📋 DOWNLOAD VERIFICATION"
echo "================================================"

files=(
  "./frontend/public/images/hero/hero-bg.webp"
  "./frontend/public/images/sections/card-bg.webp"
  "./frontend/public/images/sections/process-bg.webp"
  "./frontend/public/images/blog/default-cover.webp"
  "./frontend/public/images/blog/crypto-cover.webp"
  "./frontend/public/images/blog/security-cover.webp"
  "./frontend/public/images/og/og-image.svg"
)

for f in "${files[@]}"; do
  if [ -f "$f" ] && [ -s "$f" ]; then
    size=$(du -sh "$f" | cut -f1)
    echo "   ✅ $f ($size)"
  else
    echo "   ❌ MISSING: $f — download failed, see manual URLs below"
  fi
done

# ============================================================
# PRINT MANUAL DOWNLOAD URLS (fallback if curl fails)
# ============================================================
echo ""
echo "================================================"
echo "📎 MANUAL DOWNLOAD URLS (if any failed above)"
echo "================================================"
echo ""
echo "Hero background:"
echo "  https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1920&q=85"
echo "  https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=85"
echo "  https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=85"
echo ""
echo "Virtual card background:"
echo "  https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&q=80"
echo "  https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80"
echo ""
echo "Process section:"
echo "  https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
echo ""
echo "Blog covers:"
echo "  https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"
echo "  https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80"
echo "  https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
echo ""
echo "All images: Free to use, no attribution required (Unsplash license)"

echo ""
echo "================================================"
echo "🎨 IMPLEMENTATION CODE"
echo "================================================"
echo ""
echo "Add to HeroSection.tsx:"
echo '  <div style={{ backgroundImage: "url(/images/hero/hero-bg.webp)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, position: "absolute", inset: 0, zIndex: 0 }} />'
echo ""
echo "Add to VirtualCardSection.tsx:"
echo '  <div style={{ backgroundImage: "url(/images/sections/card-bg.webp)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.05, position: "absolute", inset: 0, zIndex: 0 }} />'
echo ""
echo "Add to layout.tsx <head>:"
echo '  <meta property="og:image" content="/images/og/og-image.svg" />'
echo '  <meta property="og:image:width" content="1200" />'
echo '  <meta property="og:image:height" content="630" />'
echo ""
echo "================================================"
echo "✅ WolvCapital Image Setup Complete"
echo "================================================"
