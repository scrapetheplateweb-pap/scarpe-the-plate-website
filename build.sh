#!/bin/bash

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing chatbot dependencies..."
cd ../chatbot_service
pip install -r requirements.txt

echo "Installing serve package globally..."
npm install -g serve

echo "Building frontend..."
cd ../frontend
npm install
npm run build
