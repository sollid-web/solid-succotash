@echo off
REM WolvCapital Automated Render.com Deployment Guide
echo 🚀 WolvCapital Render.com Deployment Guide
echo =============================================
echo.
echo ✅ Your Render configuration is ready!
echo.
echo 📋 Deployment Steps:
echo.
echo 1. 🌐 Visit https://render.com
echo 2. 🔑 Sign up or login (GitHub recommended)
echo 3. ➕ Click "New +" → "Blueprint"
echo 4. 🔗 Connect your GitHub repository
echo 5. 📁 Select this repository (solid-scottash/solid-succotash)
echo 6. 🚀 Click "Apply" - Render will auto-deploy!
echo.
echo 🎯 What Render Will Do Automatically:
echo   • 🗄️ Create PostgreSQL database
echo   • 🔧 Install Python dependencies
echo   • 📦 Run migrations and seed investment plans
echo   • 🔑 Generate secure SECRET_KEY
echo   • 🌐 Deploy to https://your-app.onrender.com
echo.
echo 💰 Cost: FREE for 90 days, then $7/month for database
echo.
echo 🔐 Default Admin Login:
echo   📧 Email: admin@wolvcapital.com
echo   🔑 Password: admin123
echo.
echo ⚠️ IMPORTANT: Change admin password immediately after deployment!
echo.
echo 🎉 Your WolvCapital platform will include:
echo   💼 Investment Plans (Pioneer, Vanguard, Horizon, Summit)
echo   ₿ Crypto Deposits (BTC, USDT, USDC, ETH)
echo   💳 Virtual Cards ($1000 purchase)
echo   📞 Customer Support Chat
echo   🔔 Admin Notifications
echo   🛡️ Manual Approval Workflows
echo.
echo 📱 Would you like to open Render.com now? (Y/N)
set /p choice="Enter your choice: "
if /i "%choice%"=="Y" (
    start https://render.com
    echo 🌐 Opening Render.com...
    echo 🔗 When ready, connect this repository: solid-scottash/solid-succotash
) else (
    echo 📋 Manual steps saved above for later deployment
)
echo.
echo 🎯 Next: After deployment, visit your admin panel to configure crypto wallets!
pause