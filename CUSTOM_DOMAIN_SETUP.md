# Custom Domain Setup: wolvcapital.com

This guide shows how to configure your domain `wolvcapital.com` to work with the separated architecture.

## Domain Structure

```
wolvcapital.com              → Frontend (Vercel)
www.wolvcapital.com          → Frontend (Vercel, redirects to apex)
api.wolvcapital.com          → Backend API (Render)
```

---

## Part 1: Configure Backend Domain (api.wolvcapital.com)

### Step 1: Add Custom Domain in Render

1. Go to Render Dashboard → Your web service (`wolvcapital-api`)
2. Click **Settings** tab
3. Scroll to **Custom Domains** section
4. Click **Add Custom Domain**
5. Enter: `api.wolvcapital.com`
6. Click **Save**

### Step 2: Get DNS Records from Render

Render will provide DNS records. Note them down:

**Example**:
```
Type: CNAME
Name: api
Value: wolvcapital-api.onrender.com
```

Or (less common):
```
Type: A
Name: api
Value: 216.24.57.1  (example IP)
```

### Step 3: Add DNS Records to Your Domain Provider

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

1. Navigate to DNS Management for `wolvcapital.com`
2. Add the record from Step 2:
   
   **CNAME Record**:
   - Type: `CNAME`
   - Name: `api` (or `api.wolvcapital.com` depending on provider)
   - Value: `wolvcapital-api.onrender.com`
   - TTL: `3600` (1 hour) or `Auto`

3. Save changes

### Step 4: Verify DNS Propagation

Wait 5-30 minutes for DNS to propagate, then test:

```bash
# Check DNS resolution
nslookup api.wolvcapital.com

# Or using dig
dig api.wolvcapital.com

# Test the endpoint
curl https://api.wolvcapital.com/healthz/
```

### Step 5: Enable SSL on Render

1. Back in Render Dashboard
2. The custom domain should show **Verified** status
3. Render automatically provisions SSL certificate (Let's Encrypt)
4. Wait ~5 minutes for SSL to activate
5. Test: `https://api.wolvcapital.com/healthz/` should return `{"status":"ok"}`

---

## Part 2: Configure Frontend Domains (wolvcapital.com)

### Step 1: Add Custom Domains in Vercel

1. Go to Vercel Dashboard → Your project
2. Click **Settings** → **Domains**
3. Add both domains:
   - `wolvcapital.com`
   - `www.wolvcapital.com`

### Step 2: Get DNS Records from Vercel

For each domain, Vercel will provide records:

**For apex domain (wolvcapital.com)**:
```
Type: A
Name: @ (or wolvcapital.com)
Value: 76.76.21.21  (Vercel's IP)
```

**For www subdomain**:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Add DNS Records to Your Domain Provider

In your domain registrar's DNS management:

1. **Delete any existing A or CNAME records** for `@` and `www` that point elsewhere

2. **Add Apex Domain Record**:
   - Type: `A`
   - Name: `@` (represents root domain)
   - Value: `76.76.21.21` (use the IP Vercel provides)
   - TTL: `3600` or `Auto`

3. **Add WWW Subdomain Record**:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com` (use the value Vercel provides)
   - TTL: `3600` or `Auto`

4. Save changes

### Step 4: Verify DNS Propagation

Wait 5-30 minutes, then test:

```bash
# Check apex domain
nslookup wolvcapital.com

# Check www subdomain
nslookup www.wolvcapital.com

# Test in browser
https://wolvcapital.com
https://www.wolvcapital.com
```

### Step 5: Configure WWW Redirect (Optional but Recommended)

In Vercel Dashboard:
1. Go to **Settings** → **Domains**
2. Click on `www.wolvcapital.com`
3. Set **Redirect to**: `wolvcapital.com`
4. Enable **Permanent Redirect (308)**

This ensures all visitors go to the clean apex domain.

---

## Part 3: Update Django CORS Settings

The `render.yaml` is already configured, but verify in Render Dashboard:

1. Go to Render → Your web service → **Environment**
2. Confirm these values:

```bash
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com

CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com

ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
```

3. If you need to update them, click **Add Environment Variable** or edit existing
4. Click **Save** (triggers automatic redeploy)

---

## Part 4: Complete DNS Configuration Reference

Here's what your DNS records should look like:

### At Your Domain Registrar (wolvcapital.com)

| Type  | Name/Host | Value/Points To              | TTL  | Purpose                    |
|-------|-----------|------------------------------|------|----------------------------|
| A     | @         | 76.76.21.21                  | 3600 | Frontend apex domain       |
| CNAME | www       | cname.vercel-dns.com         | 3600 | Frontend www subdomain     |
| CNAME | api       | wolvcapital-api.onrender.com | 3600 | Backend API subdomain      |

**Note**: The IP addresses and CNAME values are examples. Use the exact values provided by Vercel and Render.

---

## Part 5: SSL/HTTPS Configuration

### Automatic SSL (Both Providers)

Both Vercel and Render automatically provision SSL certificates:

- **Vercel**: Uses Let's Encrypt, automatic renewal
- **Render**: Uses Let's Encrypt, automatic renewal

**No manual configuration needed!** ✅

### Force HTTPS

**Vercel** (automatic):
- All HTTP requests automatically redirect to HTTPS
- HSTS headers included by default

**Render** (already configured in Django):
```python
# In settings.py (already set when DEBUG=False)
SECURE_SSL_REDIRECT = not DEBUG
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

---

## Part 6: Verification Checklist

After DNS propagation (5-60 minutes), verify:

### Frontend Checks
- [ ] `https://wolvcapital.com` loads without SSL errors
- [ ] `https://www.wolvcapital.com` redirects to apex domain (or loads)
- [ ] No mixed content warnings in browser console
- [ ] Green padlock icon in browser address bar

### Backend Checks
- [ ] `https://api.wolvcapital.com/healthz/` returns `{"status":"ok"}`
- [ ] `https://api.wolvcapital.com/admin/` loads Django admin
- [ ] `https://api.wolvcapital.com/api/plans/` returns JSON data
- [ ] SSL certificate valid (check in browser)

### Integration Checks
- [ ] Frontend can fetch data from backend (no CORS errors)
- [ ] Login/signup works end-to-end
- [ ] Can create test investment/transaction
- [ ] Data appears in Django admin

### Browser Console Checks
Open browser DevTools (F12) → Console tab:
- [ ] No CORS errors
- [ ] No mixed content warnings
- [ ] API calls use `https://api.wolvcapital.com`

---

## Part 7: Common DNS Providers Setup

### GoDaddy
1. Log in → My Products → DNS
2. Click **Add** for each record
3. Wait 10-30 minutes for propagation

### Namecheap
1. Log in → Domain List → Manage
2. Advanced DNS tab → Add New Record
3. Wait 10-30 minutes for propagation

### Cloudflare
1. Log in → Select domain
2. DNS → Add record
3. **Important**: Set proxy status to "DNS only" (gray cloud) for API subdomain
4. Propagation is usually instant with Cloudflare

### Google Domains
1. Log in → My domains → DNS
2. Custom resource records → Create new record
3. Wait 10-30 minutes for propagation

### AWS Route 53
1. Hosted zones → Select wolvcapital.com
2. Create record
3. For Vercel: Use ALIAS record to CloudFront (or A record)
4. For Render: Use CNAME record

---

## Part 8: Testing After Setup

### 1. Test Backend API
```bash
# Health check
curl https://api.wolvcapital.com/healthz/

# Should return: {"status":"ok"}

# Test API endpoint
curl https://api.wolvcapital.com/api/plans/

# Should return: JSON array of investment plans
```

### 2. Test Frontend
Open in browser:
- `https://wolvcapital.com`
- `https://www.wolvcapital.com`

Both should load your Next.js application.

### 3. Test Integration
1. Open browser DevTools (F12) → Network tab
2. Navigate to wolvcapital.com
3. Look for API calls to `api.wolvcapital.com`
4. Verify they return 200 status codes

### 4. Test CORS
Open browser console (F12) and run:
```javascript
fetch('https://api.wolvcapital.com/api/plans/')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('CORS Error:', err));
```

Should print plan data without errors.

---

## Troubleshooting

### DNS Not Resolving

**Symptom**: Domain doesn't load or shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Solutions**:
1. Wait longer (DNS can take up to 48 hours, usually 30 minutes)
2. Clear DNS cache:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
3. Check DNS with online tools: https://dnschecker.org
4. Verify records are correct in registrar dashboard

### SSL Certificate Not Provisioning

**Symptom**: Browser shows "Not Secure" or certificate error

**Solutions**:
1. Wait 5-10 minutes after DNS verification
2. Ensure CAA records don't block Let's Encrypt
3. Check Render/Vercel dashboard for SSL status
4. Try removing and re-adding custom domain

### CORS Errors After Domain Setup

**Symptom**: `Access-Control-Allow-Origin` errors in console

**Solutions**:
1. Verify `CORS_ALLOWED_ORIGINS` includes all three domains
2. Ensure no trailing slashes in environment variables
3. Check exact match (http vs https, www vs non-www)
4. Redeploy backend after changing CORS settings
5. Clear browser cache and hard refresh (Ctrl+Shift+R)

### API Calls Going to Wrong Domain

**Symptom**: Frontend still calling `localhost` or `.onrender.com`

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Redeploy frontend after updating env vars
3. Check browser console → Network tab for actual request URLs

### Mixed Content Warnings

**Symptom**: "Mixed content" warnings in browser console

**Solutions**:
1. Ensure all assets loaded via HTTPS
2. Check `NEXT_PUBLIC_API_URL` uses `https://`
3. Verify no hardcoded `http://` URLs in code

---

## Environment Variables Final Check

### Render (Backend)
```bash
SECRET_KEY=<auto-generated>
DEBUG=0
DATABASE_URL=postgresql://...
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
WEB_CONCURRENCY=2
```

### Vercel (Frontend)
```bash
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
```

---

## Quick Reference

### URLs After Setup
- **Main Site**: https://wolvcapital.com
- **With WWW**: https://www.wolvcapital.com (redirects to apex)
- **API**: https://api.wolvcapital.com
- **Admin Panel**: https://api.wolvcapital.com/admin/
- **Health Check**: https://api.wolvcapital.com/healthz/

### DNS Records Summary
```
@ (apex)    → A record     → Vercel IP
www         → CNAME        → Vercel CNAME
api         → CNAME        → Render URL
```

### Testing Commands
```bash
# DNS checks
nslookup wolvcapital.com
nslookup www.wolvcapital.com
nslookup api.wolvcapital.com

# API tests
curl https://api.wolvcapital.com/healthz/
curl https://api.wolvcapital.com/api/plans/

# SSL check
curl -I https://wolvcapital.com
```

---

**Your custom domain is now fully configured!** 🎉

All services are accessible via:
- Production frontend: `https://wolvcapital.com`
- Production API: `https://api.wolvcapital.com`
