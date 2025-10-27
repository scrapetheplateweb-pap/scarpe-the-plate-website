@echo off
echo ============================================
echo   Port Forwarding Setup Guide
echo ============================================
echo.

echo 🏠 ROUTER PORT FORWARDING SETUP:
echo.
echo Your computer IP: 10.1.10.41
echo.
echo Ports to forward:
echo   Port 5000 → 10.1.10.41:5000 (Frontend)
echo   Port 3000 → 10.1.10.41:3000 (Backend)  
echo   Port 5001 → 10.1.10.41:5001 (Chatbot)
echo.

echo Step 1: Find your public IP
start https://whatismyipaddress.com/
echo.

echo Step 2: Access your router
echo Common router IPs:
echo   - http://192.168.1.1
echo   - http://192.168.0.1
echo   - http://10.0.0.1
echo.

set /p continue="Have you configured port forwarding? (y/n): "
if /i "%continue%" neq "y" (
    echo.
    echo Please configure port forwarding first, then run this script again.
    echo.
    pause
    exit /b 1
)

echo.
echo Starting application with port forwarding...
echo.

REM Kill existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul

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

echo.
echo =====================================
echo   🌍 PORT FORWARDING ACTIVE:
echo   
echo   Your site should be accessible at:
echo   http://YOUR_PUBLIC_IP:5000
echo   
echo   Check whatismyipaddress.com for your public IP
echo =====================================
echo.

pause