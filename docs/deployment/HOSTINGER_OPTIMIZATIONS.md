# Hostinger Cloud Hosting Optimizations Applied

## Overview
Your codebase has been optimized for Hostinger cloud hosting with production-ready configurations.

## Optimizations Applied

### 1. Next.js Configuration (`next.config.js`)

**Performance Enhancements:**
- ✅ **SWC Minification**: Enabled for faster builds and smaller bundles
- ✅ **Standalone Output**: Optimized deployment with file tracing
- ✅ **Console Removal**: Production builds exclude console logs (except errors/warnings)
- ✅ **Aggressive Caching**: Static assets cached for 1 year
- ✅ **Code Splitting**: Optimized vendor and common chunks
- ✅ **Tree Shaking**: Removes unused code from bundles
- ✅ **Package Import Optimization**: Reduces bundle size for common libraries

**Security Headers:**
- DNS prefetch control
- Frame protection
- Content type sniffing prevention
- Permissions policy

**Cache Strategy:**
- Images: 1 hour cache
- Static assets: 1 year immutable cache

---

### 2. PM2 Configuration (`ecosystem.config.js`)

**Resource Management:**
- ✅ **Cluster Mode**: Better CPU utilization (configurable instances)
- ✅ **Memory Limit**: 1GB max (auto-restart on exceed)
- ✅ **Log Rotation**: 10MB max size, keeps last 5 files
- ✅ **Graceful Shutdown**: 5-second kill timeout
- ✅ **Auto-Restart**: Exponential backoff on failures

**Monitoring:**
- Error and output logs with timestamps
- Automatic restart on crashes (max 10 attempts)
- Minimum 10s uptime before considering stable

---

### 3. Package Scripts (`package.json`)

**New Production Scripts:**
```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start with custom server
npm start

# PM2 management
npm run start:pm2    # Start with PM2
npm run stop:pm2     # Stop PM2 process
npm run restart:pm2  # Restart PM2 process
npm run logs:pm2     # View PM2 logs

# Bundle analysis
npm run build:analyze
```

**Auto-Setup:**
- Logs directory created automatically on install
- Clean build process (removes .next before building)

---

### 4. Server Configuration (`server.js`)

**Already Optimized:**
- ✅ Binds to 0.0.0.0 for Hostinger compatibility
- ✅ Handles X-Forwarded-Host headers
- ✅ Subdomain detection for admin panel
- ✅ Proper error handling

---

## Deployment Workflow

### Initial Setup
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start with PM2
npm run start:pm2

# 4. Save PM2 configuration
pm2 save
pm2 startup
```

### Continuous Deployment
```bash
# Use the deploy.sh script
./deploy.sh
```

The script automatically:
1. Pulls latest code
2. Installs dependencies (if package.json changed)
3. Builds the application
4. Restarts PM2 process

---

## Performance Metrics

### Bundle Size Reduction
- **Code Splitting**: Vendor and common chunks separated
- **Tree Shaking**: Unused code removed
- **Minification**: SWC minifier (faster than Terser)
- **Package Optimization**: Lucide, Radix UI, Recharts optimized

### Memory Management
- **Node.js**: 2GB max old space size
- **PM2**: Auto-restart at 1GB memory usage
- **Logs**: Rotated at 10MB to prevent disk issues

### Caching Strategy
- **Static Assets**: 1 year cache (immutable)
- **Images**: 1 hour cache
- **API Routes**: No caching (dynamic)

---

## Monitoring Commands

```bash
# Check application status
pm2 status

# View live logs
pm2 logs dudemw --lines 100

# Monitor resources
pm2 monit

# Restart application
pm2 restart dudemw

# Reload (zero-downtime)
pm2 reload dudemw
```

---

## Hostinger-Specific Notes

### Resource Limits
- **Memory**: Optimized for 2-4GB RAM
- **CPU**: Cluster mode for multi-core utilization
- **Disk**: Log rotation prevents disk space issues

### Apache Integration
- `.htaccess` handles routing to Node.js
- Static assets served directly by Apache
- Proxy to localhost:3000 for dynamic content

### Environment Variables
Set in Hostinger hPanel → Advanced → Environment Variables:
- `NODE_ENV=production`
- `PORT=3000`
- `PM2_INSTANCES=1` (or 2 for better performance)

---

## Troubleshooting

### High Memory Usage
```bash
# Check current memory
pm2 status

# Restart to clear memory
pm2 restart dudemw
```

### Slow Build Times
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm run build
```

### Log Files Too Large
```bash
# PM2 automatically rotates logs
# Manual cleanup if needed
pm2 flush dudemw
```

---

## Next Steps

1. **Test the optimizations**: Deploy and monitor performance
2. **Adjust PM2 instances**: Try 2 instances if you have 2+ CPU cores
3. **Monitor metrics**: Use `pm2 monit` to track resource usage
4. **Enable CDN**: Consider Cloudflare for static asset caching

Your application is now **production-ready** and **optimized for Hostinger cloud hosting**! 🚀
