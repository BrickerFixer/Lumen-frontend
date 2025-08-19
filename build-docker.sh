#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t index-frontend .

# Run the container
echo "Running container on port 8080..."
docker run -d -p 8080:80 --name index-frontend-container index-frontend

echo "Frontend is now running on http://localhost:8080"