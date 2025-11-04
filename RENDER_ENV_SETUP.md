# 🔧 Render Environment Variables Setup

## Current Status: Deployed but Environment Variables Not Set

You've successfully deployed to Render, but need to configure environment variables. Here's exactly what you need to set up:

---

## 🎯 **Step-by-Step Environment Variables Setup**

### **1. Access Your Render Service**
1. Go to **Render Dashboard**: https://dashboard.render.com/
2. Find your web service (should be named `wolvcapital-api` or similar)
3. Click on your service name to open it

### **2. Navigate to Environment Variables**
1. In your service dashboard, click the **"Environment"** tab
2. You'll see the environment variables section

---

## 📋 **Required Environment Variables**

Set these **exact** environment variables in Render:

### **🔑 Core Configuration**

**SECRET_KEY**
- **Value**: Click **"Generate"** button in Render to create a secure random key
- **Or use this one**: `django-insecure-ism+7l(h49h2v4(p9jg_9vlu)-m89nc_&pfztmavk_m4$6iwq*`
- **Required**: YES

**DEBUG**
- **Value**: `0`
- **Required**: YES

**DJANGO_SETTINGS_MODULE**
- **Value**: `wolvcapital.settings`
- **Required**: YES

### **🌐 Domain & CORS Configuration**

**ALLOWED_HOSTS**
- **Value**: `api.wolvcapital.com,wolvcapital-api.onrender.com`
- **Note**: Replace `wolvcapital-api` with your actual Render service name if different
- **Required**: YES

**CORS_ALLOWED_ORIGINS**
- **Value**: `https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com`
- **Required**: YES (for frontend to connect)

**CSRF_TRUSTED_ORIGINS**
- **Value**: `https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com`
- **Required**: YES

### **⚡ Performance Configuration**

**WEB_CONCURRENCY**
- **Value**: `2`
- **Required**: NO (but recommended)

### **🗄️ Database Configuration**

**DATABASE_URL**
- **This should be AUTO-SET** if you connected to existing database
- **If not set**: Go to your database service → Info tab → Copy "Internal Database URL"
- **Format**: `postgresql://user:password@host:port/wolvcapital`

---

## 🛠️ **How to Set Each Variable**

### **Method 1: Individual Setup**
For each environment variable above:

1. **Click "Add Environment Variable"**
2. **Enter Key**: (e.g., `SECRET_KEY`)
3. **Enter Value**: (copy exact value from above)
4. **Click "Save Changes"**

### **Method 2: Bulk Setup** 
Copy and paste these into Render's environment section:

```bash
SECRET_KEY=django-insecure-ism+7l(h49h2v4(p9jg_9vlu)-m89nc_&pfztmavk_m4$6iwq*
DEBUG=0
DJANGO_SETTINGS_MODULE=wolvcapital.settings
ALLOWED_HOSTS=api.wolvcapital.com,wolvcapital-api.onrender.com
CORS_ALLOWED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
CSRF_TRUSTED_ORIGINS=https://wolvcapital.com,https://www.wolvcapital.com,https://api.wolvcapital.com
WEB_CONCURRENCY=2
```

---

## 🔄 **After Setting Environment Variables**

### **1. Redeploy Service**
- After saving environment variables, Render will automatically redeploy
- **OR** manually trigger redeploy: Click "Manual Deploy" → "Deploy latest commit"

### **2. Monitor Deployment Logs**
Watch the deployment logs for:
- ✅ Migrations running successfully
- ✅ Static files collected
- ✅ Investment plans seeded
- ✅ Server starting on port (usually 10000)

### **3. Test Your API**
Once deployment completes, test these endpoints:

```bash
# Health check (should return {"status":"ok"})
https://your-service-name.onrender.com/healthz/

# Admin panel
https://your-service-name.onrender.com/admin/

# API endpoints  
https://your-service-name.onrender.com/api/plans/
```

---

## 🚨 **Important Notes**

### **Database Connection**
- If you're using your existing database, make sure:
  - Database service is running
  - `DATABASE_URL` points to correct database
  - Database name is `wolvcapital-db` (as in render.yaml)

### **Custom Domain Setup** 
- Once environment variables are working, you can add custom domain
- Go to Settings → Custom Domains → Add `api.wolvcapital.com`

### **CORS Configuration**
- The CORS settings allow your frontend (wolvcapital.com) to connect
- Make sure these domains match exactly where your frontend will be hosted

---

## 🔍 **Troubleshooting Common Issues**

### **Build Fails After Setting Variables**
- Check logs for specific error messages
- Ensure no typos in environment variable names
- Verify SECRET_KEY is properly generated

### **Database Connection Errors**
- Verify DATABASE_URL is set correctly
- Check if database service is running
- Ensure database name matches your existing database

### **CORS Errors**
- Verify CORS_ALLOWED_ORIGINS includes your frontend domains
- No trailing slashes in URLs
- Must use https:// for production domains

---

## ✅ **Final Verification Checklist**

After setting environment variables and redeploying:

- [ ] Service builds successfully (no errors in logs)
- [ ] Health endpoint returns 200 OK: `/healthz/`
- [ ] Admin panel loads: `/admin/`
- [ ] API endpoints return data: `/api/plans/`
- [ ] Database connection working (can see existing data)
- [ ] No CORS errors in browser console

---

## 🎯 **Expected Result**

After completing these steps:
- ✅ Django backend running properly on Render
- ✅ Connected to your existing database
- ✅ API endpoints accessible
- ✅ Ready for frontend integration
- ✅ All existing user data preserved

**Your service should be live at**: `https://your-service-name.onrender.com`

---

## 📞 **Next Steps After Environment Variables**

Once your backend is running properly:
1. **Test API endpoints** to verify functionality
2. **Set up custom domain** (`api.wolvcapital.com`)
3. **Configure Vercel frontend** to use new API URL
4. **Update DNS records** for domain split

**You're almost there!** 🚀