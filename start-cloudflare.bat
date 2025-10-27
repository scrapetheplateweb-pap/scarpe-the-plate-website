@echo off
echo ============================================
echo   Cloudflare Tunnel Setup (FREE Alternative)
echo ============================================
echo.

REM Check if cloudflared is available
where cloudflared >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Cloudflared not found!
    echo.
    echo Please download Cloudflare Tunnel:
    echo 1. Go to: https://github.com/cloudflare/cloudflared/releases
    echo 2. Download cloudflared-windows-amd64.exe
    echo 3. Rename to cloudflared.exe
    echo 4. Place in this folder: d:\scarpe-the-plate-website\
    echo.
    pause
    exit /b 1
)

echo ✅ Cloudflared found! Setting up tunnel...
echo.

REM Kill existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul
taskkill /F /IM cloudflared.exe 2>nul

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

echo Starting Cloudflare Tunnel...
cd /d "d:\scarpe-the-plate-website"
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:5000"

echo.
echo =====================================
echo   🌍 CLOUDFLARE TUNNEL (FREE):
echo   
echo   ✅ Tunnel created for frontend
echo   📱 Check the Cloudflare window for your public URL
echo   🔒 Built-in HTTPS included
echo   
echo   Your URL will look like:
echo   https://random-words.trycloudflare.com
echo =====================================
echo.

pause