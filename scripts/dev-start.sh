#!/bin/bash
# Start development environment

echo "🚀 Starting Who Else Is Here - Development Environment"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Start development containers
docker-compose --profile dev up -d

echo "✅ Development environment started!"
echo ""
echo "🌐 Application URL: http://localhost:8080"
echo "🔧 Frontend Dev Server: http://localhost:3002"
echo "🔌 Backend API: http://localhost:3001"
echo "🗄️  Database: localhost:5433"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "⏹️  To stop: ./scripts/dev-stop.sh"