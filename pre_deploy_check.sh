#!/bin/bash
# Pre-Deployment Verification Script for WolvCapital
# Run this before deploying to Render

echo "🚀 WolvCapital Pre-Deployment Checks"
echo "===================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Initialize counters
PASSED=0
FAILED=0

# Function to run a check
run_check() {
    local check_name="$1"
    local command="$2"
    
    echo -n "🔍 $check_name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Function to run a check with output
run_check_verbose() {
    local check_name="$1"
    local command="$2"
    
    echo "🔍 $check_name:"
    if eval "$command"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        echo ""
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        echo ""
        return 1
    fi
}

echo "📋 Basic System Checks"
echo "======================"

# Check Python version
run_check "Python Version (3.9+)" "python --version | grep -E 'Python 3\.(9|1[0-9])'"

# Check Django installation  
run_check "Django Installation" "python -c 'import django; print(django.VERSION)'"

# Check required packages
run_check "Required Packages" "python -c 'import django, rest_framework, allauth, whitenoise, psycopg2'"

echo ""
echo "📋 Django Configuration Checks"
echo "==============================="

# Django system check
run_check_verbose "Django System Check" "python manage.py check --fail-level WARNING"

# Check for unapplied migrations
echo "🔍 Migration Status:"
python manage.py showmigrations --list | grep -E "^\w" | while read app; do
    unapplied=$(python manage.py showmigrations "$app" | grep -c "\[ \]" || echo "0")
    if [ "$unapplied" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $app has $unapplied unapplied migrations${NC}"
    else
        echo -e "${GREEN}✅ $app migrations up to date${NC}"
    fi
done
((PASSED++))
echo ""

# Static files check
run_check_verbose "Static Files Collection" "python manage.py collectstatic --noinput --verbosity 0"

echo "📋 Code Quality Checks"
echo "======================"

# Run tests
echo "🔍 Running Tests:"
if python manage.py test --verbosity=1 --keepdb 2>/dev/null; then
    echo -e "${GREEN}✅ All tests passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Some tests failed${NC}"
    ((FAILED++))
fi
echo ""

# Check for critical files
echo "📋 Deployment Files Check"
echo "========================="

critical_files=(
    "requirements.txt"
    "render.yaml" 
    "start.sh"
    "manage.py"
    "wolvcapital/settings.py"
    "wolvcapital/wsgi.py"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "✅ $file ${GREEN}exists${NC}"
        ((PASSED++))
    else
        echo -e "❌ $file ${RED}missing${NC}"
        ((FAILED++))
    fi
done
echo ""

# Check render.yaml configuration
echo "🔍 Render Configuration Check:"
if grep -q "wolvcapital-db" render.yaml; then
    echo -e "${GREEN}✅ Database reference found in render.yaml${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Database reference missing in render.yaml${NC}"
    ((FAILED++))
fi

if grep -q "bash start.sh" render.yaml; then
    echo -e "${GREEN}✅ Start command configured${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Start command missing${NC}"
    ((FAILED++))
fi
echo ""

# Check environment variables
echo "📋 Environment Variables Check"
echo "=============================="

env_vars=(
    "SECRET_KEY:Generate on Render"
    "DEBUG:Should be 0 in production"  
    "ALLOWED_HOSTS:Should include your domain"
    "CORS_ALLOWED_ORIGINS:Should include frontend URLs"
)

for env_var in "${env_vars[@]}"; do
    var_name=$(echo "$env_var" | cut -d: -f1)
    var_desc=$(echo "$env_var" | cut -d: -f2)
    
    if grep -q "$var_name" render.yaml; then
        echo -e "✅ $var_name ${GREEN}configured${NC} ($var_desc)"
    else
        echo -e "⚠️  $var_name ${YELLOW}needs manual setup${NC} ($var_desc)"
    fi
done
echo ""

# Summary
echo "📊 SUMMARY"
echo "=========="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "=============="
    echo "1. Push code to GitHub if not already done"
    echo "2. Go to Render Dashboard: https://dashboard.render.com/"
    echo "3. Create new Web Service from your GitHub repo"
    echo "4. Use existing database: wolvcapital-db"
    echo "5. Set environment variables as shown in render.yaml"
    echo "6. Deploy and monitor logs"
    echo ""
    echo "🔗 Quick Deploy URLs:"
    echo "- Render Dashboard: https://dashboard.render.com/"
    echo "- Your repo: https://github.com/sollid-web/solid-succotash"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  $FAILED checks failed. Fix issues before deployment.${NC}"
    echo ""
    echo "🔧 Common Fixes:"
    echo "================"
    echo "- Install missing packages: pip install -r requirements.txt"
    echo "- Run migrations: python manage.py migrate"  
    echo "- Fix Django issues: python manage.py check"
    echo "- Update render.yaml if needed"
    echo ""
    exit 1
fi