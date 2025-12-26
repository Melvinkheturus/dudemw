# Hostinger Cloud Hosting - Deployment Guide

## Quick Deployment

### Automatic Deployment (Recommended)
The project is configured for automatic deployment via Git webhook:

```bash
# Simply push to GitHub
git push origin main
```

Hostinger will automatically:
1. Pull latest changes
2. Install dependencies (if package.json changed)
3. Build the application
4. Restart PM2 process

### Manual Deployment
If you need to deploy manually:

```bash
# SSH into your Hostinger server
ssh your-username@your-server.com

# Navigate to project directory
cd /path/to/dudemw-1

# Run deployment script
./deploy.sh
```

## Configuration Files

### `.hostingerrc`
Hostinger auto-detection configuration:
- Framework: Next.js
- Node Version: 20.11.0
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Port: 3000

### `hostinger.json`
Alternative JSON configuration for Hostinger platform.

### `ecosystem.config.js`
PM2 process manager configuration for production deployment.

## Environment Variables

Set these in Hostinger hPanel → Advanced → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Domain Configuration (for subdomain support)
NEXT_PUBLIC_COOKIE_DOMAIN=.yourdomain.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin
NEXT_PUBLIC_MAIN_DOMAIN=yourdomain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com

# Other services
RESEND_API_KEY=your_resend_key
```

## Deployment Script Features

The `deploy.sh` script includes:
- ✅ Automatic Git pull from main branch
- ✅ Smart dependency installation (only when package.json changes)
- ✅ Clean build process
- ✅ PM2 process management
- ✅ Health check verification
- ✅ Detailed logging and error handling

## Monitoring

After deployment, monitor your application:

```bash
# Check application status
pm2 status

# View live logs
pm2 logs dudemw

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart dudemw
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Application Not Starting
```bash
# Check PM2 logs
pm2 logs dudemw --lines 50

# Restart PM2
pm2 restart dudemw
```

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process if needed
pm2 delete dudemw
pm2 start ecosystem.config.js
```

## File Structure

```
dudemw-1/
├── deploy.sh              # Main deployment script
├── .hostingerrc          # Hostinger configuration
├── hostinger.json        # Alternative config
├── ecosystem.config.js   # PM2 configuration
├── .htaccess            # Apache rewrite rules
└── server.js            # Custom server (if needed)
```

## Support

For Hostinger-specific issues:
- Check Hostinger documentation
- Contact Hostinger support
- Review deployment logs in hPanel
