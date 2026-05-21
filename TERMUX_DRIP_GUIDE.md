# WolvCapital Drip Campaign — Termux/Android Terminal Setup

**Send 10 personalized emails directly from your phone via API — no database needed.**

---

## Quick Start (Termux)

### 1. Install Termux (Android)
- Download: **[F-Droid](https://f-droid.org/packages/com.termux)** or **[Google Play](https://play.google.com/store/apps/details?id=com.termux)**

### 2. Open Termux & Install Dependencies

```bash
pkg update
pkg install curl jq
```

### 3. Get Your API Key

1. Go to **[Resend Console](https://resend.com/api-keys)**
2. Create/copy your API key
3. Copy the key to clipboard

### 4. Set API Key in Termux

```bash
export RESEND_API_KEY="re_xxxxxxxxxxxxx"
```

### 5. Download the Script

**Option A: Manual (Copy-Paste)**

Copy the script from this file into a new file in Termux:

```bash
cat > drip_send.sh << 'EOF'
# [paste the entire DRIP_SEND_TERMUX.sh content here]
EOF
chmod +x drip_send.sh
```

**Option B: Using curl**

```bash
curl -o drip_send.sh https://yourserver.com/DRIP_SEND_TERMUX.sh
chmod +x drip_send.sh
```

---

## Usage

### Send to Single Email

```bash
./drip_send.sh rick@steenbock.me
```

This sends **all 10 drip emails** (one per second) to that address.

### Send to Multiple Emails (CSV)

**Create `emails.csv`:**
```
user1@example.com
user2@example.com
user3@example.com
rick@steenbock.me
```

**Send:**
```bash
./drip_send.sh emails.csv
```

This cycles through **Day 1→2→3...→10** for each email in sequence.

---

## Commands Cheat Sheet

```bash
# Check if API key is set
echo $RESEND_API_KEY

# Send single email (all 10 days)
./drip_send.sh user@example.com

# Send batch from CSV
./drip_send.sh emails.csv

# Verify Resend API is working
curl -X POST https://api.resend.com/emails \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -d '{"from":"support@mail.wolvcapital.com","to":"test@example.com","subject":"Test","html":"<p>Test</p>"}'
```

---

## HTML Templates (10 Days)

All 10 email templates are stored in `/templates/emails/` in your repo:

- `drip_campaign_day_1.html` — Welcome
- `drip_campaign_day_2.html` — How WolvCapital Works
- `drip_campaign_day_3.html` — Staking Plans
- `drip_campaign_day_4.html` — WOLV Token
- `drip_campaign_day_5.html` — Security & Audits
- `drip_campaign_day_6.html` — Customer Stories
- `drip_campaign_day_7.html` — Virtual Card
- `drip_campaign_day_8.html` — FAQ
- `drip_campaign_day_9.html` — Early Advantage
- `drip_campaign_day_10.html` — Final CTA

To use **full original templates** (not simplified), modify the script to fetch HTML from your server or embed the full template files locally.

---

## Troubleshooting

### Error: "RESEND_API_KEY not set"
```bash
export RESEND_API_KEY="your_key_here"
```

### Error: "command not found: jq"
```bash
pkg install jq
```

### Error: "curl: (7) Failed to connect"
- Check internet connection in Termux
- Try: `ping google.com`

### Emails not sending
- Verify API key is valid
- Check recipient email is correct
- See response: Run curl command manually to test

---

## Advanced: Full HTML Templates

To use complete branded email templates:

1. **Copy template HTML** from repo files
2. **URL-encode** the HTML in the JSON payload
3. Or use **native HTML parsing** with a tool like `htmlq`

For now, the script uses **simplified HTML** that still shows branding and CTA links.

---

## Security Notes

- ⚠️ **Never commit API keys** to git
- Use: `export RESEND_API_KEY="..."` (session only)
- Or: Create `.env` file and source it:
  ```bash
  source .env  # Contains: export RESEND_API_KEY="..."
  ```
- Add `.env` to `.gitignore`

---

## Next Steps

- Test with 1 email first
- Build CSV with your recipient list
- Run batch send
- Monitor delivery via **[Resend Dashboard](https://resend.com)**

---

**Questions?** Check API docs: https://resend.com/docs/api-reference/emails/send
