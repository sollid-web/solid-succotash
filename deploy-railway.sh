#!/bin/bash

# WolvCapital Automated Railway Deployment Script
# This script automates the entire deployment process to Railway

set -e  # Exit on any error

echo "🚀 WolvCapital Automated Railway Deployment"
echo "==========================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    
    # Install Railway CLI based on OS
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        echo "📦 Installing Railway CLI for Windows..."
        curl -fsSL https://railway.app/install.sh | sh
    else
        # Unix-like systems
        echo "📦 Installing Railway CLI..."
        curl -fsSL https://railway.app/install.sh | sh
    fi
    
    echo "✅ Railway CLI installed successfully"
fi

# Function to generate random SECRET_KEY
generate_secret_key() {
    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
}

echo "🔑 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
    echo "✅ Railway authentication successful"
else
    echo "✅ Already authenticated with Railway"
fi

echo "📦 Creating new Railway project..."
PROJECT_NAME="wolvcapital-$(date +%s)"
railway up --name "$PROJECT_NAME"

echo "🗄️ Adding PostgreSQL database..."
railway add postgresql

echo "🔧 Setting environment variables..."

# Generate a secure secret key
SECRET_KEY=$(generate_secret_key)
railway variables set SECRET_KEY="$SECRET_KEY"
railway variables set DEBUG=False
railway variables set DJANGO_SETTINGS_MODULE=wolvcapital.settings

echo "✅ Environment variables configured"

echo "🚀 Deploying WolvCapital to Railway..."
railway deploy

echo "⏳ Waiting for deployment to complete..."
sleep 10

# Get the deployment URL
DEPLOYMENT_URL=$(railway domain)
if [ -z "$DEPLOYMENT_URL" ]; then
    echo "🌐 Generating Railway domain..."
    railway domain
    DEPLOYMENT_URL=$(railway domain)
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 WolvCapital is now live!"
echo "=========================="
echo "🌐 URL: https://$DEPLOYMENT_URL"
echo "👤 Admin Login: admin@wolvcapital.com"
echo "🔑 Admin Password: admin123"
echo ""
echo "📋 Available Features:"
echo "  💰 Investment Plans (Pioneer, Vanguard, Horizon, Summit)"
echo "  ₿ Cryptocurrency Deposits (BTC, USDT, USDC, ETH)"
echo "  💳 Virtual Cards ($1000 purchase)"
echo "  📞 Customer Support Chat"
echo "  🔔 Admin Notifications"
echo "  🛡️ Manual Approval Workflows"
echo ""
echo "🔗 Quick Links:"
echo "  🏠 Homepage: https://$DEPLOYMENT_URL"
echo "  📊 Dashboard: https://$DEPLOYMENT_URL/dashboard/"
echo "  💼 Investment Plans: https://$DEPLOYMENT_URL/plans/"
echo "  🛠️ Admin Panel: https://$DEPLOYMENT_URL/admin/"
echo "  🔌 API: https://$DEPLOYMENT_URL/api/"
echo ""
echo "⚠️ Important Notes:"
echo "  • Change admin password after first login"
echo "  • Update cryptocurrency wallet addresses in admin panel"
echo "  • Review and test all approval workflows"
echo "  • Monitor transaction processing and audit logs"
echo ""
echo "🎯 Next Steps:"
echo "  1. Login to admin panel and change default password"
echo "  2. Configure cryptocurrency wallet addresses"
echo "  3. Test investment and transaction flows"
echo "  4. Set up monitoring and backup procedures"
echo ""
echo "🔒 Security: All financial operations require manual admin approval"
echo "📈 Ready for production use with proper admin oversight"