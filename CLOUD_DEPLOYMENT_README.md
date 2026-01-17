# TTC - Docker Cloud Deployment
A production-ready cloud hosting setup for Django + MERN application stack.

## Quick Start

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your configuration**

3. **Add SSL certificates** to `certs/` directory

4. **Deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## What's Included

### Production Infrastructure
- ✅ PostgreSQL database with health checks
- ✅ Django with Gunicorn WSGI server
- ✅ MERN (React + Node.js) backend and frontend
- ✅ Nginx reverse proxy with SSL/TLS
- ✅ Docker Compose orchestration
- ✅ Security headers and compression

### Security Features
- ✅ HTTPS with SSL/TLS certificates
- ✅ HTTP → HTTPS redirection
- ✅ HSTS headers
- ✅ CORS configuration
- ✅ Environment-based secrets management

### CI/CD & Deployment
- ✅ GitHub Actions workflow
- ✅ Automated testing pipeline
- ✅ Docker image building
- ✅ Deployment automation script

### Cloud-Ready
- ✅ AWS S3 support for static files
- ✅ PostgreSQL database configuration
- ✅ Load balancer compatible
- ✅ Multi-service orchestration

## Files Structure

```
├── .env.example                    # Environment variables template
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
├── docker-compose.prod.yml         # Production Docker Compose config
├── nginx.prod.conf                 # Production Nginx configuration
├── deploy.sh                        # Deployment automation script
├── CLOUD_SETUP.md                  # Detailed setup documentation
├── Django-Boilerplate/
│   ├── Dockerfile.prod             # Production Django Dockerfile
│   └── requirements.prod.txt        # Production Python dependencies
└── certs/                          # SSL certificates directory (create manually)
    ├── certificate.crt
    └── private.key
```

## Architecture

```
Internet (HTTPS)
    ↓
Nginx Reverse Proxy (Port 443)
    ├→ Django API (/api/, /admin/)
    ├→ MERN Backend (/backend/)
    └→ React Frontend (/)
    ↓
PostgreSQL Database
```

## Environment Variables

Create `.env` with:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (False in production)
- `ALLOWED_HOSTS` - Your domain names
- `DB_*` - Database credentials
- `AWS_*` - S3 configuration (optional)
- `REACT_APP_API_URL` - API endpoint URL

See `.env.example` for complete list.

## Supported Cloud Providers

- AWS (ECS, EC2, RDS, S3)
- Azure (App Service, Postgres, Storage)
- Google Cloud (Cloud Run, Cloud SQL, Storage)
- DigitalOcean (Docker, Managed PostgreSQL, Spaces)
- Heroku (Buildpacks, Addons)
- Any VPS with Docker support

## Documentation

See [CLOUD_SETUP.md](./CLOUD_SETUP.md) for:
- Detailed setup instructions
- Security configuration
- Monitoring and maintenance
- Backup strategies
- Troubleshooting guide

## License

Same as parent project
