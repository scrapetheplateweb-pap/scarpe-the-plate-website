#!/bin/bash
set -e

echo "Starting backend on port 3000..."
cd /home/runner/workspace/backend
NODE_ENV=production node server.js &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

echo "Starting chatbot service on port 5001..."
cd /home/runner/workspace/chatbot_service
python chatbot.py &
CHATBOT_PID=$!
echo "Chatbot started (PID: $CHATBOT_PID)"

sleep 3

echo "Starting production frontend server on port 5000..."
cd /home/runner/workspace/frontend
serve -s dist -l 5000 --single
