# Network Access Guide

## 📱 Accessing from Other Devices

Your Scrape the Plate application is now configured to be accessible from other devices on your network!

### 🌐 Network URLs

**From your computer (local access):**
- Frontend: http://localhost:5000
- Backend API: http://localhost:3000
- Chatbot: http://localhost:5001

**From other devices on your network:**
- Frontend: http://10.1.10.41:5000
- Backend API: http://10.1.10.41:3000
- Chatbot: http://10.1.10.41:5001

### 📱 How to Access from Another Device

1. **Make sure both devices are on the same network** (same WiFi)
2. **Start the application** on your computer using `start-local.bat` or `start-local.ps1`
3. **On your phone/tablet/other computer**, open a web browser
4. **Navigate to**: `http://10.1.10.41:5000`

### 🔒 Firewall Configuration

If you can't access from other devices, you may need to:

1. **Allow through Windows Firewall:**
   - Open Windows Defender Firewall
   - Click "Allow an app or feature through Windows Defender Firewall"
   - Click "Change Settings" then "Allow another app..."
   - Add Node.js and Python if they're not listed
   - Make sure both "Private" and "Public" are checked

2. **Or temporarily disable Windows Firewall** (not recommended for production):
   - Control Panel → System and Security → Windows Defender Firewall
   - Turn Windows Defender Firewall on or off
   - Turn off for Private and Public networks (temporarily)

### 📶 Network Requirements

- All devices must be on the same local network
- Your computer's IP address is: **10.1.10.41**
- If your IP changes, update the configuration files:
  - `frontend/.env`
  - `frontend/vite.config.js`
  - `backend/.env`
  - `chatbot_service/.env`

### 🔧 Troubleshooting

**Can't connect from another device?**
1. Check if you can access `http://10.1.10.41:5000` from your computer first
2. Verify both devices are on the same WiFi network
3. Check Windows Firewall settings
4. Make sure the application is running (all three services)

**IP Address Changed?**
1. Run `ipconfig` in Command Prompt to get new IP
2. Update all configuration files with the new IP address
3. Restart the application

### 🛡️ Security Note

This configuration exposes your application to your local network. This is safe for development on a trusted home/office network, but should not be used on public WiFi or untrusted networks.