@echo off
echo ============================================
echo   Scrape the Plate - Internet Access Setup
echo ============================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Ngrok not found!
    echo.
    echo Please install ngrok first:
    echo 1. Go to https://ngrok.com/
    echo 2. Sign up for free
    echo 3. Download ngrok for Windows
    echo 4. Extract to C:\ngrok\ or add to PATH
    echo 5. Run: ngrok authtoken YOUR_AUTH_TOKEN
    echo.
    pause
    exit /b 1
)

echo ✅ Ngrok found! Setting up internet access...
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

echo Starting ngrok tunnels...
start "Ngrok Frontend" cmd /k "ngrok http 5000 --log stdout"
start "Ngrok Backend" cmd /k "ngrok http 3000 --log stdout"
start "Ngrok Chatbot" cmd /k "ngrok http 5001 --log stdout"

timeout /t 5 /nobreak >nul

echo Starting frontend...
cd /d "d:\scarpe-the-plate-website\frontend"

echo.
echo =====================================
echo   🌍 INTERNET ACCESS URLS:
echo   Check the ngrok terminal windows for your public URLs
echo   They will look like: https://abc123.ngrok.io
echo.
echo   📱 Share these URLs with anyone worldwide!
echo =====================================
echo.

npm run dev