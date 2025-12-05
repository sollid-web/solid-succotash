# DNS Configuration for wolvcapital.com

## Quick Setup Guide

### 1. DNS Records to Add

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these records:

```
┌──────────────────────────────────────────────────────────────────┐
│ DNS Records for wolvcapital.com                                  │
├────────┬──────────┬──────────────────────────────┬──────┬────────┤
│ Type   │ Name     │ Value                        │ TTL  │ Service│
├────────┼──────────┼──────────────────────────────┼──────┼────────┤
│ A      │ @        │ 76.76.21.21                  │ 3600 │ Vercel │
│ CNAME  │ www      │ cname.vercel-dns.com         │ 3600 │ Vercel │
│ CNAME  │ api      │ wolvcapital-api.onrender.com │ 3600 │ Render │
└────────┴──────────┴──────────────────────────────┴──────┴────────┘

⚠️  Note: Use the ACTUAL values from Vercel and Render dashboards
    The IPs above are examples only!
```

### 2. Where to Find the Correct Values

**Vercel (Frontend)**:
1. Go to https://vercel.com/dashboard
2. Select your project → Settings → Domains
3. Add `wolvcapital.com` → Note the A record IP
4. Add `www.wolvcapital.com` → Note the CNAME value

**Render (Backend)**:
1. Go to https://dashboard.render.com
2. Select your web service → Settings
3. Custom Domains → Add `api.wolvcapital.com`
4. Note the CNAME value (usually `wolvcapital-api.onrender.com`)

---

## Step-by-Step for Popular Providers

### GoDaddy
```
1. Login → My Products → wolvcapital.com → DNS
2. Click "Add" button
3. Add each record:
   - Type: Select from dropdown
   - Name: Enter @, www, or api
   - Value: Paste the value
   - TTL: 1 Hour
4. Click Save
5. Wait 10-30 minutes
```

### Namecheap
```
1. Login → Domain List → wolvcapital.com → Manage
2. Advanced DNS tab
3. Click "Add New Record"
4. Add each record:
   - Type: Select from dropdown
   - Host: Enter @, www, or api
   - Value: Paste the value
   - TTL: Automatic
5. Click ✓ (checkmark)
6. Wait 10-30 minutes
```

### Cloudflare
```
1. Login → Select wolvcapital.com
2. DNS tab
3. Click "Add record"
4. Add each record:
   - Type: Select from dropdown
   - Name: Enter @, www, or api
   - Content: Paste the value
   - Proxy status: DNS only (gray cloud) for API
   - TTL: Auto
5. Click Save
6. Usually instant (Cloudflare is fast!)
```

#### Automating Cloudflare DNS updates
- Copy `ops/cloudflare_dns_records.example.json` to `ops/cloudflare_dns_records.json` and replace the placeholder values with the real SPF/DKIM/DMARC/BIMI strings from your providers.
- Create a Cloudflare API token with **Zone → DNS → Edit** permissions and export it locally (`$Env:CF_API_TOKEN = "..."`).
- Run `python tools/cloudflare_dns_sync.py --zone-id <ZONE_ID> --dry-run` to preview the changes; drop `--dry-run` when ready to push.
- The script normalizes `@` and subdomains automatically, so keep names short like `@`, `www`, `_dmarc`, `_domainkey.mail`, etc.
- Logs will show `CREATE`, `UPDATE`, or `SKIP` for each record so you can audit what changed before promoting to production.

---

## After Adding DNS Records

### Wait for Propagation
DNS typically takes **10-30 minutes** to propagate worldwide.

### Check Propagation Status
```bash
# Check if DNS is working
nslookup wolvcapital.com
nslookup www.wolvcapital.com
nslookup api.wolvcapital.com

# Or use online tool
https://dnschecker.org
```

### Test Your Domains
```bash
# Test frontend
curl -I https://wolvcapital.com

# Test backend
curl https://api.wolvcapital.com/healthz/
```

---

## Environment Variables to Set

### On Render (Backend)
Already configured in `render.yaml`:
```
ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
```

### On Vercel (Frontend)
Already configured in `frontend/vercel.json`:
```
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
```

---

## Verification Checklist

After DNS propagation (10-60 minutes):

- [ ] `https://wolvcapital.com` loads ✅
- [ ] `https://www.wolvcapital.com` loads (or redirects) ✅
- [ ] `https://api.wolvcapital.com/healthz/` returns `{"status":"ok"}` ✅
- [ ] All sites show green padlock (SSL working) ✅
- [ ] No CORS errors in browser console ✅

---

## Troubleshooting

### DNS Not Working After 1 Hour
```
1. Double-check records are entered correctly
2. Ensure no typos in Name or Value fields
3. Delete old conflicting records
4. Try a different DNS lookup tool
5. Contact your domain registrar support
```

### SSL Certificate Not Showing
```
1. Wait 5-10 more minutes after DNS resolves
2. Check domain status in Vercel/Render dashboard
3. Try removing and re-adding the domain
4. Verify CAA records aren't blocking Let's Encrypt
```

### CORS Errors
```
1. Verify environment variables are exact (no trailing slashes)
2. Redeploy backend on Render
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check browser console for exact error message
```

---

## Visual Architecture

```
┌─────────────────────────────────────────────────────────┐
│ User enters: wolvcapital.com                            │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ DNS Lookup
                   ▼
┌─────────────────────────────────────────────────────────┐
│ DNS: @ record → 76.76.21.21 (Vercel IP)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Vercel CDN serves Next.js app                           │
│ Frontend makes API calls to:                            │
│ https://api.wolvcapital.com/api/*                       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ API Request
                   ▼
┌─────────────────────────────────────────────────────────┐
│ DNS: api CNAME → wolvcapital-api.onrender.com           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Render serves Django REST API                           │
│ Returns JSON response                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Final URLs

After setup complete:

| Purpose           | URL                               |
|-------------------|-----------------------------------|
| Main Website      | https://wolvcapital.com           |
| WWW (redirect)    | https://www.wolvcapital.com       |
| API Base          | https://api.wolvcapital.com       |
| API Health        | https://api.wolvcapital.com/healthz/ |
| API Plans         | https://api.wolvcapital.com/api/plans/ |
| Django Admin      | https://api.wolvcapital.com/admin/ |

---

**Need help?** See full guide in `CUSTOM_DOMAIN_SETUP.md`
