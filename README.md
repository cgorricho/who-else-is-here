# Who Else Is Here 👥

A simple LinkedIn-focused networking app for events that solves the physical constraints of in-person networking.

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- whoelseishere.com domain (optional, for production)

### Development Setup

1. **Clone and configure:**
   ```bash
   git clone <repository>
   cd who_else_is_here
   cp .env.example .env
   # Edit .env with your LinkedIn OAuth credentials
   ```

2. **Start development environment:**
   ```bash
   ./scripts/dev-start.sh
   ```

3. **Access the application:**
   - 🌐 Main App: http://localhost:8080
   - 🔧 Frontend Dev: http://localhost:3002 (with hot reload)
   - 🔌 Backend API: http://localhost:3001
   - 🗄️ Database: localhost:5433

### Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.example .env
   # Set production URLs and LinkedIn OAuth for whoelseishere.com
   ```

2. **Deploy:**
   ```bash
   ./scripts/prod-deploy.sh
   ```

## Architecture

### Docker Services
- **database**: PostgreSQL 15 with persistent data
- **backend**: Node.js + Express API
- **frontend**: React + TypeScript (dev) or Nginx-served (prod)
- **nginx**: Reverse proxy with SSL termination

### Key Features
- 📱 Mobile-responsive web app
- 🔗 LinkedIn OAuth authentication
- 👥 Real-time attendee lists
- 🎯 One-click LinkedIn connections
- 📞 Contact saving for non-LinkedIn users
- 🔒 Privacy-first design with explicit consent

## Development Workflow

### Starting Development
```bash
./scripts/dev-start.sh    # Start all services
docker-compose logs -f    # View logs
./scripts/dev-stop.sh     # Stop all services
```

### Database Management
```bash
# Connect to database
docker exec -it whoelseishere_db psql -U whoelseishere_user -d whoelseishere_db

# View database logs
docker-compose logs database

# Reset database (⚠️ destroys all data)
docker-compose down -v
docker-compose --profile dev up -d
```

### Building for Production
```bash
# Build and test production images
docker-compose --profile prod build

# Deploy production
./scripts/prod-deploy.sh
```

## Project Structure

```
who_else_is_here/
├── docker-compose.yml          # Multi-service orchestration
├── .env.example               # Environment template
├── backend/                   # Node.js API
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/                  # React app
│   ├── Dockerfile.dev         # Development build
│   ├── Dockerfile.prod        # Production build
│   ├── package.json
│   └── src/
├── nginx/                     # Reverse proxy
│   ├── Dockerfile
│   ├── dev.conf              # Development config
│   └── conf.d/default.conf   # Production config
├── database/                  # Database setup
│   └── init.sql              # Schema initialization
└── scripts/                   # Management scripts
    ├── dev-start.sh
    ├── dev-stop.sh
    ├── prod-deploy.sh
    └── prod-stop.sh
```

## Environment Variables

Key variables in `.env`:

```bash
# Database
DB_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=your_jwt_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# URLs
CLIENT_URL=https://whoelseishere.com
REACT_APP_API_URL=https://whoelseishere.com/api
```

## Domain Configuration

For production with whoelseishere.com:

1. **Point domain to server:**
   ```bash
   # DNS A record: whoelseishere.com → your.server.ip
   ```

2. **Update nginx configuration:**
   ```bash
   # Edit nginx/conf.d/default.conf
   # Add SSL certificates to nginx/ssl/
   ```

3. **Let's Encrypt SSL (recommended):**
   ```bash
   # Install certbot on host
   sudo certbot --nginx -d whoelseishere.com
   # Copy certificates to nginx/ssl/
   ```

## Monitoring and Logs

```bash
# View all logs
docker-compose logs -f

# Service-specific logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Container stats
docker stats
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Change host ports in docker-compose.yml
   - Default: 8080 (nginx), 3001 (backend), 3002 (frontend-dev), 5433 (database)

2. **Database connection issues:**
   ```bash
   docker-compose logs database
   # Check if PostgreSQL is healthy
   ```

3. **LinkedIn OAuth not working:**
   - Verify LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET
   - Check callback URL matches LinkedIn app settings
   - Ensure HTTPS for production OAuth

4. **Frontend not loading:**
   ```bash
   docker-compose logs frontend
   docker-compose logs nginx-dev  # or nginx for production
   ```

## Scaling for Production

The Docker setup is designed for easy scaling:

```bash
# Scale backend instances
docker-compose --profile prod up -d --scale backend=3

# Add load balancer
# Update nginx upstream configuration

# Database scaling
# Configure read replicas
# Use external managed PostgreSQL
```

## Security Considerations

- ✅ Non-root containers
- ✅ Environment variable secrets
- ✅ SSL/TLS encryption
- ✅ Security headers
- 🔄 Regular security updates needed
- 🔄 Database backup strategy needed

## MVP Goals

This Docker setup supports the core MVP:
1. ✅ Event creation with QR codes
2. ✅ LinkedIn authentication
3. ✅ Attendee list viewing
4. ✅ One-click connections
5. ✅ Privacy consent handling

Future features (post-MVP) can be added as additional services or scaled within existing containers.