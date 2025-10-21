# 🚀 **Render Environment Variables - Email Configuration**

## 📧 **Email Variables to Set in Render Dashboard**

Copy these exact values into your Render Environment Variables:

### **🔑 Required Email Variables**

| **Variable Name** | **Value** | **Purpose** |
|-------------------|-----------|-------------|
| `SENDGRID_API_KEY` | `SG.YOUR_SENDGRID_API_KEY_HERE` | SendGrid email service ⚠️ **Replace with your actual SendGrid API key** |
| `DEFAULT_FROM_EMAIL` | `noreply@wolvcapital.com` | Default sender address |
| `ADMIN_EMAIL` | `admin@wolvcapital.com` | Administrative notifications |
| `SUPPORT_EMAIL` | `support@wolvcapital.com` | Customer support & welcome emails |
| `MARKETING_EMAIL` | `marketing@wolvcapital.com` | Promotional campaigns |
| `COMPLIANCE_EMAIL` | `compliance@wolvcapital.com` | Regulatory communications |
| `LEGAL_EMAIL` | `legal@wolvcapital.com` | Legal notices |
| `PRIVACY_EMAIL` | `privacy@wolvcapital.com` | Privacy-related communications |

---

## 🎯 **Step-by-Step Setup in Render:**

### **1. Access Render Dashboard**
1. Go to: https://dashboard.render.com/
2. Select your **WolvCapital** service
3. Click **"Environment"** tab

### **2. Add Each Variable**
For each email address above:
1. Click **"Add Environment Variable"**
2. Enter the **Variable Name** (exactly as shown)
3. Enter the **Value** (exactly as shown)
4. Click **"Save"**

### **3. Example Entry:**
```
Key: SENDGRID_API_KEY
Value: SG.YOUR_SENDGRID_API_KEY_HERE
```

```
Key: SUPPORT_EMAIL
Value: support@wolvcapital.com
```

---

## 📋 **Copy-Paste Ready Format:**

### **Variable 1:**
```
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
```

### **Variable 2:**
```
DEFAULT_FROM_EMAIL=noreply@wolvcapital.com
```

### **Variable 3:**
```
ADMIN_EMAIL=admin@wolvcapital.com
```

### **Variable 4:**
```
SUPPORT_EMAIL=support@wolvcapital.com
```

### **Variable 5:**
```
MARKETING_EMAIL=marketing@wolvcapital.com
```

### **Variable 6:**
```
COMPLIANCE_EMAIL=compliance@wolvcapital.com
```

### **Variable 7:**
```
LEGAL_EMAIL=legal@wolvcapital.com
```

### **Variable 8:**
```
PRIVACY_EMAIL=privacy@wolvcapital.com
```

---

## ✅ **After Adding All Variables:**

1. **Save Changes** - Render will automatically redeploy
2. **Wait 5-10 minutes** for deployment to complete
3. **Test email functions** on your live site
4. **Check logs** to confirm email configuration is working

---

## 🎯 **Email Function Usage After Deployment:**

- **Welcome Emails**: Automatically sent from `support@wolvcapital.com`
- **Marketing Campaigns**: Sent from `marketing@wolvcapital.com`
- **Admin Alerts**: Sent from `admin@wolvcapital.com`
- **Legal Notices**: Sent from `legal@wolvcapital.com`
- **Support Responses**: Sent from `support@wolvcapital.com`

---

## 🔍 **Verification:**

Once deployed, your email system will use these professional addresses for all communications, creating a more trustworthy and organized email experience for your WolvCapital users.

**Your production email system will be fully operational!** 🚀