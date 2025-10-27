# Scrape the Plate - Single Tunnel Setup (Ngrok Free Plan Compatible)

Write-Host "============================================" -ForegroundColor Green
Write-Host "  Scrape the Plate - Single Tunnel Setup" -ForegroundColor Green  
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# Check if ngrok is available
try {
    $ngrokVersion = & ngrok version 2>$null
    Write-Host "✅ Ngrok found: $ngrokVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ngrok not found!" -ForegroundColor Red
    Write-Host "Please install ngrok first" -ForegroundColor Yellow
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

# Start Frontend
Write-Host "Starting frontend..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "d:\scarpe-the-plate-website\frontend"
    npm run dev
}

Start-Sleep -Seconds 5

# Start Single Ngrok Tunnel
Write-Host "Starting ngrok tunnel for frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 5000" -WindowStyle Normal

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  🌍 SINGLE TUNNEL SETUP COMPLETE" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Frontend tunnel created for port 5000" -ForegroundColor Green
Write-Host "📱 Check the ngrok window for your public URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Frontend will proxy API and chatbot calls automatically" -ForegroundColor Cyan
Write-Host "   - API calls: /api/* → backend" -ForegroundColor White
Write-Host "   - Chat calls: /chat → chatbot" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Ngrok Dashboard: https://dashboard.ngrok.com/cloud-edge/endpoints" -ForegroundColor Cyan
Write-Host ""

# Keep services running
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host "`nStopping all services..." -ForegroundColor Yellow
Stop-Job $backendJob -ErrorAction SilentlyContinue
Stop-Job $chatbotJob -ErrorAction SilentlyContinue  
Stop-Job $frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
Remove-Job $chatbotJob -Force -ErrorAction SilentlyContinue
Remove-Job $frontendJob -Force -ErrorAction SilentlyContinue
Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Stop-ProcessOnPort 3000
Stop-ProcessOnPort 5000
Stop-ProcessOnPort 5001
Write-Host "All services stopped." -ForegroundColor Green