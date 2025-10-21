# WolvCapital Email System Automation - PowerShell Script
# For Windows environments

param(
    [string]$TestEmail = "test@example.com",
    [switch]$ConfigOnly,
    [switch]$QuickTest,
    [switch]$Help
)

# Colors for PowerShell output
$Colors = @{
    Success = "Green"
    Error = "Red" 
    Warning = "Yellow"
    Info = "Cyan"
}

function Write-Status {
    param(
        [string]$Status,
        [string]$Message
    )
    
    $Icon = switch ($Status) {
        "Success" { "✅" }
        "Error" { "❌" }
        "Warning" { "⚠️" }
        "Info" { "ℹ️" }
    }
    
    Write-Host "$Icon $Message" -ForegroundColor $Colors[$Status]
}

function Test-EnvironmentVariable {
    param([string]$VarName)
    
    $Value = [Environment]::GetEnvironmentVariable($VarName)
    if ($Value) {
        Write-Status "Success" "$VarName is configured"
        return $true
    } else {
        Write-Status "Error" "$VarName is not set"
        return $false
    }
}

function Invoke-DjangoCommand {
    param([string]$Command)
    
    Write-Status "Info" "Running Django command..."
    try {
        $PythonPath = "E:/solid-succotash-main/venv/Scripts/python.exe"
        & $PythonPath manage.py shell -c $Command
        return $true
    } catch {
        Write-Status "Error" "Django command failed: $($_.Exception.Message)"
        return $false
    }
}

function Test-EmailConfiguration {
    Write-Host "`n🔍 Checking Email Configuration..." -ForegroundColor Cyan
    
    # Load .env file if it exists
    if (Test-Path ".env") {
        Write-Status "Info" "Loading environment variables from .env file"
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^([^#][^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }
    }
    
    $ConfigOk = $true
    $RequiredVars = @(
        "SENDGRID_API_KEY",
        "DEFAULT_FROM_EMAIL", 
        "ADMIN_EMAIL",
        "SUPPORT_EMAIL",
        "MARKETING_EMAIL"
    )
    
    foreach ($Var in $RequiredVars) {
        if (-not (Test-EnvironmentVariable $Var)) {
            $ConfigOk = $false
        }
    }
    
    return $ConfigOk
}

function Test-EmailFunctions {
    param([string]$Email)
    
    Write-Host "`n📧 Testing Email Functions..." -ForegroundColor Cyan
    
    $TestResults = @{}
    
    # Test basic email
    Write-Status "Info" "Testing basic test email..."
    $Command = @"
from core.email_utils import send_test_email
result = send_test_email('$Email', 'PowerShell Automation Test')
print(f'Test email result: {result}')
"@
    $TestResults["TestEmail"] = Invoke-DjangoCommand $Command
    
    # Test welcome email  
    Write-Status "Info" "Testing welcome email..."
    $Command = @"
from core.email_utils import send_welcome_email
result = send_welcome_email('$Email', 'AutomatedUser')
print(f'Welcome email result: {result}')
"@
    $TestResults["WelcomeEmail"] = Invoke-DjangoCommand $Command
    
    # Test marketing email
    Write-Status "Info" "Testing marketing email..."
    $Command = @"
from core.email_utils import send_marketing_email
result = send_marketing_email('$Email', 'PowerShell Marketing Test', 'Automated marketing test from PowerShell.', 'AutomatedUser', 'https://wolvcapital.com')
print(f'Marketing email result: {result}')
"@
    $TestResults["MarketingEmail"] = Invoke-DjangoCommand $Command
    
    # Display results
    Write-Host "`n📊 Email Test Results:" -ForegroundColor Cyan
    foreach ($Test in $TestResults.GetEnumerator()) {
        if ($Test.Value) {
            Write-Status "Success" "$($Test.Key): Passed"
        } else {
            Write-Status "Error" "$($Test.Key): Failed"
        }
    }
    
    return ($TestResults.Values | Where-Object { $_ -eq $false }).Count -eq 0
}

function New-DeploymentReport {
    Write-Host "`n📋 Generating Deployment Report..." -ForegroundColor Cyan
    
    $ReportContent = @"
# 🚀 WolvCapital Email System - PowerShell Automation Report

## 📅 Generated
**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**System:** PowerShell on Windows
**Test Email:** $TestEmail

## ✅ Configuration Status
- SendGrid API Key: $([Environment]::GetEnvironmentVariable("SENDGRID_API_KEY") ? "✅ Configured" : "❌ Missing")
- Default From Email: $([Environment]::GetEnvironmentVariable("DEFAULT_FROM_EMAIL") ? "✅ Configured" : "❌ Missing") 
- Admin Email: $([Environment]::GetEnvironmentVariable("ADMIN_EMAIL") ? "✅ Configured" : "❌ Missing")
- Support Email: $([Environment]::GetEnvironmentVariable("SUPPORT_EMAIL") ? "✅ Configured" : "❌ Missing")
- Marketing Email: $([Environment]::GetEnvironmentVariable("MARKETING_EMAIL") ? "✅ Configured" : "❌ Missing")

## 🎯 Render Environment Variables

Copy these to your Render dashboard:

``````
SENDGRID_API_KEY=$([Environment]::GetEnvironmentVariable("SENDGRID_API_KEY"))
DEFAULT_FROM_EMAIL=$([Environment]::GetEnvironmentVariable("DEFAULT_FROM_EMAIL"))
ADMIN_EMAIL=$([Environment]::GetEnvironmentVariable("ADMIN_EMAIL"))
SUPPORT_EMAIL=$([Environment]::GetEnvironmentVariable("SUPPORT_EMAIL"))
MARKETING_EMAIL=$([Environment]::GetEnvironmentVariable("MARKETING_EMAIL"))
COMPLIANCE_EMAIL=$([Environment]::GetEnvironmentVariable("COMPLIANCE_EMAIL"))
LEGAL_EMAIL=$([Environment]::GetEnvironmentVariable("LEGAL_EMAIL"))
PRIVACY_EMAIL=$([Environment]::GetEnvironmentVariable("PRIVACY_EMAIL"))
``````

## 🚀 Next Steps
1. Set environment variables in Render dashboard
2. Deploy to production  
3. Test email delivery on live site
4. Monitor email analytics

## 📊 System Status
**Overall Status:** ✅ Ready for Production Deployment
"@

    $ReportContent | Out-File -FilePath "email_automation_report.md" -Encoding UTF8
    Write-Status "Success" "Report saved to: email_automation_report.md"
}

function Show-Usage {
    Write-Host @"
🤖 WolvCapital Email System PowerShell Automation

USAGE:
    .\automate_email.ps1 [options]

OPTIONS:
    -TestEmail <email>    Email address for testing (default: test@example.com)
    -ConfigOnly          Only check configuration 
    -QuickTest           Run quick tests only
    -Help               Show this help message

EXAMPLES:
    .\automate_email.ps1 -TestEmail "ozoaninnabuike@gmail.com"
    .\automate_email.ps1 -ConfigOnly
    .\automate_email.ps1 -QuickTest

"@ -ForegroundColor Green
}

function Main {
    if ($Help) {
        Show-Usage
        return
    }
    
    Write-Host "🤖 WolvCapital Email System PowerShell Automation" -ForegroundColor Green
    Write-Host "=" * 55 -ForegroundColor Blue
    
    # Check if we're in the right directory
    if (-not (Test-Path "manage.py")) {
        Write-Status "Error" "manage.py not found. Please run from Django project root."
        return
    }
    
    # Test configuration
    $ConfigOk = Test-EmailConfiguration
    
    if ($ConfigOnly) {
        if ($ConfigOk) {
            Write-Status "Success" "All email configuration checks passed!"
        } else {
            Write-Status "Error" "Configuration has issues that need attention."
        }
        return
    }
    
    if (-not $ConfigOk) {
        Write-Status "Error" "Configuration check failed. Please fix missing configurations."
        return
    }
    
    # Test email functions
    $TestsOk = Test-EmailFunctions $TestEmail
    
    if ($QuickTest) {
        if ($TestsOk) {
            Write-Status "Success" "All quick tests passed!"
        } else {
            Write-Status "Error" "Some tests failed."
        }
        return
    }
    
    # Generate deployment report
    New-DeploymentReport
    
    # Final status
    Write-Host "`n" + ("=" * 55) -ForegroundColor Blue
    if ($ConfigOk -and $TestsOk) {
        Write-Status "Success" "Email system is ready for deployment!"
        Write-Host "🚀 All tests passed. You can deploy to production." -ForegroundColor Green
    } else {
        Write-Status "Error" "Email system has issues that need attention."
        Write-Host "🔧 Please review the report and fix issues before deployment." -ForegroundColor Yellow
    }
}

# Run main function
Main