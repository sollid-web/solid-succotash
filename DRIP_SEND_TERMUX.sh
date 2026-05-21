#!/bin/bash
# ============================================
# WolvCapital Drip Campaign Batch Send Script
# For Termux/Android Terminal + Resend API
# ============================================
# 
# Usage:
#   1. Set API_KEY environment variable:
#      export RESEND_API_KEY="your_api_key_here"
#   2. Create a file emails.csv with: recipient@example.com
#   3. Run this script:
#      bash drip_send_termux.sh emails.csv
#
# Or send to individual:
#      bash drip_send_termux.sh rick@steenbock.me
#

set -e

# Configuration
API_KEY="${RESEND_API_KEY}"
FROM_EMAIL="support@mail.wolvcapital.com"
SITE_URL="https://wolvcapital.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/templates/emails"

if [ -z "$API_KEY" ]; then
    echo "❌ Error: RESEND_API_KEY not set"
    echo "   Run: export RESEND_API_KEY='your_key_here'"
    exit 1
fi

# Drip campaign emails (10 days)
declare -A EMAILS=(
    [1]='🎉 Welcome — Start staking with WolvCapital'
    [2]='📊 How WolvCapital Works — Staking, Rewards, Verification'
    [3]='🔍 Choose a Staking Plan — Pioneer, Vanguard, Horizon, Summit VIP'
    [4]='🚀 WOLV Token — Proof of your returns on BNB Chain'
    [5]='🛡️ Security & Audits — Institutional custody and verified contracts'
    [6]='⭐ Real customers — performance snapshots & reviews'
    [7]='💳 Access your funds — Virtual Card & payouts'
    [8]='❓ Frequently asked questions — KYC, staking, taxes, risks'
    [9]='⏰ Early access & limited reward pool'
    [10]='🚀 Ready to stake? Open your account and start earning WOLV'
)

load_template_html() {
    local day=$1
    local recipient=$2
    local first_name=${recipient%%@*}
    local template_file="$TEMPLATE_DIR/drip_campaign_day_${day}.html"

    if [ ! -f "$template_file" ]; then
        echo ""
        return
    fi

    local python_bin=""
    if command -v python3 >/dev/null 2>&1; then
        python_bin=python3
    elif command -v python >/dev/null 2>&1; then
        python_bin=python
    else
        echo ""
        return
    fi

    local dashboard_url="$SITE_URL/dashboard"
    local plans_url="$SITE_URL/plans"
    local wolv_token_url="$SITE_URL/wolv-token"
    local contact_url="$SITE_URL/contact"

    "$python_bin" - <<PY
import os, re
path = os.path.join(os.environ['TEMPLATE_FILE'])
with open(path, encoding='utf-8') as fd:
    html = fd.read()
replacements = {
    '{{ first_name }}': os.environ['FIRST_NAME'],
    '{{ first_name}}': os.environ['FIRST_NAME'],
    '{{dashboard_url}}': os.environ['DASHBOARD_URL'],
    '{{ dashboard_url }}': os.environ['DASHBOARD_URL'],
    '{{plans_url}}': os.environ['PLANS_URL'],
    '{{ plans_url }}': os.environ['PLANS_URL'],
    '{{wolv_token_url}}': os.environ['WOLV_TOKEN_URL'],
    '{{ wolv_token_url }}': os.environ['WOLV_TOKEN_URL'],
    '{{contact_url}}': os.environ['CONTACT_URL'],
    '{{ contact_url }}': os.environ['CONTACT_URL'],
}
for key, value in replacements.items():
    html = html.replace(key, value)
html = re.sub(r'{%\s*load static\s*%}', '', html)
print(html)
PY
}

# Function to send email
send_email() {
    local recipient=$1
    local day=$2
    local first_name=${recipient%%@*}
    local subject="${EMAILS[$day]}"
    local template_html

    if [ -f "$TEMPLATE_DIR/drip_campaign_day_${day}.html" ]; then
        template_html=$(FIRST_NAME="$first_name" TEMPLATE_FILE="$TEMPLATE_DIR/drip_campaign_day_${day}.html" DASHBOARD_URL="$SITE_URL/dashboard" PLANS_URL="$SITE_URL/plans" WOLV_TOKEN_URL="$SITE_URL/wolv-token" CONTACT_URL="$SITE_URL/contact" load_template_html "$day" "$recipient")
    fi

    if [ -z "$template_html" ]; then
        template_html="<html><body><p>Hi $first_name,</p><p>This is your drip email for day $day.</p></body></html>"
    fi

    # Build JSON payload using Python so jq is not required.
    python_bin=""
    if command -v python3 >/dev/null 2>&1; then
        python_bin=python3
    elif command -v python >/dev/null 2>&1; then
        python_bin=python
    else
        echo "❌ Error: python3 or python is required to encode email payload"
        return 1
    fi

    payload=$(FROM_EMAIL="$FROM_EMAIL" SEND_TO="$recipient" SEND_SUBJECT="$subject" SEND_HTML="$template_html" \
        $python_bin - <<'PY'
import json, os
obj = {
    'from': os.environ['FROM_EMAIL'],
    'to': os.environ['SEND_TO'],
    'subject': os.environ['SEND_SUBJECT'],
    'html': os.environ['SEND_HTML'],
}
print(json.dumps(obj))
PY
    )

    response=$(curl -s -X POST https://api.resend.com/emails \
        -H 'Content-Type: application/json' \
        -H "Authorization: Bearer $API_KEY" \
        -d "$payload")

    echo "$response"
}

# Main logic
DAY=0
input=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --day)
            shift
            DAY=$1
            shift
            ;;
        --help|-h)
            echo "Usage: bash drip_send_termux.sh [--day N] <email_or_csv_file>"
            echo "Example: bash drip_send_termux.sh --day 4 rick@steenbock.me"
            echo "Example: bash drip_send_termux.sh rick@steenbock.me"
            echo "Example: bash drip_send_termux.sh emails.csv"
            exit 0
            ;;
        *)
            if [ -z "$input" ]; then
                input="$1"
            else
                echo "Unknown extra argument: $1"
                exit 1
            fi
            shift
            ;;
    esac
done

if [ -z "$input" ]; then
    echo "Usage: bash drip_send_termux.sh [--day N] <email_or_csv_file>"
    echo "Example: bash drip_send_termux.sh --day 4 rick@steenbock.me"
    echo "Example: bash drip_send_termux.sh rick@steenbock.me"
    echo "Example: bash drip_send_termux.sh emails.csv"
    exit 1
fi

if [ -f "$input" ]; then
    # CSV file mode
    echo "📧 Sending drip emails from $input..."
    day=1
    while IFS= read -r email || [ -n "$email" ]; do
        email=$(echo "$email" | xargs)  # trim whitespace
        [ -z "$email" ] && continue
        
        echo "  Sending Day $day to $email..."
        result=$(send_email "$email" "$day")
        
        if echo "$result" | grep -q '"id"'; then
            echo "  ✅ Sent"
        else
            echo "  ❌ Failed: $result"
        fi
        
        day=$((day + 1))
        [ $day -gt 10 ] && day=1
        sleep 1
    done < "$input"
else
    if [ "$DAY" -gt 0 ]; then
        if [ "$DAY" -lt 1 ] || [ "$DAY" -gt 10 ]; then
            echo "❌ Invalid day: $DAY. Choose 1-10."
            exit 1
        fi
        echo "📧 Sending Day $DAY to $input..."
        result=$(send_email "$input" "$DAY")
        if echo "$result" | grep -q '"id"'; then
            echo "  ✅ Day $DAY sent to $input"
        else
            echo "  ❌ Failed: $result"
        fi
    else
        # Single email mode (loop through all 10 days)
        echo "📧 Sending full 10-day drip to $input..."
        for day in {1..10}; do
            echo "  Day $day/10..."
            result=$(send_email "$input" "$day")
            
            if echo "$result" | grep -q '"id"'; then
                echo "  ✅ Day $day sent"
            else
                echo "  ❌ Day $day failed: $result"
            fi
            
            sleep 1
        done
    fi
fi

echo ""
echo "✅ Done!"
