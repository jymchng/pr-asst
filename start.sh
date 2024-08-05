#!/bin/bash

# Start both frontend and backend services locally in DEV

# Function to run the backend
run_backend() {
    echo "Starting backend in development environment..."
    cd backend || { echo "Backend directory not found"; exit 1; }
    npm install
    npm run run-dev &
    BACKEND_PID=$!
    cd ..
}

# Function to run the frontend
run_frontend() {
    echo "Starting frontend in development environment..."
    cd frontend || { echo "Frontend directory not found"; exit 1; }
    npm install
    npm run dev &
    FRONTEND_PID=$!
    cd ..
}

# Function to stop both backend and frontend
stop_services() {
    echo "Stopping backend and frontend..."
    kill $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Trap CTRL+C to stop services
trap stop_services INT

# Run backend and frontend
run_backend
run_frontend

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID
