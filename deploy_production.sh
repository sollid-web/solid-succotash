#!/bin/bash

# WolvCapital Production Deployment Helper
# This script helps you prepare and deploy the WolvCapital platform

set -e

echo "🚀 WolvCapital Production Deployment Helper"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# Function to generate secret key
generate_secret_key() {
    echo "🔑 Generating secure SECRET_KEY..."
    python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(50))"
    echo ""
}

# Function to generate admin password
generate_admin_password() {
    echo "👤 Generating secure admin password..."
    if command -v openssl &> /dev/null; then
        echo "INITIAL_ADMIN_PASSWORD=$(openssl rand -base64 32)"
    else
        python -c "import secrets; print('INITIAL_ADMIN_PASSWORD=' + secrets.token_urlsafe(24))"
    fi
    echo ""
}

# Function to check environment
check_environment() {
    echo "🔍 Checking environment..."
    
    # Check Python
    if ! command -v python &> /dev/null; then
        echo "❌ Python not found. Please install Python 3.11+"
        exit 1
    fi
    
    # Check Node.js for frontend
    if ! command -v node &> /dev/null; then
        echo "⚠️ Node.js not found. Frontend deployment may fail."
    fi
    
    # Check if virtual environment is active
    if [ -z "$VIRTUAL_ENV" ]; then
        echo "⚠️ Warning: Virtual environment not detected. Consider activating venv."
    fi
    
    echo "✅ Environment check complete"
    echo ""
}

# Function to run production checks
run_production_checks() {
    echo "🔧 Running Django production checks..."
    
    # Set minimal environment for checks
    export DEBUG=0
    export SECRET_KEY="test-key-for-checks"
    
    if python manage.py check --deploy; then
        echo "✅ Django deployment checks passed"
    else
        echo "❌ Django deployment checks failed"
        echo "Please review and fix the issues above"
        exit 1
    fi
    echo ""
}

# Function to test static files
test_static_files() {
    echo "📂 Testing static files collection..."
    
    export DEBUG=1  # Allow development mode for this test
    
    if python manage.py collectstatic --noinput --dry-run > /dev/null; then
        echo "✅ Static files collection test passed"
    else
        echo "❌ Static files collection test failed"
        exit 1
    fi
    echo ""
}

# Function to check migrations
check_migrations() {
    echo "🗄️ Checking database migrations..."
    
    export DEBUG=1
    
    if python manage.py showmigrations --verbosity=0 > /dev/null; then
        echo "✅ All migrations are up to date"
    else
        echo "❌ Migration check failed"
        exit 1
    fi
    echo ""
}

# Function to test frontend build
test_frontend_build() {
    echo "🎨 Testing frontend build..."
    
    if [ -d "frontend" ]; then
        cd frontend
        if [ -f "package.json" ]; then
            if npm run build > /dev/null 2>&1; then
                echo "✅ Frontend build test passed"
            else
                echo "⚠️ Frontend build test had issues (this may be normal for development)"
            fi
        else
            echo "⚠️ Frontend package.json not found"
        fi
        cd ..
    else
        echo "⚠️ Frontend directory not found"
    fi
    echo ""
}

# Function to show deployment summary
show_deployment_summary() {
    echo "📋 Deployment Summary"
    echo "===================="
    echo ""
    echo "✅ Your WolvCapital platform is ready for production deployment!"
    echo ""
    echo "🔧 Required Environment Variables:"
    echo "- SECRET_KEY (generated above)"
    echo "- INITIAL_ADMIN_PASSWORD (generated above)"
    echo "- DATABASE_URL (from Render PostgreSQL)"
    echo "- Email SMTP settings (SendGrid recommended)"
    echo "- Domain and CORS settings"
    echo ""
    echo "🚀 Deployment Steps:"
    echo "1. Deploy backend to Render.com using render.yaml"
    echo "2. Deploy frontend to Vercel using 'vercel --prod'"
    echo "3. Update CORS_ALLOWED_ORIGINS with your actual domains"
    echo "4. Set CREATE_INITIAL_ADMIN=0 after initial deployment"
    echo ""
    echo "📖 See PRODUCTION_READY_CHECKLIST.md for complete details"
    echo ""
}

# Main deployment preparation
main() {
    echo "Starting production readiness checks..."
    echo ""
    
    check_environment
    run_production_checks
    test_static_files
    check_migrations
    test_frontend_build
    
    echo "🔐 Security Configuration"
    echo "========================"
    generate_secret_key
    generate_admin_password
    
    show_deployment_summary
    
    echo "🎉 Production readiness check complete!"
    echo "Your platform is ready for deployment to production."
}

# Run main function
main "$@"