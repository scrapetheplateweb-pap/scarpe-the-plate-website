@echo off
echo ============================================
echo   Custom Domain Setup (Requires Ngrok Pro)
echo ============================================
echo.

echo ⚠️  IMPORTANT NOTES:
echo.
echo 1. Custom domains require Ngrok Pro plan ($10/month)
echo 2. You need to own the domain 'scrapetheplateent.com'
echo 3. DNS must be configured with CNAME record
echo 4. '.eat' is not a valid internet domain extension
echo.
echo ✅ Valid domain examples:
echo    - scrapetheplateent.com (YOUR DOMAIN)
echo    - app.scrapetheplateent.com
echo    - demo.scrapetheplateent.com
echo.

set /p continue="Do you have ngrok Pro and a real domain? (y/n): "
if /i "%continue%" neq "y" (
    echo.
    echo Please:
    echo 1. Register a domain with .com/.net/.org extension
    echo 2. Upgrade to ngrok Pro at https://dashboard.ngrok.com/billing
    echo 3. Configure domain in ngrok dashboard
    echo.
    echo For now, using regular ngrok tunnel...
    echo.
    call start-single-tunnel.bat
    goto :end
)

echo.
echo Starting with custom domain configuration...
echo.

REM Kill existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
taskkill /F /IM ngrok.exe 2>nul

timeout /t 3 /nobreak >nul

echo Starting backend server...
cd /d "d:\scarpe-the-plate-website\backend"
start "Backend Server" cmd /k "node server.js"

timeout /t 3 /nobreak >nul

echo Starting chatbot service...
cd /d "d:\scarpe-the-plate-website\chatbot_service"
start "Chatbot Service" cmd /k "python chatbot.py"

timeout /t 3 /nobreak >nul

echo Starting frontend...
cd /d "d:\scarpe-the-plate-website\frontend"
start "Frontend Server" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo Starting ngrok with custom domain...
start "Ngrok Custom Domain" cmd /k "ngrok start frontend --config ngrok-custom.yml"

echo.
echo =====================================
echo   🌐 CUSTOM DOMAIN SETUP:
echo   
echo   Your site will be available at:
echo   https://scrapetheplateent.com
echo   
echo   (If properly configured with Pro plan)
echo =====================================
echo.

:end
pause