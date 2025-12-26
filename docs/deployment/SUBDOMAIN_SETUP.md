# 🌐 Subdomain Setup Guide for Hostinger

**Complete guide to configure admin.dudemw.com subdomain on Hostinger**

---

## 📋 Overview

Your Dude Men's Wears platform uses subdomain-based routing:

- **Main Store:** `dudemw.com` - Customer-facing e-commerce store
- **Admin Dashboard:** `admin.dudemw.com` - Admin panel and management
- **Admin Setup:** `admin.dudemw.com/setup` - Initial admin account creation

This setup provides:
- ✅ Clean URL separation (better security)
- ✅ Independent authentication contexts
- ✅ Better SEO (admin pages not indexed)
- ✅ Professional appearance

---

## 🎯 Subdomain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        dudemw.com                            │
│                    (Main Store - Port 3000)                  │
│                                                              │
│  Routes:                                                     │
│  ├── / (homepage)                                           │
│  ├── /products                                              │
│  ├── /cart                                                  │
│  ├── /checkout                                              │
│  ├── /profile                                               │
│  └── /auth/*                                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    admin.dudemw.com                          │
│                  (Admin Dashboard - Port 3000)               │
│                                                              │
│  Routes (internally mapped to /admin/*):                    │
│  ├── / → /admin (dashboard)                                │
│  ├── /setup → /admin/setup (initial setup)                 │
│  ├── /login → /admin/login                                 │
│  ├── /products → /admin/products                           │
│  ├── /orders → /admin/orders                               │
│  └── /settings → /admin/settings                           │
└─────────────────────────────────────────────────────────────┘
```

**How it works:**
- Middleware detects the subdomain from the `host` header
- Admin subdomain requests are internally rewritten to `/admin/*` routes
- Main domain blocks direct `/admin` access (redirects to subdomain)
- Cookies are shared across subdomains using `.dudemw.com` domain

---

## 🚀 Step-by-Step Setup on Hostinger

### Step 1: Create Subdomain in Hostinger

1. **Log in to Hostinger hPanel**
   - Go to https://hpanel.hostinger.com

2. **Navigate to Domains**
   - In hPanel, go to **Websites** → Select your website
   - Go to **Advanced** → **Subdomains**

3. **Create Admin Subdomain**
   - Click **"Create Subdomain"**
   - Subdomain: `admin`
   - Domain: `dudemw.com`
   - Full subdomain: `admin.dudemw.com`
   - Document Root: `/home/username/domains/dudemw.com/public_html`
     ⚠️ **IMPORTANT:** Use the SAME directory as main domain
   - Click **"Create"**

4. **Verify Subdomain Creation**
   ```bash
   # Check DNS propagation (may take 5-30 minutes)
   nslookup admin.dudemw.com
   
   # Or use online tool
   # https://dnschecker.org/#A/admin.dudemw.com
   ```

### Step 2: Configure SSL for Subdomain

1. **In hPanel, go to SSL**
   - **Advanced** → **SSL**

2. **Install SSL Certificate**
   - Select domain: `admin.dudemw.com`
   - Click **"Install SSL"**
   - Hostinger will provide free SSL
   - Wait 5-15 minutes for activation

3. **Verify SSL Certificate**
   ```bash
   # Test HTTPS access
   curl -I https://admin.dudemw.com
   
   # Should return: HTTP/2 200 (or 301/302 redirect)
   ```

### Step 3: Configure Environment Variables

SSH into your server:
```bash
ssh username@dudemw.com -p 65002
cd ~/domains/dudemw.com/public_html
```

Edit `.env.production`:
```bash
nano .env.production
```

Add/update these variables:
```env
# Main application URL
NEXT_PUBLIC_APP_URL=https://dudemw.com

# Admin subdomain configuration
NEXT_PUBLIC_ADMIN_URL=https://admin.dudemw.com
NEXT_PUBLIC_MAIN_DOMAIN=dudemw.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin

# Cookie domain (with leading dot for cross-subdomain sharing)
NEXT_PUBLIC_COOKIE_DOMAIN=.dudemw.com

# Keep all other existing variables...
```

Save: `CTRL+X` → `Y` → `ENTER`

### Step 4: Update Application Configuration

The middleware is already configured for subdomain routing. Verify:

```bash
cat middleware.ts | grep "isAdminSubdomain"
# Should show subdomain detection logic
```

### Step 5: Restart Application

```bash
# Restart PM2 to load new environment variables
pm2 restart dudemw

# Check status
pm2 status

# View logs for any issues
pm2 logs dudemw --lines 50
```

### Step 6: Configure Reverse Proxy (If Needed)

If using `.htaccess`, ensure it handles both domains:

```bash
cat .htaccess
```

Should contain:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Exclude static files
  RewriteCond %{REQUEST_URI} !^/public/
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$
  
  # Proxy all requests to Node.js application
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

This configuration works for both main domain and subdomains.

---

## ✅ Verification & Testing

### Test Main Store (dudemw.com)

```bash
# Test homepage
curl -I https://dudemw.com
# Expected: 200 OK

# Test that /admin redirects to subdomain
curl -I https://dudemw.com/admin
# Expected: 302/301 redirect to https://admin.dudemw.com

# Test products page
curl -I https://dudemw.com/products
# Expected: 200 OK
```

### Test Admin Subdomain (admin.dudemw.com)

```bash
# Test admin dashboard (should redirect to login if not authenticated)
curl -I https://admin.dudemw.com
# Expected: 302 redirect to /login or 200 if on dashboard

# Test admin setup page
curl -I https://admin.dudemw.com/setup
# Expected: 200 OK

# Test admin login page
curl -I https://admin.dudemw.com/login
# Expected: 200 OK
```

### Browser Testing

1. **Visit Main Store**
   - Open: `https://dudemw.com`
   - ✅ Store homepage loads
   - ✅ Can browse products
   - ✅ Can add to cart

2. **Try Direct Admin Access**
   - Open: `https://dudemw.com/admin`
   - ✅ Should redirect to `https://admin.dudemw.com`

3. **Visit Admin Subdomain**
   - Open: `https://admin.dudemw.com`
   - ✅ Should redirect to `https://admin.dudemw.com/login` (if not authenticated)
   - ✅ Or show admin dashboard (if authenticated)

4. **Test Admin Setup**
   - Open: `https://admin.dudemw.com/setup`
   - ✅ Setup page loads
   - ✅ Can create admin account
   - ✅ After setup, redirects to login

5. **Test Admin Login**
   - Open: `https://admin.dudemw.com/login`
   - ✅ Login form loads
   - ✅ Can log in with admin credentials
   - ✅ After login, redirects to dashboard

6. **Test Cross-Subdomain Authentication**
   - Log in to admin: `https://admin.dudemw.com/login`
   - ✅ Authentication cookie set with domain `.dudemw.com`
   - ✅ Can access all admin pages
   - ✅ Cookie shared across subdomains

---

## 🔧 Troubleshooting

### Issue: Subdomain not working (404 error)

**Symptoms:** `admin.dudemw.com` returns 404 or "site not found"

**Solutions:**
```bash
# 1. Check DNS propagation
nslookup admin.dudemw.com
# Should return an IP address

# 2. Check Hostinger subdomain configuration
# In hPanel → Subdomains → Verify admin.dudemw.com exists

# 3. Verify document root is correct
# Should point to same directory as main domain:
# /home/username/domains/dudemw.com/public_html

# 4. Check .htaccess exists and is readable
ls -la /home/username/domains/dudemw.com/public_html/.htaccess

# 5. Restart application
pm2 restart dudemw
```

### Issue: SSL certificate invalid for subdomain

**Symptoms:** Browser shows "Not Secure" or SSL warning

**Solutions:**
```bash
# 1. Check if SSL is installed for subdomain
# In hPanel → SSL → Check admin.dudemw.com

# 2. Reinstall SSL certificate
# In hPanel → SSL → Select admin.dudemw.com → Install SSL

# 3. Wait for SSL activation (5-15 minutes)

# 4. Verify SSL certificate
openssl s_client -connect admin.dudemw.com:443 -servername admin.dudemw.com

# 5. Check for mixed content issues
# Ensure all resources load via HTTPS
```

### Issue: Admin redirects not working

**Symptoms:** `/admin` on main domain doesn't redirect to subdomain

**Solutions:**
```bash
# 1. Check environment variables
cat .env.production | grep ADMIN
# Should show NEXT_PUBLIC_ADMIN_URL=https://admin.dudemw.com

# 2. Verify middleware is active
cat middleware.ts | grep "admin"
# Should show subdomain detection logic

# 3. Check middleware logs
pm2 logs dudemw | grep Middleware
# Should show "[Middleware] Redirecting /admin path to admin subdomain"

# 4. Restart application
pm2 restart dudemw

# 5. Clear browser cache and cookies
```

### Issue: Authentication not working across subdomains

**Symptoms:** Logged out when switching between main domain and subdomain

**Solutions:**
```bash
# 1. Verify cookie domain configuration
cat .env.production | grep COOKIE_DOMAIN
# Should be: NEXT_PUBLIC_COOKIE_DOMAIN=.dudemw.com
# Note the leading dot (.)

# 2. Check browser cookies
# Open DevTools → Application → Cookies
# Should see cookies with domain ".dudemw.com"

# 3. Restart application
pm2 restart dudemw

# 4. Clear all cookies and test again
```

### Issue: Admin pages return 404

**Symptoms:** Admin pages like `/products`, `/orders` return 404

**Solutions:**
```bash
# 1. Check if admin routes exist
ls -la src/app/admin/
# Should show admin directories: products/, orders/, etc.

# 2. Verify middleware rewrite logic
cat middleware.ts | grep "Rewriting admin subdomain"
# Should show path rewriting logic

# 3. Check build output
ls -la .next/server/app/admin/
# Should show compiled admin pages

# 4. Rebuild application
npm run build
pm2 restart dudemw

# 5. Check logs for routing errors
pm2 logs dudemw --err
```

### Issue: Subdomain works locally but not on Hostinger

**Symptoms:** Subdomain works with `localhost` but not in production

**Solutions:**
```bash
# 1. Ensure NODE_ENV is production
echo $NODE_ENV
# Should be: production

# 2. Check if environment variables are loaded
cat .env.production

# 3. Verify Hostinger subdomain configuration
# In hPanel → Subdomains → Check settings

# 4. Check if application is binding to correct port
pm2 logs dudemw | grep "listening"
# Should show: "listening on 0.0.0.0:3000"

# 5. Verify reverse proxy is working
curl http://localhost:3000
# Should return HTML
```

---

## 🔐 Security Considerations

### Cookie Security

✅ **Already Configured:**
- Cookies set with `domain: .dudemw.com` (cross-subdomain)
- HTTPS-only in production
- SameSite policy configured
- Secure flag enabled

### Admin Access Protection

✅ **Already Configured:**
- Admin routes protected by middleware
- Authentication required for admin pages
- Admin profile verification
- Session validation on every request

### Additional Recommendations

1. **Firewall Rules**
   ```bash
   # Hostinger provides default firewall
   # Verify in hPanel → Advanced → Firewall
   ```

2. **Rate Limiting (Optional)**
   - Consider adding rate limiting for `/admin/login`
   - Use Cloudflare for DDoS protection

3. **IP Whitelisting (Optional)**
   - Restrict admin access to specific IPs
   - Configure in Hostinger hPanel or .htaccess

4. **Regular Security Audits**
   ```bash
   # Check for security vulnerabilities
   npm audit
   
   # Update dependencies
   npm update
   ```

---

## 📊 Monitoring & Maintenance

### Monitor Subdomain Health

```bash
# Check if both domains are accessible
curl -I https://dudemw.com
curl -I https://admin.dudemw.com

# Monitor application logs
pm2 logs dudemw --lines 100

# Check SSL certificate expiry
echo | openssl s_client -servername admin.dudemw.com -connect admin.dudemw.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Regular Maintenance

**Weekly:**
- [ ] Check subdomain accessibility
- [ ] Review admin access logs
- [ ] Verify SSL certificates

**Monthly:**
- [ ] Update dependencies
- [ ] Review security settings
- [ ] Check DNS configuration

---

## 🌍 DNS Configuration (For Reference)

If managing DNS externally (not via Hostinger):

### A Records
```
Type  | Host  | Value              | TTL
------|-------|-------------------|------
A     | @     | Your_Server_IP    | 3600
A     | admin | Your_Server_IP    | 3600
CNAME | www   | dudemw.com        | 3600
```

### Cloudflare Configuration (Optional)

If using Cloudflare:
1. Add A record for `admin.dudemw.com`
2. Enable SSL (Full or Full Strict)
3. Enable "Always Use HTTPS"
4. Configure Page Rules if needed

---

## 📝 Environment Variables Summary

Required for subdomain setup:

```env
# Production URLs
NEXT_PUBLIC_APP_URL=https://dudemw.com
NEXT_PUBLIC_ADMIN_URL=https://admin.dudemw.com

# Domain configuration
NEXT_PUBLIC_MAIN_DOMAIN=dudemw.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin

# Cookie sharing (note the leading dot)
NEXT_PUBLIC_COOKIE_DOMAIN=.dudemw.com

# Node environment
NODE_ENV=production
```

---

## ✅ Subdomain Setup Checklist

- [ ] Subdomain created in Hostinger hPanel
- [ ] Subdomain points to same directory as main domain
- [ ] SSL certificate installed for subdomain
- [ ] DNS propagation completed (verify with nslookup)
- [ ] Environment variables configured in `.env.production`
- [ ] Application restarted with new configuration
- [ ] Main store (dudemw.com) accessible
- [ ] Admin subdomain (admin.dudemw.com) accessible
- [ ] Admin setup page (admin.dudemw.com/setup) accessible
- [ ] Direct /admin access redirects to subdomain
- [ ] Authentication works across subdomains
- [ ] SSL certificates valid for both domains
- [ ] All admin pages load correctly
- [ ] Cross-subdomain cookie sharing working

---

## 🎉 Success Indicators

Your subdomain setup is working correctly if:

✅ `https://dudemw.com` shows store homepage  
✅ `https://dudemw.com/admin` redirects to `https://admin.dudemw.com`  
✅ `https://admin.dudemw.com` redirects to login (if not authenticated)  
✅ `https://admin.dudemw.com/setup` shows admin setup page  
✅ `https://admin.dudemw.com/login` shows admin login  
✅ After admin login, can access all admin pages  
✅ Authentication persists across subdomains  
✅ Both domains show valid SSL certificates  

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Logs:**
   ```bash
   pm2 logs dudemw --lines 100
   ```

2. **Verify Configuration:**
   ```bash
   ./verify-deployment.sh https://dudemw.com
   ./verify-deployment.sh https://admin.dudemw.com
   ```

3. **Contact Support:**
   - Hostinger: Live chat in hPanel
   - Documentation: See HOSTINGER_DEPLOY.md

---

**🎊 Congratulations!** Your subdomain is now configured for professional admin access!

- **Store:** https://dudemw.com
- **Admin:** https://admin.dudemw.com
- **Setup:** https://admin.dudemw.com/setup

---

*Last Updated: December 2024*  
*Version: 1.0*  
*Platform: Hostinger Business Plan*
