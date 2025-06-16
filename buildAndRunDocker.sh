#!/bin/bash

set -e
echo "--- Running tests ---"
npm test
echo "--- Tests passed ---"
echo "--- Stopping and removing existing container"
docker stop museum-wall-app || true
docker rm museum-wall-app || true
echo "--- Building Docker image ---"
docker build -t museum-wall-app .
echo "--- Docker image built ---"
docker run --name museum-wall-app -p 5173:5173 museum-wall-app