#!/bin/bash

# Cloud Deployment Health Check Script

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== TTC Cloud Health Check ===${NC}\n"

# Check Docker
echo -e "${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker installed${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker not found${NC}"
    exit 1
fi

# Check Docker Compose
echo -e "\n${YELLOW}Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
    docker-compose --version
else
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi

# Check .env file
echo -e "\n${YELLOW}Checking configuration...${NC}"
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo -e "${YELLOW}Run: cp .env.example .env${NC}"
    exit 1
fi

# Check SSL certificates
echo -e "\n${YELLOW}Checking SSL certificates...${NC}"
if [ -f "certs/certificate.crt" ] && [ -f "certs/private.key" ]; then
    echo -e "${GREEN}✓ SSL certificates found${NC}"
else
    echo -e "${RED}✗ SSL certificates not found${NC}"
    echo -e "${YELLOW}Create certs/ directory and add certificate.crt and private.key${NC}"
fi

# Check Docker services
echo -e "\n${YELLOW}Checking Docker services...${NC}"
if docker-compose -f docker-compose.prod.yml ps 2>/dev/null | grep -q "postgres"; then
    echo -e "${GREEN}✓ Services configured${NC}"
    docker-compose -f docker-compose.prod.yml ps
else
    echo -e "${RED}✗ Services not running${NC}"
fi

# Check required environment variables
echo -e "\n${YELLOW}Checking critical environment variables...${NC}"
source .env 2>/dev/null
REQUIRED_VARS=("SECRET_KEY" "ALLOWED_HOSTS" "DB_NAME" "DB_USER" "DB_PASSWORD")

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}✗ Missing: ${var}${NC}"
    else
        echo -e "${GREEN}✓ ${var} is set${NC}"
    fi
done

echo -e "\n${YELLOW}=== Health Check Complete ===${NC}"
