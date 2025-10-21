# 🤖 WolvCapital Email System Automation

## 📋 **Automation Scripts Overview**

This automation suite provides comprehensive testing and deployment tools for the WolvCapital email system.

---

## 🚀 **Quick Start - Run Automation**

### **Windows (PowerShell):**
```powershell
# Full automation with real email test
.\automate_email.ps1 -TestEmail "ozoaninnabuike@gmail.com"

# Quick configuration check only
.\automate_email.ps1 -ConfigOnly

# Quick tests without deployment report
.\automate_email.ps1 -QuickTest
```

### **Linux/macOS (Bash):**
```bash
# Make script executable
chmod +x automate_email.sh

# Full automation with real email test
./automate_email.sh ozoaninnabuike@gmail.com

# Configuration check only
./automate_email.sh --help
```

### **Python (Cross-platform):**
```bash
# Full automation suite
python automate_email.py --test-email ozoaninnabuike@gmail.com

# Configuration check only
python automate_email.py --config-only

# Quick tests only
python automate_email.py --quick-test
```

---

## ✅ **What the Automation Does**

### **1. Configuration Verification**
- ✅ Checks all required environment variables
- ✅ Validates SendGrid API key
- ✅ Verifies all email addresses are configured
- ✅ Tests Django configuration

### **2. Email Function Testing**
- ✅ Tests `send_test_email()` function
- ✅ Tests `send_welcome_email()` with templates
- ✅ Tests `send_marketing_email()` with CTA
- ✅ Tests `send_support_email()` functionality
- ✅ Tests `send_admin_alert()` system

### **3. Real Email Delivery**
- ✅ Sends actual test emails to specified address
- ✅ Verifies SendGrid integration works
- ✅ Tests HTML template rendering
- ✅ Confirms email formatting and delivery

### **4. Deployment Preparation**
- ✅ Generates deployment checklist
- ✅ Creates environment variable list for Render
- ✅ Provides production readiness report
- ✅ Lists next steps for deployment

---

## 📊 **Automation Output**

### **Configuration Check:**
```
🔍 Checking Email Configuration...
  ✅ SendGrid API Key: Configured
  ✅ Default From Email: Configured  
  ✅ Admin Email: Configured
  ✅ Support Email: Configured
  ✅ Marketing Email: Configured
```

### **Email Testing Results:**
```
📧 Testing Email Functions...
  ✅ Test Email: Success
  ✅ Welcome Email: Success
  ✅ Marketing Email: Success
  ✅ Support Email: Success
  ✅ Admin Alert: Success
```

### **Real Email Delivery:**
```
📮 Sending Real Test Email to ozoaninnabuike@gmail.com...
  ✅ Welcome Email: Sent Successfully
  ✅ Marketing Email: Sent Successfully
```

---

## 📁 **Generated Files**

The automation creates several helpful files:

1. **`email_system_report.json`** - Technical report with test results
2. **`email_automation_report.md`** - Human-readable deployment report  
3. **`deployment_checklist.md`** - Step-by-step deployment guide

---

## 🎯 **Use Cases**

### **Before Each Deployment:**
```powershell
.\automate_email.ps1 -TestEmail "your-email@gmail.com"
```

### **Quick Health Check:**
```powershell
.\automate_email.ps1 -ConfigOnly
```

### **Development Testing:**
```powershell
.\automate_email.ps1 -QuickTest
```

### **Production Verification:**
```bash
python automate_email.py --test-email "real-user@example.com"
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"manage.py not found"**
   - Run script from Django project root directory

2. **"SENDGRID_API_KEY not set"**
   - Ensure `.env` file exists with all email variables

3. **"Django configuration check failed"**
   - Run `python manage.py check` to see specific issues

4. **Email tests failing**
   - Check SendGrid API key validity
   - Verify internet connection
   - Check SendGrid account status

---

## 🚀 **Integration with CI/CD**

You can integrate these scripts into your deployment pipeline:

```yaml
# GitHub Actions example
- name: Test Email System
  run: python automate_email.py --quick-test

- name: Generate Deployment Report  
  run: python automate_email.py --config-only
```

---

## 🎉 **Success Criteria**

The automation passes when:
- ✅ All environment variables configured
- ✅ All email functions working
- ✅ Real email delivery successful
- ✅ Templates rendering correctly
- ✅ SendGrid integration operational

**Result: 🚀 System Ready for Production Deployment!**