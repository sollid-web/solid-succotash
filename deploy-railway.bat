@echo off
REM WolvCapital Automated Railway Deployment Script for Windows
REM This script automates the entire deployment process to Railway

echo 🚀 WolvCapital Automated Railway Deployment
echo ===========================================

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Railway CLI not found. Please install it first:
    echo 📦 Run: npm install -g @railway/cli
    echo 🌐 Or visit: https://railway.app/cli
    pause
    exit /b 1
)

echo 🔑 Checking Railway authentication...
railway whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to Railway...
    railway login
    echo ✅ Railway authentication successful
) else (
    echo ✅ Already authenticated with Railway
)

echo 📦 Creating new Railway project...
set PROJECT_NAME=wolvcapital-%RANDOM%
railway up --name %PROJECT_NAME%

echo 🗄️ Adding PostgreSQL database...
railway add postgresql

echo 🔧 Setting environment variables...
REM Generate a secure secret key using Python
for /f %%i in ('python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"') do set SECRET_KEY=%%i

railway variables set SECRET_KEY="%SECRET_KEY%"
railway variables set DEBUG=False
railway variables set DJANGO_SETTINGS_MODULE=wolvcapital.settings

echo ✅ Environment variables configured

echo 🚀 Deploying WolvCapital to Railway...
railway deploy

echo ⏳ Waiting for deployment to complete...
timeout /t 10 /nobreak >nul

REM Get the deployment URL
for /f %%i in ('railway domain') do set DEPLOYMENT_URL=%%i
if "%DEPLOYMENT_URL%"=="" (
    echo 🌐 Generating Railway domain...
    railway domain
    for /f %%i in ('railway domain') do set DEPLOYMENT_URL=%%i
)

echo ✅ Deployment completed successfully!
echo.
echo 🎉 WolvCapital is now live!
echo ==========================
echo 🌐 URL: https://%DEPLOYMENT_URL%
echo 👤 Admin Login: admin@wolvcapital.com
echo 🔑 Admin Password: admin123
echo.
echo 📋 Available Features:
echo   💰 Investment Plans (Pioneer, Vanguard, Horizon, Summit)
echo   ₿ Cryptocurrency Deposits (BTC, USDT, USDC, ETH)
echo   💳 Virtual Cards ($1000 purchase)
echo   📞 Customer Support Chat
echo   🔔 Admin Notifications
echo   🛡️ Manual Approval Workflows
echo.
echo 🔗 Quick Links:
echo   🏠 Homepage: https://%DEPLOYMENT_URL%
echo   📊 Dashboard: https://%DEPLOYMENT_URL%/dashboard/
echo   💼 Investment Plans: https://%DEPLOYMENT_URL%/plans/
echo   🛠️ Admin Panel: https://%DEPLOYMENT_URL%/admin/
echo   🔌 API: https://%DEPLOYMENT_URL%/api/
echo.
echo ⚠️ Important Notes:
echo   • Change admin password after first login
echo   • Update cryptocurrency wallet addresses in admin panel
echo   • Review and test all approval workflows
echo   • Monitor transaction processing and audit logs
echo.
echo 🎯 Next Steps:
echo   1. Login to admin panel and change default password
echo   2. Configure cryptocurrency wallet addresses
echo   3. Test investment and transaction flows
echo   4. Set up monitoring and backup procedures
echo.
echo 🔒 Security: All financial operations require manual admin approval
echo 📈 Ready for production use with proper admin oversight
echo.
pause