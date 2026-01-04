#!/bin/bash

# Railway Pre-Deployment Checklist
# Run this script before deploying to Railway

echo "🚂 Railway Pre-Deployment Checklist for WolvCapital"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((ERRORS++))
    fi
}

# Function to check if command succeeds
check_command() {
    if $1 > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
    fi
}

echo "1. Checking required files..."
echo "-----------------------------"
check_file "requirements.txt"
check_file "manage.py"
check_file "Procfile"
check_file "railway.json"
check_file "nixpacks.toml"
check_file "start.sh"
check_file "runtime.txt"
echo ""

echo "2. Checking Python version..."
echo "-----------------------------"
if [ -f "runtime.txt" ]; then
    PYTHON_VERSION=$(cat runtime.txt)
    echo -e "${GREEN}✓${NC} Python version specified: $PYTHON_VERSION"
else
    echo -e "${YELLOW}!${NC} runtime.txt not found - Railway will use default Python"
    ((WARNINGS++))
fi
echo ""

echo "3. Validating Django configuration..."
echo "-------------------------------------"
if python manage.py check --deploy > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Django deployment checks passed"
else
    echo -e "${RED}✗${NC} Django deployment checks failed"
    echo "Run: python manage.py check --deploy"
    ((ERRORS++))
fi
echo ""

echo "4. Checking database migrations..."
echo "----------------------------------"
if python manage.py showmigrations | grep -q "\[ \]"; then
    echo -e "${YELLOW}!${NC} Unapplied migrations found"
    echo "Migrations will run automatically on Railway"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} All migrations applied (or database not configured)"
fi
echo ""

echo "5. Checking static files..."
echo "---------------------------"
if python manage.py collectstatic --noinput --dry-run > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Static files collection configured"
else
    echo -e "${RED}✗${NC} Static files collection failed"
    ((ERRORS++))
fi
echo ""

echo "6. Checking required Django apps..."
echo "-----------------------------------"
REQUIRED_APPS=("core" "users" "investments" "transactions" "api")
for app in "${REQUIRED_APPS[@]}"; do
    if [ -d "$app" ]; then
        echo -e "${GREEN}✓${NC} $app app exists"
    else
        echo -e "${RED}✗${NC} $app app missing"
        ((ERRORS++))
    fi
done
echo ""

echo "7. Checking dependencies..."
echo "----------------------------"
REQUIRED_PACKAGES=("Django" "gunicorn" "psycopg2-binary" "whitenoise" "djangorestframework")
for package in "${REQUIRED_PACKAGES[@]}"; do
    if grep -q "$package" requirements.txt; then
        echo -e "${GREEN}✓${NC} $package in requirements.txt"
    else
        echo -e "${RED}✗${NC} $package missing from requirements.txt"
        ((ERRORS++))
    fi
done
echo ""

echo "8. Checking deployment scripts..."
echo "---------------------------------"
if [ -x "start.sh" ]; then
    echo -e "${GREEN}✓${NC} start.sh is executable"
else
    echo -e "${YELLOW}!${NC} start.sh not executable (Railway will handle this)"
    ((WARNINGS++))
fi

if grep -q "migrate" start.sh; then
    echo -e "${GREEN}✓${NC} start.sh includes migrations"
else
    echo -e "${RED}✗${NC} start.sh missing migrations"
    ((ERRORS++))
fi

if grep -q "seed_plans" start.sh; then
    echo -e "${GREEN}✓${NC} start.sh includes seed_plans"
else
    echo -e "${YELLOW}!${NC} start.sh missing seed_plans command"
    ((WARNINGS++))
fi
echo ""

echo "9. Security checks..."
echo "---------------------"
# Check for hardcoded secrets (basic check)
if grep -r "SECRET_KEY.*=" --include="*.py" | grep -v "env(" | grep -v "#" | grep -q "SECRET_KEY"; then
    echo -e "${YELLOW}!${NC} Possible hardcoded SECRET_KEY found - ensure using environment variables"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} No obvious hardcoded secrets"
fi

if grep -q "DEBUG.*=.*True" wolvcapital/settings.py 2>/dev/null; then
    echo -e "${YELLOW}!${NC} DEBUG may be enabled - ensure DEBUG=0 in Railway"
    ((WARNINGS++))
else
    echo -e "${GREEN}✓${NC} DEBUG configuration looks safe"
fi
echo ""

echo "10. Railway configuration..."
echo "----------------------------"
if [ -f "railway.json" ]; then
    echo -e "${GREEN}✓${NC} railway.json exists"
    if grep -q "healthcheckPath" railway.json; then
        echo -e "${GREEN}✓${NC} Health check configured"
    else
        echo -e "${YELLOW}!${NC} Health check not configured"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}!${NC} railway.json not found (optional)"
fi

if [ -f "nixpacks.toml" ]; then
    echo -e "${GREEN}✓${NC} nixpacks.toml exists"
else
    echo -e "${YELLOW}!${NC} nixpacks.toml not found (Railway will use defaults)"
    ((WARNINGS++))
fi
echo ""

echo "=================================================="
echo "Summary"
echo "=================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your application is ready for Railway deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Create Railway project: railway init"
    echo "2. Add PostgreSQL: railway add --database postgresql"
    echo "3. Set environment variables (see RAILWAY_ENV_VARS.md)"
    echo "4. Deploy: railway up"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}! Passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Your application should deploy successfully,"
    echo "but review the warnings above."
    echo ""
    echo "See RAILWAY_DEPLOYMENT.md for detailed guidance."
    exit 0
else
    echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors before deploying to Railway."
    echo "See documentation in RAILWAY_DEPLOYMENT.md"
    exit 1
fi
