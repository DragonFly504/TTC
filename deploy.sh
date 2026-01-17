#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== TTC Cloud Deployment Setup ===${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${RED}Please update .env with your configuration!${NC}\n"
    exit 1
fi

# Check if SSL certificates directory exists
if [ ! -d "certs" ]; then
    echo -e "${YELLOW}Creating certs directory...${NC}"
    mkdir -p certs
    echo -e "${RED}Please add your SSL certificates:${NC}"
    echo -e "${RED}  - certs/certificate.crt${NC}"
    echo -e "${RED}  - certs/private.key${NC}\n"
fi

# Load environment variables
export $(cat .env | grep -v '#' | xargs)

echo -e "${GREEN}Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build

echo -e "${GREEN}Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo -e "${GREEN}Running migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec django python manage.py migrate

echo -e "${GREEN}Collecting static files...${NC}"
docker-compose -f docker-compose.prod.yml exec django python manage.py collectstatic --noinput

echo -e "${GREEN}\n=== Deployment Complete ===${NC}"
echo -e "${GREEN}Services running:${NC}"
docker-compose -f docker-compose.prod.yml ps

echo -e "\n${YELLOW}Access your application:${NC}"
echo -e "  Frontend: https://TTCworldwides.com"
echo -e "  Backend: https://TTCworldwides.com/backend"
echo -e "  Admin: https://TTCworldwides.com/admin"
