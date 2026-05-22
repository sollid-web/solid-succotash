#!/bin/bash
# Update email templates to use self-hosted fonts
# Run from repo root

set -e

FONTS_URL="${1:-/fonts/fonts.css}"  # Default to relative path for local dev

echo "🔄 Updating email templates to use self-hosted fonts..."
echo "Font URL: $FONTS_URL"
echo ""

# Pattern to replace
OLD_PATTERN="@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');"
NEW_PATTERN="@import url('$FONTS_URL');"

# Find and update all email templates
TEMPLATES=$(find . -path ./frontend -prune -o -name "*.html" -type f -print | grep -E "(templates/emails|drip-templates)" | head -20)

COUNT=0
for file in $TEMPLATES; do
    if [ -f "$file" ]; then
        if grep -q "fonts.googleapis.com" "$file"; then
            # Escape special chars for sed
            OLD_ESCAPED=$(printf '%s\n' "$OLD_PATTERN" | sed -e 's/[\/&]/\\&/g')
            NEW_ESCAPED=$(printf '%s\n' "$NEW_PATTERN" | sed -e 's/[\/&]/\\&/g')
            
            sed -i "s|$OLD_ESCAPED|$NEW_ESCAPED|g" "$file"
            echo "✓ Updated: $file"
            ((COUNT++))
        fi
    fi
done

echo ""
echo "✅ Updated $COUNT email template(s)"
echo ""
echo "Next steps:"
echo "1. Run: ./frontend/public/fonts/download-fonts.sh"
echo "2. Download fonts from https://gwfh.mranftl.com/"
echo "3. Extract font files to frontend/public/fonts/"
echo "4. Deploy and verify in browser DevTools (Network tab)"
