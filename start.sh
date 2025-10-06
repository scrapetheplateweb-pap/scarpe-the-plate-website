#!/bin/bash

# Kill any existing processes on required ports
echo "Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

sleep 1

echo "Starting backend on port 3000..."
(cd backend && node server.js) &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Starting chatbot service on port 5001..."
(cd chatbot_service && python chatbot.py) &
CHATBOT_PID=$!
echo "Chatbot PID: $CHATBOT_PID"

sleep 2

echo "Starting frontend on port 5000..."
cd frontend && npm run dev
