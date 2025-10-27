# Scrape the Plate - Internet Access Setup
# This script starts all services with ngrok tunnels for internet access

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Scrape the Plate - Internet Access Setup" -ForegroundColor Green  
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if ngrok is available
try {
    $ngrokVersion = & ngrok version 2>$null
    Write-Host "✅ Ngrok found: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install ngrok first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://ngrok.com/" -ForegroundColor White
    Write-Host "2. Sign up for free" -ForegroundColor White
    Write-Host "3. Download ngrok for Windows" -ForegroundColor White
    Write-Host "4. Extract to C:\ngrok\ or add to PATH" -ForegroundColor White
    Write-Host "5. Run: ngrok authtoken YOUR_AUTH_TOKEN" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Function to kill processes on specific ports
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            $processes | ForEach-Object { 
                try {
                    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
                } catch {
                    # Process may have already stopped
                }
            }
        }
    } catch {
        # Port not in use, continue
    }
}

# Clean up existing processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Stop-ProcessOnPort 3000
Stop-ProcessOnPort 5000  
Stop-ProcessOnPort 5001

try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {
    # No processes to kill
}

Start-Sleep -Seconds 3

# Start Backend Server
Write-Host "Starting backend server..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "d:\scarpe-the-plate-website\backend"
    node server.js
}

Start-Sleep -Seconds 3

# Start Chatbot Service  
Write-Host "Starting chatbot service..." -ForegroundColor Cyan
$chatbotJob = Start-Job -ScriptBlock {
    Set-Location "d:\scarpe-the-plate-website\chatbot_service"
    python chatbot.py
}

Start-Sleep -Seconds 3

# Start Ngrok Tunnels
Write-Host "Starting ngrok tunnels..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 5000 --log stdout" -WindowStyle Normal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000 --log stdout" -WindowStyle Normal  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 5001 --log stdout" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  🌍 INTERNET ACCESS SETUP COMPLETE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Check the ngrok terminal windows for your public URLs" -ForegroundColor Yellow
Write-Host "   They will look like: https://abc123.ngrok.io" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Share these URLs with anyone worldwide!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Ngrok Dashboard: https://dashboard.ngrok.com/cloud-edge/endpoints" -ForegroundColor Cyan
Write-Host ""

# Cleanup function
$cleanup = {
    Write-Host "`nStopping all services..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $chatbotJob -ErrorAction SilentlyContinue  
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $chatbotJob -Force -ErrorAction SilentlyContinue
    Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Stop-ProcessOnPort 3000
    Stop-ProcessOnPort 5000
    Stop-ProcessOnPort 5001
    Write-Host "All services stopped." -ForegroundColor Green
}

# Register cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action $cleanup

try {
    Set-Location "$PSScriptRoot\frontend" 
    Write-Host "Starting frontend..." -ForegroundColor Cyan
    npm run dev
} finally {
    & $cleanup
}