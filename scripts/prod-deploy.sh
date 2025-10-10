#!/bin/bash
# Deploy production environment

echo "🚀 Deploying Who Else Is Here - Production Environment"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Build and start production containers
docker-compose --profile prod up -d --build

echo "✅ Production environment deployed!"
echo ""
echo "🌐 Application URL: http://localhost:8080 (or https://whoelseishere.com if domain configured)"
echo "🔌 Backend API: http://localhost:3001"
echo "🗄️  Database: localhost:5433"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "⏹️  To stop: ./scripts/prod-stop.sh"