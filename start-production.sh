#!/bin/bash

echo "Starting backend on port 3000..."
(cd backend && node server.js) &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Starting chatbot service on port 5001..."
(cd chatbot_service && python chatbot.py) &
CHATBOT_PID=$!
echo "Chatbot PID: $CHATBOT_PID"

sleep 2

echo "Starting production server on port 5000..."
cd frontend
npx serve -s dist -l 5000 --no-clipboard
