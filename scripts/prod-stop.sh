#!/bin/bash
# Stop production environment

echo "⏹️ Stopping Who Else Is Here - Production Environment"

docker-compose --profile prod down

echo "✅ Production environment stopped!"