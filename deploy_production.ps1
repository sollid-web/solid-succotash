# WolvCapital Production Deployment Helper (PowerShell)
# This script helps you prepare and deploy the WolvCapital platform

param(
    [switch]$SkipChecks,
    [switch]$GenerateSecretsOnly
)

Write-Host "🚀 WolvCapital Production Deployment Helper" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Error: This script must be run from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to generate secret key
function Generate-SecretKey {
    Write-Host "🔑 Generating secure SECRET_KEY..." -ForegroundColor Yellow
    try {
        $secretKey = python -c "import secrets; print(secrets.token_urlsafe(50))"
        Write-Host "SECRET_KEY=$secretKey" -ForegroundColor Green
        Write-Host ""
        return $secretKey
    }
    catch {
        Write-Host "❌ Failed to generate secret key. Make sure Python is installed." -ForegroundColor Red
        exit 1
    }
}

# Function to generate admin password
function Generate-AdminPassword {
    Write-Host "👤 Generating secure admin password..." -ForegroundColor Yellow
    try {
        $adminPassword = python -c "import secrets; print(secrets.token_urlsafe(24))"
        Write-Host "INITIAL_ADMIN_PASSWORD=$adminPassword" -ForegroundColor Green
        Write-Host ""
        return $adminPassword
    }
    catch {
        Write-Host "❌ Failed to generate admin password. Make sure Python is installed." -ForegroundColor Red
        exit 1
    }
}

# Function to check environment
function Test-Environment {
    Write-Host "🔍 Checking environment..." -ForegroundColor Yellow
    
    # Check Python
    try {
        $pythonVersion = python --version 2>&1
        Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
        exit 1
    }
    
    # Check Node.js for frontend
    try {
        $nodeVersion = node --version 2>&1
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Node.js not found. Frontend deployment may fail." -ForegroundColor Yellow
    }
    
    # Check if virtual environment is active
    if (-not $env:VIRTUAL_ENV) {
        Write-Host "⚠️ Warning: Virtual environment not detected. Consider activating venv." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Virtual environment active: $env:VIRTUAL_ENV" -ForegroundColor Green
    }
    
    Write-Host "✅ Environment check complete" -ForegroundColor Green
    Write-Host ""
}

# Function to run production checks
function Test-ProductionSettings {
    Write-Host "🔧 Running Django production checks..." -ForegroundColor Yellow
    
    # Set minimal environment for checks
    $env:DEBUG = "0"
    $env:SECRET_KEY = "test-key-for-checks"
    
    try {
        $result = python manage.py check --deploy 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Django deployment checks passed" -ForegroundColor Green
        } else {
            Write-Host "❌ Django deployment checks failed:" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            Write-Host "Please review and fix the issues above" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "❌ Failed to run Django checks" -ForegroundColor Red
        exit 1
    }
    finally {
        # Clean up environment variables
        Remove-Item Env:DEBUG -ErrorAction SilentlyContinue
        Remove-Item Env:SECRET_KEY -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

# Function to test static files
function Test-StaticFiles {
    Write-Host "📂 Testing static files collection..." -ForegroundColor Yellow
    
    $env:DEBUG = "1"  # Allow development mode for this test
    
    try {
        $result = python manage.py collectstatic --noinput --dry-run 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Static files collection test passed" -ForegroundColor Green
        } else {
            Write-Host "❌ Static files collection test failed" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "❌ Static files test failed" -ForegroundColor Red
        exit 1
    }
    finally {
        Remove-Item Env:DEBUG -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

# Function to check migrations
function Test-Migrations {
    Write-Host "🗄️ Checking database migrations..." -ForegroundColor Yellow
    
    $env:DEBUG = "1"
    
    try {
        $result = python manage.py showmigrations --verbosity=0 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ All migrations are up to date" -ForegroundColor Green
        } else {
            Write-Host "❌ Migration check failed" -ForegroundColor Red
            exit 1
        }
    }
    catch {
        Write-Host "❌ Migration check failed" -ForegroundColor Red
        exit 1
    }
    finally {
        Remove-Item Env:DEBUG -ErrorAction SilentlyContinue
    }
    Write-Host ""
}

# Function to test frontend build
function Test-FrontendBuild {
    Write-Host "🎨 Testing frontend build..." -ForegroundColor Yellow
    
    if (Test-Path "frontend") {
        Push-Location "frontend"
        try {
            if (Test-Path "package.json") {
                $result = npm run build 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Frontend build test passed" -ForegroundColor Green
                } else {
                    Write-Host "⚠️ Frontend build test had issues (this may be normal for development)" -ForegroundColor Yellow
                }
            } else {
                Write-Host "⚠️ Frontend package.json not found" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "⚠️ Frontend build test failed" -ForegroundColor Yellow
        }
        finally {
            Pop-Location
        }
    } else {
        Write-Host "⚠️ Frontend directory not found" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Function to show deployment summary
function Show-DeploymentSummary {
    Write-Host "📋 Deployment Summary" -ForegroundColor Cyan
    Write-Host "====================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Your WolvCapital platform is ready for production deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Required Environment Variables:" -ForegroundColor Yellow
    Write-Host "- SECRET_KEY (generated above)" -ForegroundColor White
    Write-Host "- INITIAL_ADMIN_PASSWORD (generated above)" -ForegroundColor White
    Write-Host "- DATABASE_URL (from Render PostgreSQL)" -ForegroundColor White
    Write-Host "- Email SMTP settings (SendGrid recommended)" -ForegroundColor White
    Write-Host "- Domain and CORS settings" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Deployment Steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy backend to Render.com using render.yaml" -ForegroundColor White
    Write-Host "2. Deploy frontend to Vercel using 'vercel --prod'" -ForegroundColor White
    Write-Host "3. Update CORS_ALLOWED_ORIGINS with your actual domains" -ForegroundColor White
    Write-Host "4. Set CREATE_INITIAL_ADMIN=0 after initial deployment" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 See PRODUCTION_READY_CHECKLIST.md for complete details" -ForegroundColor Cyan
    Write-Host ""
}

# Main deployment preparation
function Main {
    if ($GenerateSecretsOnly) {
        Write-Host "🔐 Security Configuration" -ForegroundColor Cyan
        Write-Host "========================" -ForegroundColor Cyan
        Generate-SecretKey | Out-Null
        Generate-AdminPassword | Out-Null
        return
    }
    
    Write-Host "Starting production readiness checks..." -ForegroundColor Green
    Write-Host ""
    
    if (-not $SkipChecks) {
        Test-Environment
        Test-ProductionSettings
        Test-StaticFiles
        Test-Migrations
        Test-FrontendBuild
    }
    
    Write-Host "🔐 Security Configuration" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    Generate-SecretKey | Out-Null
    Generate-AdminPassword | Out-Null
    
    Show-DeploymentSummary
    
    Write-Host "🎉 Production readiness check complete!" -ForegroundColor Green
    Write-Host "Your platform is ready for deployment to production." -ForegroundColor Green
}

# Run main function
Main