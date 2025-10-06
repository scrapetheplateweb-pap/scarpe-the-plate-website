#!/bin/bash
set -e

echo "Starting chatbot service on port 5001..."
cd /home/runner/workspace/chatbot_service
python chatbot.py &
CHATBOT_PID=$!
echo "Chatbot started (PID: $CHATBOT_PID)"

sleep 2

echo "Starting production server (frontend + backend) on port 5000..."
cd /home/runner/workspace/backend
NODE_ENV=production PORT=5000 node server.js
