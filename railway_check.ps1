# Railway Pre-Deployment Checklist
# PowerShell version for Windows

Write-Host "🚂 Railway Pre-Deployment Checklist for WolvCapital" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0
$WARNINGS = 0

# Function to check if file exists
function Check-File {
    param($FilePath, $Description)
    if (Test-Path $FilePath) {
        Write-Host "✓ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $Description missing" -ForegroundColor Red
        $script:ERRORS++
        return $false
    }
}

# Function to check command
function Check-Command {
    param($Command, $Description)
    try {
        Invoke-Expression "$Command 2>&1 | Out-Null"
        Write-Host "✓ $Description" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "✗ $Description failed" -ForegroundColor Red
        $script:ERRORS++
        return $false
    }
}

Write-Host "1. Checking required files..." -ForegroundColor Yellow
Write-Host "-----------------------------"
Check-File "requirements.txt" "requirements.txt exists"
Check-File "manage.py" "manage.py exists"
Check-File "Procfile" "Procfile exists"
Check-File "railway.json" "railway.json exists"
Check-File "nixpacks.toml" "nixpacks.toml exists"
Check-File "start.sh" "start.sh exists"
Check-File "runtime.txt" "runtime.txt exists"
Write-Host ""

Write-Host "2. Checking Python version..." -ForegroundColor Yellow
Write-Host "-----------------------------"
if (Test-Path "runtime.txt") {
    $pythonVersion = Get-Content "runtime.txt"
    Write-Host "✓ Python version specified: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "! runtime.txt not found - Railway will use default Python" -ForegroundColor Yellow
    $WARNINGS++
}
Write-Host ""

Write-Host "3. Validating Django configuration..." -ForegroundColor Yellow
Write-Host "-------------------------------------"
try {
    python manage.py check --deploy 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Django deployment checks passed" -ForegroundColor Green
    } else {
        Write-Host "✗ Django deployment checks failed" -ForegroundColor Red
        Write-Host "Run: python manage.py check --deploy" -ForegroundColor Yellow
        $ERRORS++
    }
} catch {
    Write-Host "✗ Django deployment checks failed" -ForegroundColor Red
    $ERRORS++
}
Write-Host ""

Write-Host "4. Checking database migrations..." -ForegroundColor Yellow
Write-Host "----------------------------------"
try {
    $migrations = python manage.py showmigrations 2>&1
    if ($migrations -match "\[ \]") {
        Write-Host "! Unapplied migrations found" -ForegroundColor Yellow
        Write-Host "Migrations will run automatically on Railway" -ForegroundColor Cyan
        $WARNINGS++
    } else {
        Write-Host "✓ All migrations applied (or database not configured)" -ForegroundColor Green
    }
} catch {
    Write-Host "! Could not check migrations" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "5. Checking static files..." -ForegroundColor Yellow
Write-Host "---------------------------"
try {
    python manage.py collectstatic --noinput --dry-run 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Static files collection configured" -ForegroundColor Green
    } else {
        Write-Host "✗ Static files collection failed" -ForegroundColor Red
        $ERRORS++
    }
} catch {
    Write-Host "✗ Static files collection failed" -ForegroundColor Red
    $ERRORS++
}
Write-Host ""

Write-Host "6. Checking required Django apps..." -ForegroundColor Yellow
Write-Host "-----------------------------------"
$requiredApps = @("core", "users", "investments", "transactions", "api")
foreach ($app in $requiredApps) {
    if (Test-Path $app -PathType Container) {
        Write-Host "✓ $app app exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $app app missing" -ForegroundColor Red
        $ERRORS++
    }
}
Write-Host ""

Write-Host "7. Checking dependencies..." -ForegroundColor Yellow
Write-Host "----------------------------"
$requiredPackages = @("Django", "gunicorn", "psycopg2-binary", "whitenoise", "djangorestframework")
$requirements = Get-Content "requirements.txt" -Raw
foreach ($package in $requiredPackages) {
    if ($requirements -match $package) {
        Write-Host "✓ $package in requirements.txt" -ForegroundColor Green
    } else {
        Write-Host "✗ $package missing from requirements.txt" -ForegroundColor Red
        $ERRORS++
    }
}
Write-Host ""

Write-Host "8. Checking deployment scripts..." -ForegroundColor Yellow
Write-Host "---------------------------------"
if (Test-Path "start.sh") {
    $startScript = Get-Content "start.sh" -Raw
    if ($startScript -match "migrate") {
        Write-Host "✓ start.sh includes migrations" -ForegroundColor Green
    } else {
        Write-Host "✗ start.sh missing migrations" -ForegroundColor Red
        $ERRORS++
    }
    
    if ($startScript -match "seed_plans") {
        Write-Host "✓ start.sh includes seed_plans" -ForegroundColor Green
    } else {
        Write-Host "! start.sh missing seed_plans command" -ForegroundColor Yellow
        $WARNINGS++
    }
}
Write-Host ""

Write-Host "9. Security checks..." -ForegroundColor Yellow
Write-Host "---------------------"
if (Test-Path "wolvcapital/settings.py") {
    $settings = Get-Content "wolvcapital/settings.py" -Raw
    if ($settings -match 'DEBUG\s*=\s*True' -and $settings -notmatch 'env\(') {
        Write-Host "! DEBUG may be enabled - ensure DEBUG=0 in Railway" -ForegroundColor Yellow
        $WARNINGS++
    } else {
        Write-Host "✓ DEBUG configuration looks safe" -ForegroundColor Green
    }
}
Write-Host ""

Write-Host "10. Railway configuration..." -ForegroundColor Yellow
Write-Host "----------------------------"
if (Test-Path "railway.json") {
    Write-Host "✓ railway.json exists" -ForegroundColor Green
    $railwayConfig = Get-Content "railway.json" -Raw
    if ($railwayConfig -match "healthcheckPath") {
        Write-Host "✓ Health check configured" -ForegroundColor Green
    } else {
        Write-Host "! Health check not configured" -ForegroundColor Yellow
        $WARNINGS++
    }
} else {
    Write-Host "! railway.json not found (optional)" -ForegroundColor Yellow
}

if (Test-Path "nixpacks.toml") {
    Write-Host "✓ nixpacks.toml exists" -ForegroundColor Green
} else {
    Write-Host "! nixpacks.toml not found (Railway will use defaults)" -ForegroundColor Yellow
    $WARNINGS++
}
Write-Host ""

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

if ($ERRORS -eq 0 -and $WARNINGS -eq 0) {
    Write-Host "✓ All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your application is ready for Railway deployment!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Install Railway CLI: npm i -g @railway/cli"
    Write-Host "2. Login: railway login"
    Write-Host "3. Create project: railway init"
    Write-Host "4. Add PostgreSQL: railway add --database postgresql"
    Write-Host "5. Set environment variables (see RAILWAY_ENV_VARS.md)"
    Write-Host "6. Deploy: railway up"
    exit 0
} elseif ($ERRORS -eq 0) {
    Write-Host "! Passed with $WARNINGS warning(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Your application should deploy successfully," -ForegroundColor Cyan
    Write-Host "but review the warnings above." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "See RAILWAY_DEPLOYMENT.md for detailed guidance." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✗ Found $ERRORS error(s) and $WARNINGS warning(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the errors before deploying to Railway." -ForegroundColor Yellow
    Write-Host "See documentation in RAILWAY_DEPLOYMENT.md" -ForegroundColor Yellow
    exit 1
}
