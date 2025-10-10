#!/bin/bash
# Stop development environment

echo "⏹️ Stopping Who Else Is Here - Development Environment"

docker-compose --profile dev down

echo "✅ Development environment stopped!"