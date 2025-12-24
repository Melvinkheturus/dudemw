#!/bin/bash

# 🚀 Quick Deployment Script for Subdomain Fix
# Run this script on your Hostinger server via SSH

set -e  # Exit on any error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔧 DEPLOYING SUBDOMAIN FIX"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found${NC}"
    echo "Please run this script from your project root directory"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Stopping PM2 process...${NC}"
pm2 stop dudemw || echo "No running process to stop"
pm2 delete dudemw || echo "No process to delete"
echo -e "${GREEN}✅ PM2 stopped${NC}"
echo ""

echo -e "${YELLOW}📋 Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}📋 Step 3: Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo -e "${YELLOW}📋 Step 4: Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Logs directory ready${NC}"
echo ""

echo -e "${YELLOW}📋 Step 5: Making server.js executable...${NC}"
chmod +x server.js
echo -e "${GREEN}✅ Server script ready${NC}"
echo ""

echo -e "${YELLOW}📋 Step 6: Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
echo -e "${GREEN}✅ Application started${NC}"
echo ""

echo -e "${YELLOW}📋 Step 7: Saving PM2 configuration...${NC}"
pm2 save
echo -e "${GREEN}✅ PM2 configuration saved${NC}"
echo ""

echo -e "${YELLOW}📋 Step 8: Checking application status...${NC}"
pm2 status
echo ""

echo -e "${YELLOW}📋 Step 9: Viewing recent logs...${NC}"
pm2 logs dudemw --lines 20 --nostream
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}  ✅ DEPLOYMENT COMPLETE!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔍 Next Steps:"
echo ""
echo "1. Test main domain:"
echo "   curl -I https://dudemw.com"
echo ""
echo "2. Test admin subdomain:"
echo "   curl -I https://admin.dudemw.com"
echo ""
echo "3. Open in browser:"
echo "   - Main: https://dudemw.com"
echo "   - Admin: https://admin.dudemw.com"
echo "   - Setup: https://admin.dudemw.com/setup"
echo ""
echo "4. Monitor logs:"
echo "   pm2 logs dudemw"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If admin subdomain still shows parked page:"
echo "1. Check Hostinger hPanel → Subdomains"
echo "2. Verify document root matches main domain"
echo "3. See SUBDOMAIN_FIX_GUIDE.md for detailed troubleshooting"
echo ""
