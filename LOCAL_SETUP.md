# Local Development Setup Instructions

## Prerequisites
Make sure you have the following installed:
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Git

## Quick Start

1. **Open PowerShell as Administrator** (to avoid permission issues)

2. **Navigate to the project directory:**
   ```powershell
   cd "d:\scarpe-the-plate-website"
   ```

3. **Run the startup script:**
   ```powershell
   .\start-local.ps1
   ```

4. **Access the application:**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:3000
   - Chatbot Service: http://localhost:5001

## What the startup script does:
- Kills any existing processes on ports 3000, 5000, and 5001
- Starts the backend server (Node.js/Express)
- Starts the chatbot service (Python/Flask)
- Starts the frontend development server (React/Vite)

## Environment Configuration

### Backend (.env files created)
- Uses SQLite database for local development (no PostgreSQL setup required)
- Session secret configured for development
- CORS enabled for localhost

### Frontend
- Configured to connect to local backend API
- Vite development server with hot reload

### Chatbot Service
- Flask development server with debug mode
- Ready for OpenAI integration (add your API key to .env)

## Optional Stripe Setup
If you want to test payment functionality:
1. Create a Stripe account at https://stripe.com
2. Get your test API keys
3. Update the STRIPE_* values in:
   - `backend/.env`
   - `frontend/.env`

## Optional OpenAI Setup
If you want the chatbot to work:
1. Get an OpenAI API key
2. Update OPENAI_API_KEY in:
   - `backend/.env`
   - `chatbot_service/.env`

## Stopping the Application
- Press `Ctrl+C` in the PowerShell window where you ran the script
- This will stop the frontend, and the other services will also stop

## Troubleshooting
- If ports are already in use, the script will attempt to kill existing processes
- Check Windows Defender/Antivirus if processes are being blocked
- Make sure PowerShell execution policy allows scripts (run as admin if needed)