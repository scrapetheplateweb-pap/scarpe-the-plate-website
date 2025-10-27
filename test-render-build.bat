@echo off
echo Testing Render build process locally...
echo.

echo Step 1: Building frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Frontend npm install failed!
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo Frontend build successful!
echo Contents of dist folder:
dir dist

echo.
echo Step 2: Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo Backend npm install failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Testing production server...
echo Starting server in test mode...
set NODE_ENV=production
set PORT=3001
start "Test Server" cmd /k "npm start"

echo.
echo Test server started on http://localhost:3001
echo Check if the site loads correctly.
echo.
echo If it works locally, the Render deployment should work too.
pause