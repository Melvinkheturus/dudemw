#!/bin/bash

# Hostinger Deployment Fix Script
# This script fixes the MIME type and 404 issues on Hostinger

echo "🚀 Starting Hostinger Deployment Fix..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js version
echo -e "${YELLOW}📌 Checking Node.js version...${NC}"
node -v
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Node.js is not installed or not in PATH${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js is available${NC}"

# Step 2: Clean previous build
echo -e "${YELLOW}📌 Cleaning previous build...${NC}"
rm -rf .next
rm -f tsconfig.tsbuildinfo
echo -e "${GREEN}✅ Clean complete${NC}"

# Step 3: Install dependencies
echo -e "${YELLOW}📌 Installing dependencies...${NC}"
npm ci --production=false
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 4: Build the application
echo -e "${YELLOW}📌 Building Next.js application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"

# Step 5: Check if .next directory exists
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ .next directory not found after build${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .next directory exists${NC}"

# Step 6: Create logs directory if it doesn't exist
mkdir -p logs
echo -e "${GREEN}✅ Logs directory ready${NC}"

# Step 7: Copy .htaccess to deployment directory
if [ -f ".htaccess" ]; then
    echo -e "${GREEN}✅ .htaccess file exists${NC}"
else
    echo -e "${YELLOW}⚠️  .htaccess file not found, creating from example...${NC}"
    if [ -f ".htaccess.example" ]; then
        cp .htaccess.example .htaccess
        echo -e "${GREEN}✅ .htaccess created from example${NC}"
    else
        echo -e "${RED}❌ No .htaccess or .htaccess.example found${NC}"
    fi
fi

# Step 8: Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📌 Installing PM2 globally...${NC}"
    npm install -g pm2
fi
echo -e "${GREEN}✅ PM2 is available${NC}"

# Step 9: Stop existing PM2 process (if running)
echo -e "${YELLOW}📌 Stopping existing PM2 process...${NC}"
pm2 stop dudemw 2>/dev/null || true
pm2 delete dudemw 2>/dev/null || true
echo -e "${GREEN}✅ Previous process stopped${NC}"

# Step 10: Start the application with PM2
echo -e "${YELLOW}📌 Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Application started${NC}"

# Step 11: Save PM2 configuration
pm2 save
echo -e "${GREEN}✅ PM2 configuration saved${NC}"

# Step 12: Display status
echo -e "${YELLOW}📌 Application Status:${NC}"
pm2 status

# Step 13: Show recent logs
echo -e "${YELLOW}📌 Recent Logs:${NC}"
pm2 logs dudemw --lines 20 --nostream

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Fix Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}📌 Next Steps:${NC}"
echo "1. Visit your domain: https://dudemw.com"
echo "2. Check if JavaScript files load correctly"
echo "3. If issues persist, check logs: pm2 logs dudemw"
echo "4. Verify .htaccess is in your public_html directory"
echo ""
echo -e "${YELLOW}📌 Useful Commands:${NC}"
echo "- Check status: pm2 status"
echo "- View logs: pm2 logs dudemw"
echo "- Restart: pm2 restart dudemw"
echo "- Stop: pm2 stop dudemw"
echo ""
