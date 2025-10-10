# Server Configuration Analysis - "Who Else Is Here"

**Analysis Date:** 2025-10-09
**Domain:** whoelseishere.com (to be acquired and pointed to this server)

## Current Server Environment

### System Information
- **Server:** Contabo VPS (vmi2165635.contaboserver.net)
- **OS:** Ubuntu 20.04.6 LTS (Focal)
- **Kernel:** Linux 5.4.0-216-generic
- **Architecture:** x86_64

### Resources Available
- **RAM:** 16GB total, 10GB available
- **Storage:** 391GB total, 239GB available (36% used)
- **CPU:** Multi-core (nginx running 6 worker processes)

### Current Software Stack
- **Web Server:** Nginx 1.18.0 (Ubuntu) - ✅ Active and running
- **Node.js:** v22.17.0 - ✅ Latest LTS version
- **NPM:** v11.6.0 - ✅ Current version
- **PostgreSQL:** ❌ Not installed
- **PM2:** ❌ Not installed

### Current Nginx Configuration

**Enabled Domains:**
1. **carlosgorrichoai.one** - Main domain with multiple app proxies
2. **gsudatapanthers.com** - Secondary domain with Streamlit app

**Existing Proxy Pattern:**
- n8n workflow automation: `/n8n/` → `localhost:5678`
- AI chat apps: `/pepino_rojo/` → `localhost:65000`
- RAG applications: `/rag_oben/` → `localhost:8502`
- Agentic RAG apps: multiple paths → `localhost:8503`

**SSL Configuration:**
- ✅ Let's Encrypt certificates active
- ✅ Automatic HTTP→HTTPS redirect
- ✅ Modern SSL security headers

## Required Installation for "Who Else Is Here"

### PostgreSQL Database
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 startup
```

### SSL Certificate for New Domain
```bash
sudo certbot --nginx -d whoelseishere.com
```

## Recommended Tech Stack for Self-Hosting

### Frontend
- **React + TypeScript + Vite**
- **Build Output:** Static files served by Nginx
- **Location:** `/var/www/whoelseishere.com/`

### Backend
- **Node.js + Express + TypeScript**
- **Port:** 3001 (available, not conflicting with existing services)
- **Process Management:** PM2
- **Location:** `/home/cgorricho/apps/who_else_is_here/backend/`

### Database
- **PostgreSQL** (to be installed)
- **Database Name:** `whoelseishere_db`
- **User:** `whoelseishere_user`

### Authentication
- **Passport.js + LinkedIn Strategy**
- **Session Storage:** PostgreSQL
- **Environment Variables:** `.env` file with LinkedIn OAuth credentials

## Nginx Configuration Plan for whoelseishere.com

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    server_name whoelseishere.com;
    client_max_body_size 50M;

    # Serve React app static files
    location / {
        root /var/www/whoelseishere.com;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        # Security headers
        proxy_set_header X-Script-Name /api;
        proxy_redirect off;
        proxy_buffering off;
        proxy_read_timeout 30s;
    }

    # Socket.io for real-time updates (if needed)
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL managed by Certbot (to be added)
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/whoelseishere.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/whoelseishere.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = whoelseishere.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name whoelseishere.com;
    return 404;
}
```

## Port Allocation

**Currently Used Ports:**
- 5678: n8n
- 65000: pepino_rojo chat app
- 8502: rag_oben
- 8503: agentic_rag apps
- 8501: gsudatapanthers TAG app

**Available for "Who Else Is Here":**
- **3001:** Node.js backend API ✅
- **5432:** PostgreSQL (default) ✅

## Deployment Strategy

1. **Setup Phase:**
   - Install PostgreSQL and PM2
   - Create database and user
   - Setup project directory structure

2. **Development Phase:**
   - Build React app locally
   - Deploy static files to `/var/www/whoelseishere.com/`
   - Deploy Node.js backend to `/home/cgorricho/apps/who_else_is_here/backend/`

3. **Production Phase:**
   - Configure PM2 for auto-restart
   - Setup nginx configuration
   - Obtain SSL certificate
   - Configure environment variables

## Security Considerations

- ✅ Server already has proper SSL configuration
- ✅ Firewall likely configured (based on existing setup)
- 🔄 Need to secure PostgreSQL installation
- 🔄 Need to configure LinkedIn OAuth properly
- 🔄 Need to set up proper session security

## Scalability Notes

**Current Setup Scales Well:**
- Nginx can handle high traffic loads
- PM2 can run multiple Node.js instances
- PostgreSQL can handle significant database load
- Server resources (16GB RAM, 239GB storage) are adequate for growth

**Future Scaling Options:**
- Horizontal scaling with additional server instances
- Database read replicas
- CDN for static assets
- Load balancer for multiple app instances