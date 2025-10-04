#!/bin/bash

echo "Starting backend on port 3000..."
cd backend && node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

cd ..
echo "Starting chatbot service on port 5001..."
cd chatbot_service && python chatbot.py &
CHATBOT_PID=$!
echo "Chatbot PID: $CHATBOT_PID"

cd ..
sleep 2

echo "Starting production server on port 5000..."
cd frontend
serve -s dist -l tcp://0.0.0.0:5000 --no-clipboard
