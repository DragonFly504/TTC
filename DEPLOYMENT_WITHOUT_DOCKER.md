# TTC Deployment Guide (Without Docker, Django Frontend)

## Prerequisites
- VPS with Ubuntu 20.04+ or similar
- Domain: ttcpworldwides.com (pointing to your VPS IP)
- SSH access to your VPS

---

## STEP 1: Initial VPS Setup

```bash
# Connect to VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y python3 python3-pip python3-venv postgresql postgresql-contrib nginx supervisor certbot python3-certbot-nginx git curl wget
```

---

## STEP 2: Clone Repository

```bash
# Create web directory
mkdir -p /var/www
cd /var/www

# Clone your repo
git clone https://github.com/DragonFly504/TTC.git
cd TTC/Django-Boilerplate

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.prod.txt
```

---

## STEP 3: Setup PostgreSQL Database

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user (run these in psql):
CREATE DATABASE ttc_database;
CREATE USER ttc_user WITH PASSWORD 'your-secure-password-here';
ALTER ROLE ttc_user SET client_encoding TO 'utf8';
ALTER ROLE ttc_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ttc_user SET default_transaction_deferrable TO on;
ALTER ROLE ttc_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE ttc_database TO ttc_user;
\q
```

---

## STEP 4: Configure Django

```bash
cd /var/www/TTC/Django-Boilerplate

# Create .env file
cp ../../.env.example .env

# Edit .env with your settings
nano .env
```

Update these values in `.env`:
```
SECRET_KEY=generate-random-key-here
DEBUG=False
ALLOWED_HOSTS=ttcpworldwides.com,www.ttcpworldwides.com,localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=ttc_database
DB_USER=ttc_user
DB_PASSWORD=your-secure-password-here
DB_HOST=127.0.0.1
DB_PORT=5432
```

Generate SECRET_KEY:
```bash
source venv/bin/activate
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

---

## STEP 5: Initialize Django

```bash
# Activate venv
cd /var/www/TTC/Django-Boilerplate
source venv/bin/activate

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser (optional, for admin)
python manage.py createsuperuser
```

---

## STEP 6: Setup Gunicorn

```bash
# Create gunicorn configuration directory
mkdir -p /var/www/TTC/gunicorn

# Create gunicorn config file
cat > /var/www/TTC/gunicorn/config.py << 'EOF'
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
EOF

# Test Gunicorn
cd /var/www/TTC/Django-Boilerplate
source venv/bin/activate
gunicorn --config ../gunicorn/config.py tracking_site.wsgi:application

# If successful, stop with Ctrl+C
```

---

## STEP 7: Setup Supervisor for Gunicorn

```bash
# Create supervisor config
sudo cat > /etc/supervisor/conf.d/ttc_gunicorn.conf << 'EOF'
[program:ttc_gunicorn]
directory=/var/www/TTC/Django-Boilerplate
command=/var/www/TTC/Django-Boilerplate/venv/bin/gunicorn --config /var/www/TTC/gunicorn/config.py tracking_site.wsgi:application
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
redirect_stderr=true
stdout_logfile=/var/log/ttc_gunicorn.log
user=www-data
EOF

# Create supervisor log directory
sudo mkdir -p /var/log/supervisor
sudo touch /var/log/ttc_gunicorn.log

# Update supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start ttc_gunicorn

# Check status
sudo supervisorctl status
```

---

## STEP 8: Configure Nginx

```bash
# Backup original nginx config
sudo mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Create new nginx config
sudo cat > /etc/nginx/sites-available/ttcpworldwides.com << 'EOF'
upstream gunicorn {
    server 127.0.0.1:8000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ttcpworldwides.com www.ttcpworldwides.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ttcpworldwides.com www.ttcpworldwides.com;

    # SSL Certificates (will add after certbot)
    ssl_certificate /etc/letsencrypt/live/ttcpworldwides.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ttcpworldwides.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Static files
    location /static/ {
        alias /var/www/TTC/Django-Boilerplate/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Media files
    location /media/ {
        alias /var/www/TTC/Django-Boilerplate/media/;
        expires 30d;
    }

    # Django application
    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/ttcpworldwides.com /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## STEP 9: Setup SSL Certificate (Let's Encrypt)

```bash
# Create certbot directory
sudo mkdir -p /var/www/certbot

# Get certificate
sudo certbot certonly --webroot -w /var/www/certbot -d ttcpworldwides.com -d www.ttcpworldwides.com

# Auto-renew certificates
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## STEP 10: Setup Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check firewall status
sudo ufw status
```

---

## STEP 11: Fix Permissions

```bash
# Set correct ownership
sudo chown -R www-data:www-data /var/www/TTC
sudo chmod -R 755 /var/www/TTC

# Make uploads directory writable
sudo mkdir -p /var/www/TTC/Django-Boilerplate/media
sudo chmod -R 775 /var/www/TTC/Django-Boilerplate/media
```

---

## STEP 12: Verify Everything Works

```bash
# Check Gunicorn status
sudo supervisorctl status ttc_gunicorn

# Check Nginx status
sudo systemctl status nginx

# Check logs
tail -f /var/log/ttc_gunicorn.log

# Test from VPS
curl https://ttcpworldwides.com
```

---

## Management Commands

```bash
# View Gunicorn logs
sudo tail -f /var/log/ttc_gunicorn.log

# Restart Gunicorn
sudo supervisorctl restart ttc_gunicorn

# Stop Gunicorn
sudo supervisorctl stop ttc_gunicorn

# Start Gunicorn
sudo supervisorctl start ttc_gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx config
sudo nginx -s reload

# Update code
cd /var/www/TTC
git pull origin main
cd Django-Boilerplate
source venv/bin/activate
pip install -r requirements.prod.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo supervisorctl restart ttc_gunicorn
```

---

## Troubleshooting

### Check if port 8000 is listening
```bash
sudo netstat -tlnp | grep 8000
```

### Check Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check PostgreSQL connection
```bash
psql -h 127.0.0.1 -U ttc_user -d ttc_database
```

### Restart all services
```bash
sudo supervisorctl restart ttc_gunicorn
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

**Your website is now live at: https://ttcpworldwides.com** 🚀
