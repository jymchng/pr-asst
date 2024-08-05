#!/usr/bin/env sh

# Start the NestJS application in the background
npm run run-dev &

# Store the PID of the background process
APP_PID=$!

# Wait for the application to start by checking the endpoint
echo "Waiting for the application to start..."
until curl -s http://localhost:3000/fills/count >/dev/null 2>&1; do
  sleep 1
done

# Test the endpoint
response=$(curl -s http://localhost:3000/fills/count)

# Check if the response is 4883
if [ "$response" -eq 4883 ]; then
  echo "Test passed: Received expected response $response"
else
  echo "Test failed: Expected 4883 but got $response"
fi

# Optionally, kill the background application process
kill $APP_PID
