# Pre-Deployment Verification Script for WolvCapital (PowerShell)
# Run this before deploying to Render

Write-Host "🚀 WolvCapital Pre-Deployment Checks" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Initialize counters
$passed = 0
$failed = 0

# Function to run a check
function Run-Check {
    param(
        [string]$checkName,
        [scriptblock]$command
    )
    
    Write-Host "🔍 $checkName... " -NoNewline
    
    try {
        $result = & $command
        if ($LASTEXITCODE -eq 0 -or $result) {
            Write-Host "✅ PASS" -ForegroundColor Green
            $script:passed++
            return $true
        } else {
            Write-Host "❌ FAIL" -ForegroundColor Red
            $script:failed++
            return $false
        }
    } catch {
        Write-Host "❌ FAIL" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

# Function to run verbose check
function Run-CheckVerbose {
    param(
        [string]$checkName,
        [scriptblock]$command
    )
    
    Write-Host "🔍 $checkName:" -ForegroundColor Yellow
    
    try {
        $result = & $command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PASS" -ForegroundColor Green
            $script:passed++
            Write-Host ""
            return $true
        } else {
            Write-Host "❌ FAIL" -ForegroundColor Red
            $script:failed++
            Write-Host ""
            return $false
        }
    } catch {
        Write-Host "❌ FAIL" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        $script:failed++
        Write-Host ""
        return $false
    }
}

Write-Host "📋 Basic System Checks" -ForegroundColor Yellow
Write-Host "======================"

# Check Python version
Run-Check "Python Version (3.9+)" {
    $version = python --version 2>$null
    return $version -match "Python 3\.(9|1[0-9])"
}

# Check Django installation
Run-Check "Django Installation" {
    python -c "import django; print(django.VERSION)" 2>$null
    return $LASTEXITCODE -eq 0
}

# Check required packages
Run-Check "Required Packages" {
    python -c "import django, rest_framework, allauth, whitenoise, psycopg2" 2>$null
    return $LASTEXITCODE -eq 0
}

Write-Host ""
Write-Host "📋 Django Configuration Checks" -ForegroundColor Yellow
Write-Host "==============================="

# Django system check
Run-CheckVerbose "Django System Check" {
    python manage.py check --fail-level WARNING
}

# Static files check
Run-CheckVerbose "Static Files Collection" {
    python manage.py collectstatic --noinput --verbosity 0
}

Write-Host "📋 Code Quality Checks" -ForegroundColor Yellow
Write-Host "======================"

# Run tests (simplified for PowerShell)
Write-Host "🔍 Running Basic Test Check:" -ForegroundColor Yellow
try {
    python manage.py check 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Django configuration tests passed" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ Django configuration has issues" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "❌ Test check failed" -ForegroundColor Red
    $failed++
}
Write-Host ""

Write-Host "📋 Deployment Files Check" -ForegroundColor Yellow
Write-Host "========================="

$criticalFiles = @(
    "requirements.txt",
    "render.yaml", 
    "start.sh",
    "manage.py",
    "wolvcapital/settings.py",
    "wolvcapital/wsgi.py"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "❌ $file missing" -ForegroundColor Red
        $failed++
    }
}
Write-Host ""

# Check render.yaml configuration
Write-Host "🔍 Render Configuration Check:" -ForegroundColor Yellow
if (Select-String -Path "render.yaml" -Pattern "wolvcapital-db" -Quiet) {
    Write-Host "✅ Database reference found in render.yaml" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ Database reference missing in render.yaml" -ForegroundColor Red
    $failed++
}

if (Select-String -Path "render.yaml" -Pattern "bash start.sh" -Quiet) {
    Write-Host "✅ Start command configured" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ Start command missing" -ForegroundColor Red
    $failed++
}
Write-Host ""

# Check environment variables in render.yaml
Write-Host "📋 Environment Variables Check" -ForegroundColor Yellow
Write-Host "=============================="

$envVars = @(
    @{Name="SECRET_KEY"; Desc="Generate on Render"},
    @{Name="DEBUG"; Desc="Should be 0 in production"},
    @{Name="ALLOWED_HOSTS"; Desc="Should include your domain"},
    @{Name="CORS_ALLOWED_ORIGINS"; Desc="Should include frontend URLs"}
)

foreach ($envVar in $envVars) {
    if (Select-String -Path "render.yaml" -Pattern $envVar.Name -Quiet) {
        Write-Host "✅ $($envVar.Name) configured ($($envVar.Desc))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $($envVar.Name) needs manual setup ($($envVar.Desc))" -ForegroundColor Yellow
    }
}
Write-Host ""

# Summary
Write-Host "📊 SUMMARY" -ForegroundColor Cyan
Write-Host "=========="
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All checks passed! Ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "=============="
    Write-Host "1. Push code to GitHub if not already done"
    Write-Host "2. Go to Render Dashboard: https://dashboard.render.com/"
    Write-Host "3. Create new Web Service from your GitHub repo"
    Write-Host "4. Use existing database: wolvcapital-db"
    Write-Host "5. Set environment variables as shown in render.yaml"
    Write-Host "6. Deploy and monitor logs"
    Write-Host ""
    Write-Host "🔗 Quick Deploy URLs:" -ForegroundColor Cyan
    Write-Host "- Render Dashboard: https://dashboard.render.com/"
    Write-Host "- Your repo: https://github.com/sollid-web/solid-succotash"
    Write-Host ""
} else {
    Write-Host "⚠️  $failed checks failed. Fix issues before deployment." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Common Fixes:" -ForegroundColor Yellow
    Write-Host "================"
    Write-Host "- Install missing packages: pip install -r requirements.txt"
    Write-Host "- Run migrations: python manage.py migrate"  
    Write-Host "- Fix Django issues: python manage.py check"
    Write-Host "- Update render.yaml if needed"
    Write-Host ""
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")