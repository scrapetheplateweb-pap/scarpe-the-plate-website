@echo off
echo ============================================
echo   Scrape the Plate - Single Tunnel Setup
echo ============================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ngrok not found!
    echo Please install ngrok first
    pause
    exit /b 1
)

echo ✅ Ngrok found! Setting up single tunnel...
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

echo Starting single ngrok tunnel for frontend...
start "Ngrok Tunnel" cmd /k "ngrok http 5000"

echo.
echo =====================================
echo   🌍 INTERNET ACCESS SETUP:
echo   
echo   ✅ Frontend tunnel created for port 5000
echo   📱 Check the ngrok window for your public URL
echo   
echo   Note: Free ngrok plan allows 1 tunnel
echo   Frontend URL will proxy API calls automatically
echo =====================================
echo.

pause