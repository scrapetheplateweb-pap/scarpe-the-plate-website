#!/bin/bash

echo "Starting backend server..."
cd backend && node server.js &
BACKEND_PID=$!

echo "Starting chatbot service..."
cd chatbot_service && python chatbot.py &
CHATBOT_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Chatbot PID: $CHATBOT_PID"

wait
