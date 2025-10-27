# Scrape the Plate - Windows Local Development Setup
# This script starts all services for local development

Write-Host "Starting Scrape the Plate Application..." -ForegroundColor Green

# Function to kill processes on specific ports
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            $processes | ForEach-Object { 
                try {
                    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
                    Write-Host "Stopped process $_ on port $Port" -ForegroundColor Yellow
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
Stop-ProcessOnPort 3000  # Backend
Stop-ProcessOnPort 5000  # Frontend
Stop-ProcessOnPort 5001  # Chatbot

# Also kill any node/python processes that might be hanging
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {
    # No processes to kill
}

Start-Sleep -Seconds 3

# Start Backend Server
Write-Host "Starting backend server on port 3000..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "d:\scarpe-the-plate-website\backend"
    node server.js
}

# Wait a moment for backend to start
Start-Sleep -Seconds 4

# Start Chatbot Service
Write-Host "Starting chatbot service on port 5001..." -ForegroundColor Cyan
$chatbotJob = Start-Job -ScriptBlock {
    Set-Location "d:\scarpe-the-plate-website\chatbot_service"
    python chatbot.py
}

# Wait a moment for chatbot to start
Start-Sleep -Seconds 3

# Start Frontend (this will open in current window)
Write-Host "Starting frontend development server on port 5000..." -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 LOCAL ACCESS:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "   Chatbot: http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "🌐 NETWORK ACCESS (other devices):" -ForegroundColor Green
Write-Host "   Frontend: http://10.1.10.41:5000" -ForegroundColor White
Write-Host "   Backend API: http://10.1.10.41:3000" -ForegroundColor White
Write-Host "   Chatbot: http://10.1.10.41:5001" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Cleanup function
$cleanup = {
    Write-Host "`nStopping all services..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $chatbotJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $chatbotJob -Force -ErrorAction SilentlyContinue
    Stop-ProcessOnPort 3000
    Stop-ProcessOnPort 5000
    Stop-ProcessOnPort 5001
    Write-Host "All services stopped." -ForegroundColor Green
}

# Register cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action $cleanup

try {
    Set-Location "$PSScriptRoot\frontend"
    npm run dev
} finally {
    & $cleanup
}