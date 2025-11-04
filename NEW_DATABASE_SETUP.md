# 🆕 New Database Environment Variables Setup

## ✅ **Your New Database Configuration**

You've created a fresh database - this is actually great! You'll have a clean deployment.

**Database Details:**
- **URL**: `postgresql://wolvcapital:HW9qcqAeDVbcxPnCs8vkv2pjZSYqOMuC@dpg-d45326chg0os73frhggg-a/wolvcapital_db`
- **Port**: `5432`
- **Database Name**: `wolvcapital_db`

---

## 🔧 **Complete Environment Variables for Render**

### **Copy These Exact Values into Render:**

```bash
SECRET_KEY=django-insecure-ism+7l(h49h2v4(p9jg_9vlu)-m89nc_&pfztmavk_m4$6iwq*
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings
DATABASE_URL=postgresql://wolvcapital:HW9qcqAeDVbcxPnCs8vkv2pjZSYqOMuC@dpg-d45326chg0os73frhggg-a/wolvcapital_db
ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
WEB_CONCURRENCY=2
```

---

## 🎯 **Step 1: Set Environment Variables (DO THIS FIRST)**

### **How to Add in Render Dashboard:**

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click your web service** (wolvcapital-api or similar)
3. **Click "Environment" tab**
4. **Add each variable**:

| Variable Name | Value |
|---------------|--------|
| `SECRET_KEY` | `django-insecure-ism+7l(h49h2v4(p9jg_9vlu)-m89nc_&pfztmavk_m4$6iwq*` |
| `DEBUG` | `0` |
| `DJANGO_SETTINGS_MODULE` | `wolvcapital.settings` |
| `DATABASE_URL` | `postgresql://wolvcapital:HW9qcqAeDVbcxPnCs8vkv2pjZSYqOMuC@dpg-d45326chg0os73frhggg-a/wolvcapital_db` |
| `ALLOWED_HOSTS` | `api.wolvcapital.com,wolvcapital-api.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com` |
| `CSRF_TRUSTED_ORIGINS` | `https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com` |
| `WEB_CONCURRENCY` | `2` |

### **⚡ Quick Method:**
1. Click **"Add Environment Variable"**
2. **Copy each line** from the code block above
3. **Paste Variable Name** and **Value**
4. **Click "Save Changes"**
5. **Repeat for all 8 variables**

### **🔄 After Adding Variables:**
- Render will **automatically redeploy**
- Watch the **deployment logs**
- Look for successful migration messages

---

## 🎯 **Step 2: Verify Database Setup**

### **What Will Happen During Deployment:**
✅ **Database migrations** will run (creating all tables)
✅ **Investment plans** will be seeded (4 plans)
✅ **Admin user** will be created (admin@wolvcapital.com / admin123)
✅ **Crypto wallets** will be set up
✅ **Fresh clean database** ready for production

### **Expected Log Messages:**
```
📦 Running migrations...
✅ Migrations completed successfully
💰 Seeding investment plans...
✅ Investment plans seed attempt 1 succeeded
👤 Setting up admin user...
✅ Admin user created: admin@wolvcapital.com
```

### **Test Your Deployment:**
After environment variables are set and deployed:

```bash
# Health check (should return {"status":"ok"})
https://your-service-name.onrender.com/healthz/

# Admin panel (login: admin@wolvcapital.com / admin123)
https://your-service-name.onrender.com/admin/

# API endpoints (should return 4 investment plans)
https://your-service-name.onrender.com/api/plans/
```

---

## 🌐 **Step 3: Custom Domain Setup (DO THIS SECOND)**

### **🔗 Set Up API Domain: api.wolvcapital.com**

#### **A. Add Custom Domain in Render:**
1. **In your Render service** → Click **"Settings"** tab
2. **Scroll to "Custom Domains"** section  
3. **Click "Add Custom Domain"**
4. **Enter**: `api.wolvcapital.com`
5. **Click "Save"**

#### **B. Get DNS Record from Render:**
Render will show you something like:
```
Type: CNAME
Name: api
Value: your-service-name.onrender.com
```

#### **C. Add DNS Record at Your Domain Provider:**
**At your domain registrar** (GoDaddy, Namecheap, etc.):
1. **Go to DNS Management** for wolvcapital.com
2. **Add CNAME Record**:
   - **Type**: `CNAME`
   - **Name**: `api`  
   - **Value**: `your-service-name.onrender.com` (from Render dashboard)
   - **TTL**: `3600` or `Auto`
3. **Save changes**

#### **D. Wait for DNS Propagation:**
- **Time**: 5-30 minutes
- **Test**: `https://api.wolvcapital.com/healthz/`
- **Should return**: `{"status":"ok"}`

---

## 🎯 **Step 4: Frontend Domain Setup (DO THIS THIRD)**

### **🔗 Set Up Frontend Domains on Vercel**

#### **A. In Vercel Dashboard:**
1. **Go to**: https://vercel.com/dashboard
2. **Select your Next.js project**
3. **Settings** → **Domains**
4. **Add domains**:
   - `wolvcapital.com`
   - `www.wolvcapital.com`

#### **B. Get DNS Records from Vercel:**
Vercel will show you:
```
For wolvcapital.com:
Type: A
Value: [Vercel IP address]

For www.wolvcapital.com:  
Type: CNAME
Value: [Vercel CNAME]
```

#### **C. Update DNS Records:**
**At your domain registrar**:
1. **Change/Update existing** A record for `@` (root domain)
   - **Type**: `A`
   - **Name**: `@`
   - **Value**: `[Vercel IP from dashboard]`
2. **Change/Update** CNAME record for `www`
   - **Type**: `CNAME` 
   - **Name**: `www`
   - **Value**: `[Vercel CNAME from dashboard]`

---

## 📋 **Final DNS Configuration**

After all setup, your DNS should look like:

| Record Type | Name | Value | Purpose |
|-------------|------|--------|---------|
| A | @ | [Vercel IP] | Frontend (wolvcapital.com) |
| CNAME | www | [Vercel CNAME] | Frontend (www.wolvcapital.com) |
| CNAME | api | [Render URL] | Backend (api.wolvcapital.com) |

---

## ✅ **Verification Checklist**

### **After Step 1 (Environment Variables):**
- [ ] All 8 environment variables added to Render
- [ ] Service redeployed successfully  
- [ ] Health check works: `https://your-service.onrender.com/healthz/`
- [ ] Admin panel accessible: `https://your-service.onrender.com/admin/`

### **After Step 2 (API Domain):**  
- [ ] Custom domain added in Render
- [ ] DNS CNAME record added at registrar
- [ ] API accessible: `https://api.wolvcapital.com/healthz/`
- [ ] SSL certificate active (green lock icon)

### **After Step 3 (Frontend Domain):**
- [ ] Frontend domains added in Vercel
- [ ] DNS A/CNAME records updated at registrar  
- [ ] Frontend loads: `https://wolvcapital.com`
- [ ] Frontend can call API without CORS errors

---

## 🚀 **Execution Order Summary**

1. ✅ **FIRST**: Set environment variables in Render (start here!)
2. ✅ **SECOND**: Set up `api.wolvcapital.com` domain  
3. ✅ **THIRD**: Set up `wolvcapital.com` frontend domain
4. ✅ **FOURTH**: Test full integration

---

## 🔧 **Benefits of New Database**

✅ **Clean slate** - no old data conflicts
✅ **Fresh migrations** - all tables created properly  
✅ **Default admin** - admin@wolvcapital.com / admin123
✅ **Seeded data** - investment plans ready
✅ **No migration issues** - brand new setup

**Start with Step 1 (environment variables) and let me know when that's working!** 🎯