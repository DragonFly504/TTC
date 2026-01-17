# TTC Cloud Hosting Setup Documentation

## Overview
This document outlines the cloud hosting setup for the TTC application (Django + MERN stack).

## Files Created

### Configuration Files
- **.env.example** - Environment variables template (copy to .env and update)
- **docker-compose.prod.yml** - Production Docker Compose configuration with PostgreSQL
- **nginx.prod.conf** - Production Nginx configuration with SSL, security headers, and routing
- **deploy.sh** - Automated deployment script

### CI/CD
- **.github/workflows/deploy.yml** - GitHub Actions workflow for testing and deployment

### Docker
- **Django-Boilerplate/Dockerfile.prod** - Production-optimized Django Dockerfile with Gunicorn
- **Django-Boilerplate/requirements.prod.txt** - Production dependencies

## Setup Instructions

### Step 1: Prepare Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and update:
- SECRET_KEY
- ALLOWED_HOSTS
- Database credentials
- AWS S3 settings (if using)
- Email configuration
- API URLs

### Step 2: Obtain SSL Certificates
Create `certs/` directory and add:
- `certs/certificate.crt` - Your SSL certificate
- `certs/private.key` - Your private key

For free certificates, use Let's Encrypt:
```bash
mkdir -p certs
# Use certbot or similar to generate certificates
```

### Step 3: Deploy

#### Option A: Using deployment script
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Manual deployment
```bash
# Load environment variables
export $(cat .env | grep -v '#' | xargs)

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec django python manage.py migrate

# Collect static files
docker-compose -f docker-compose.prod.yml exec django python manage.py collectstatic --noinput
```

## Services

### PostgreSQL Database
- **Port**: 5432
- **Health Check**: Enabled

### Django (Gunicorn)
- **Port**: 8000
- **Command**: `gunicorn tracking_site.wsgi:application`

### MERN Backend
- **Port**: 5000
- **Environment**: Production

### MERN Frontend (React)
- **Port**: 3000
- **Environment**: Production build

### Nginx (Reverse Proxy)
- **Ports**: 80 (HTTP → HTTPS redirect), 443 (HTTPS)
- **Routes**:
  - `/` → Frontend
  - `/api/` → Django
  - `/admin/` → Django Admin
  - `/backend/` → MERN Backend
  - `/static/` → Static files

## Security Features

1. **SSL/TLS**: HTTPS enforced with HTTP redirect
2. **Security Headers**:
   - HSTS (HTTP Strict-Transport-Security)
   - X-Frame-Options (SAMEORIGIN)
   - X-Content-Type-Options (nosniff)
   - X-XSS-Protection

3. **Gzip Compression**: Enabled for faster content delivery
4. **Database**: PostgreSQL with health checks
5. **Environment Variables**: Sensitive data in .env file

## Cloud Provider Options

### AWS
- Use RDS for PostgreSQL
- Use S3 for static files and media
- Use ALB/NLB for load balancing
- Use CloudFront for CDN

### Azure
- Use Azure Database for PostgreSQL
- Use Blob Storage for static files
- Use Application Gateway for load balancing
- Use Azure CDN

### Google Cloud
- Use Cloud SQL for PostgreSQL
- Use Cloud Storage for static files
- Use Cloud Load Balancing
- Use Cloud CDN

### Heroku
- Use Heroku Postgres addon
- Use AWS S3 addon
- Deploy via GitHub integration

### DigitalOcean / Linode
- Use managed PostgreSQL
- Use managed Object Storage (Spaces)
- Deploy via Docker containers
- Use load balancers

## Monitoring & Logs

View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Specific service logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f django
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## Maintenance

### Database Backups
```bash
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ttc_user ttc_database > backup.sql
```

### Update Services
```bash
git pull origin production
docker-compose -f docker-compose.prod.yml up -d --build
```

### Health Checks
```bash
docker-compose -f docker-compose.prod.yml ps
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| SECRET_KEY | Django secret key | Yes |
| DEBUG | Django debug mode (False in production) | Yes |
| ALLOWED_HOSTS | Comma-separated list of allowed domains | Yes |
| DB_ENGINE | Database engine (django.db.backends.postgresql) | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| DB_HOST | Database host | Yes |
| DB_PORT | Database port (5432) | Yes |
| USE_S3 | Use AWS S3 for static files | No |
| AWS_ACCESS_KEY_ID | AWS access key | Conditional |
| AWS_SECRET_ACCESS_KEY | AWS secret key | Conditional |
| AWS_STORAGE_BUCKET_NAME | S3 bucket name | Conditional |
| REACT_APP_API_URL | Frontend API endpoint | No |

## Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.prod.yml logs
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database connection issues
```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U ttc_user -d ttc_database
```

### Static files not serving
```bash
docker-compose -f docker-compose.prod.yml exec django python manage.py collectstatic --noinput --clear
```

## Next Steps

1. Choose your cloud provider
2. Update `.env` with production values
3. Obtain SSL certificates
4. Run `./deploy.sh`
5. Monitor logs and verify all services are running
6. Set up GitHub Actions secrets for CI/CD
7. Configure database backups
8. Set up monitoring and alerting
