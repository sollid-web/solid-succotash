# Custom Domain Setup for Vercel Frontend + Render Backend

## Overview
Your architecture will be:
- **Frontend** (Next.js): `wolvcapital.com` and `www.wolvcapital.com` → Vercel
- **Backend** (Django API): `api.wolvcapital.com` → Render

## Part 1: Configure Frontend Domains on Vercel

### Step 1: Add Domains in Vercel Dashboard

1. **Log into Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select your WolvCapital project

2. **Add Custom Domains**
   - Click **Settings** → **Domains**
   - Add these domains one by one:
     - `wolvcapital.com` (apex domain)
     - `www.wolvcapital.com` (www subdomain)

3. **Get DNS Records from Vercel**
   - For each domain, Vercel will show required DNS records
   - Note them down (they'll look like this):

   **For wolvcapital.com (apex)**:
   ```
   Type: A
   Name: @ (or root)
   Value: 76.76.21.21 (example - use actual IP from Vercel)
   ```

   **For www.wolvcapital.com**:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com (example - use actual from Vercel)
   ```

### Step 2: Update DNS Records at Your Domain Registrar

**IMPORTANT**: You need to remove/update existing DNS records that point to Render.

#### If using GoDaddy:
1. Log into GoDaddy → My Products → DNS
2. **Delete existing A/CNAME records** for @ and www that point to Render
3. Add new records from Vercel:
   - Type: `A`, Name: `@`, Value: `[Vercel IP]`, TTL: `600`
   - Type: `CNAME`, Name: `www`, Value: `[Vercel CNAME]`, TTL: `600`

#### If using Namecheap:
1. Log into Namecheap → Domain List → Manage
2. Advanced DNS tab
3. **Delete existing records** for @ and www
4. Add new records from Vercel

#### If using Cloudflare:
1. Log into Cloudflare → Select domain
2. DNS → **Delete existing A/CNAME records** for @ and www
3. Add new records from Vercel
4. **Set proxy status to "Proxied" (orange cloud)** for better performance

### Step 3: Configure WWW Redirect (Recommended)

1. **In Vercel Dashboard**:
   - Go to Settings → Domains
   - Click on `www.wolvcapital.com`
   - Set **Redirect to**: `wolvcapital.com`
   - Choose **Permanent Redirect (308)**

This ensures all visitors go to the clean apex domain.

## Part 2: Configure Backend API Domain on Render

### Step 1: Add API Subdomain in Render

1. **Deploy your Django app** to Render first (see RENDER_DEPLOYMENT_STEPS.md)

2. **Add Custom Domain**:
   - Go to Render Dashboard → Your web service
   - Settings → Custom Domains
   - Add: `api.wolvcapital.com`

3. **Get DNS Record from Render**:
   ```
   Type: CNAME
   Name: api
   Value: your-service-name.onrender.com
   ```

### Step 2: Add API DNS Record

At your domain registrar, add:
```
Type: CNAME
Name: api
Value: your-service-name.onrender.com
TTL: 600 or Auto
```

## Part 3: Update Environment Variables

### Update Vercel Environment Variables

1. **In Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Update or add:
     ```
     NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
     ```

2. **Redeploy Frontend**:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment

### Update Render Environment Variables

1. **In Render Dashboard**:
   - Go to your web service → Environment
   - Update these variables:
     ```bash
     ALLOWED_HOSTS=api.wolvcapital.com,your-service-name.onrender.com
     CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
     CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
     ```

2. **Save and Redeploy**: Render will automatically redeploy after saving changes.

## Part 4: DNS Configuration Summary

After setup, your DNS should look like this:

| Record Type | Name/Host | Value/Target | Purpose |
|-------------|-----------|--------------|---------|
| A | @ | [Vercel IP] | Frontend apex domain |
| CNAME | www | [Vercel CNAME] | Frontend www subdomain |
| CNAME | api | [Render URL] | Backend API subdomain |

## Part 5: Verification Steps

### Test Frontend (5-30 minutes after DNS update)

```bash
# Check DNS resolution
nslookup wolvcapital.com
nslookup www.wolvcapital.com

# Test in browser
https://wolvcapital.com
https://www.wolvcapital.com
```

Both should load your Next.js application.

### Test Backend API

```bash
# Check DNS resolution
nslookup api.wolvcapital.com

# Test health endpoint
curl https://api.wolvcapital.com/healthz/

# Should return: {"status":"ok"}
```

### Test Integration

1. Open https://wolvcapital.com in browser
2. Open Developer Tools (F12) → Network tab
3. Navigate through your app
4. Verify API calls go to `api.wolvcapital.com` and return 200 status

## Part 6: SSL Certificate Verification

Both Vercel and Render automatically provision SSL certificates:

### Vercel SSL
- Automatic Let's Encrypt certificates
- HTTPS redirect enabled by default
- No configuration needed

### Render SSL
- Automatic Let's Encrypt certificates
- Activated after domain verification
- Check status in Render dashboard

**Test SSL**:
- `https://wolvcapital.com` - should show green lock
- `https://api.wolvcapital.com` - should show green lock

## Part 7: Common Issues and Solutions

### DNS Not Propagating
- Wait up to 48 hours (usually 30 minutes)
- Use https://dnschecker.org to check global propagation
- Clear browser DNS cache: Chrome → Settings → Privacy → Clear browsing data

### CORS Errors After Domain Change
- Ensure CORS_ALLOWED_ORIGINS includes exact frontend domains
- Check no trailing slashes in environment variables
- Verify HTTPS vs HTTP in origins
- Redeploy both frontend and backend after changes

### API Calls Still Going to Old Domain
- Check NEXT_PUBLIC_API_URL in Vercel environment variables
- Verify no hardcoded API URLs in your code
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Redeploy frontend after environment variable changes

### SSL Certificate Issues
- Wait 10 minutes after domain verification
- Check domain verification status in provider dashboards
- Ensure no CAA records blocking Let's Encrypt
- Try removing and re-adding custom domain

## Part 8: Final Configuration Check

### Vercel Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://api.wolvcapital.com
```

### Render Environment Variables
```bash
SECRET_KEY=[auto-generated]
DEBUG=0
DATABASE_URL=[auto-set]
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=api.wolvcapital.com,your-service-name.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
WEB_CONCURRENCY=2
```

## Part 9: Production URLs

After successful setup:

- **Main Website**: https://wolvcapital.com
- **WWW Redirect**: https://www.wolvcapital.com → https://wolvcapital.com
- **API Base**: https://api.wolvcapital.com
- **Admin Panel**: https://api.wolvcapital.com/admin/
- **Health Check**: https://api.wolvcapital.com/healthz/

## Part 10: Migration from Render to Vercel Frontend

If your domain was previously pointing to Render for frontend:

1. **First ensure backend is deployed** to Render with API subdomain
2. **Then switch DNS** records to point apex/www to Vercel
3. **Update environment variables** on both platforms
4. **Test thoroughly** before announcing the change

## Troubleshooting Checklist

- [ ] DNS records updated at registrar
- [ ] 24-48 hours passed for full propagation
- [ ] SSL certificates active on both platforms
- [ ] Environment variables updated on both platforms
- [ ] Both frontend and backend redeployed after env changes
- [ ] CORS origins include all three domains (apex, www, api)
- [ ] No mixed content warnings in browser console
- [ ] API calls in Network tab show correct domain

Your custom domain setup will be complete! 🎉