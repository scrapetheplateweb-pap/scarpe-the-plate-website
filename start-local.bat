@echo off
echo Starting Scrape the Plate Application...

REM Kill existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM python.exe 2>nul

REM Wait a moment
timeout /t 3 /nobreak >nul

echo Starting backend server...
cd /d "d:\scarpe-the-plate-website\backend"
start "Backend Server" cmd /k "node server.js"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo Starting chatbot service...
cd /d "d:\scarpe-the-plate-website\chatbot_service"
start "Chatbot Service" cmd /k "python chatbot.py"

REM Wait for chatbot to start
timeout /t 3 /nobreak >nul

echo Starting frontend...
cd /d "d:\scarpe-the-plate-website\frontend"

echo.
echo =====================================
echo   LOCAL ACCESS:
echo   Frontend: http://localhost:5000
echo   Backend:  http://localhost:3000  
echo   Chatbot:  http://localhost:5001
echo.
echo   NETWORK ACCESS (other devices):
echo   Frontend: http://10.1.10.41:5000
echo   Backend:  http://10.1.10.41:3000
echo   Chatbot:  http://10.1.10.41:5001
echo =====================================
echo.

npm run dev