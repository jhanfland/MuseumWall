#!/bin/bash

# set -e
echo "--- Running tests ---"
npm test
echo "--- Tests passed ---"
echo "--- Building Docker image ---"
docker build -t museum-wall-app .
echo "--- Docker image built ---"
docker run -p 5173:5173 museum-wall-app