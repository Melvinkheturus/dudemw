# 🚀 Dude Men's Wears - Production Deployment Guide

This comprehensive guide covers deploying your Next.js e-commerce platform to both **Vercel** (recommended for ease) and **Hostinger** (cost-effective for existing plans).

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Setup](#environment-variables-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Hostinger Deployment](#hostinger-deployment)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure you have:

### Required Services & Credentials

- [ ] **Supabase Account** with project created
  - Database configured with all tables
  - Storage bucket created (`product-images`)
  - API keys ready (URL, Anon Key, Service Role Key)
  
- [ ] **Razorpay Account** (for payments)
  - Test keys for staging
  - Live keys ready for production (when ready to accept payments)
  
- [ ] **Domain Name** (for Hostinger or custom Vercel domain)
  - DNS configured
  - SSL certificate (Hostinger provides free SSL)

### Optional But Recommended

- [ ] **Upstash Redis** account (for caching - improves performance significantly)
- [ ] **Resend** account (for transactional emails)
- [ ] **Google Analytics** ID (for traffic monitoring)

### Code Preparation

- [ ] All code committed to GitHub repository
- [ ] Database migrations run in Supabase
- [ ] Products and initial data added to database
- [ ] Admin account created using setup key

---

## 🔐 Environment Variables Setup

### 1. Create Your Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### 2. Fill in Required Values

Open `.env.local` and fill in all required values:

#### **REQUIRED Variables:**

```env
# Supabase (Get from https://supabase.com/dashboard/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_BUCKET=product-images

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to production URL when deploying

# Admin Setup
ADMIN_SETUP_KEY=your-secret-admin-key-change-this

# Razorpay (Start with test keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_secret
```

#### **OPTIONAL Variables (Recommended):**

```env
# Upstash Redis (For caching - highly recommended)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Resend (For email notifications)
RESEND_API_KEY=re_your_api_key

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🌐 Vercel Deployment

Vercel is the **recommended** deployment platform for Next.js applications. It offers:
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Automatic scaling
- Built-in CI/CD

### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository (`Melvinkheturus/dudemw`)
4. Vercel will auto-detect Next.js framework

### Step 2: Configure Build Settings

Vercel should auto-detect these settings, but verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Step 3: Add Environment Variables

In the Vercel project settings, go to **Settings → Environment Variables**.

Add **ALL** variables from your `.env.local` file. For each variable:

1. Click **"Add New"**
2. Enter **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
3. Enter **Value**
4. Select environments: ✅ Production, ✅ Preview, ✅ Development
5. Click **"Save"**

**CRITICAL Variables for Vercel:**

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
ADMIN_SETUP_KEY
NEXT_PUBLIC_APP_URL  (Set to: https://your-project.vercel.app)
```

**Optional but Recommended:**

```
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_SUPPORT_EMAIL
```

⚠️ **IMPORTANT**: For Upstash Redis, do NOT include quotes in Vercel:
- ✅ Correct: `https://your-redis.upstash.io`
- ❌ Wrong: `"https://your-redis.upstash.io"`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at `https://your-project.vercel.app`

### Step 5: Configure Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `dudemw.com`)
3. Update DNS records as instructed by Vercel:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-30 minutes)
5. Vercel will automatically provision SSL certificate

### Step 6: Update Environment Variables

After domain is active, update in Vercel Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Then trigger a new deployment:
- Go to **Deployments**
- Click **"Redeploy"** on latest deployment

---

## 🏢 Hostinger Deployment

Hostinger Business Plan with Node.js support allows you to host Next.js applications. This is more cost-effective if you already have a Hostinger plan.

### Prerequisites

- Hostinger Business Plan or higher
- Node.js 18.x or higher enabled in Hpanel
- SSH access enabled
- Domain configured with SSL certificate

### Step 1: Prepare Your Application

On your local machine:

```bash
# 1. Ensure all dependencies are installed
npm install

# 2. Create production build
npm run build

# 3. Test production build locally
npm start

# 4. If successful, proceed to deployment
```

### Step 2: Set Up Hostinger Environment

#### A. Enable Node.js in Hpanel

1. Log in to [Hostinger Hpanel](https://hpanel.hostinger.com)
2. Go to **Advanced → Node.js**
3. Click **"Create Application"**
4. Configure:
   ```
   Application Mode: Production
   Application Root: /home/username/domains/yourdomain.com/public_html
   Application Startup File: node_modules/next/dist/bin/next
   Node.js Version: 18.x or higher
   ```
5. Click **"Create"**

#### B. Access via SSH

Open terminal and connect to your Hostinger server:

```bash
ssh username@yourdomain.com -p 65002
```

(Port may vary - check Hpanel → Advanced → SSH Access)

### Step 3: Upload Application Files

#### Option A: Using Git (Recommended)

```bash
# Navigate to your domain directory
cd ~/domains/yourdomain.com/public_html

# Clone your repository
git clone https://github.com/Melvinkheturus/dudemw.git .

# If repository is private, use SSH or provide credentials
```

#### Option B: Using FileZilla/SFTP

1. Connect using SFTP credentials from Hpanel
2. Upload all project files to: `/home/username/domains/yourdomain.com/public_html/`
3. Ensure all files are uploaded including:
   - `package.json`
   - `next.config.ts`
   - `.next/` folder (after build)
   - `public/` folder
   - All source files

### Step 4: Configure Environment Variables

On your Hostinger server (via SSH):

```bash
# Create .env.production file
nano .env.production
```

Paste all your environment variables:

```env
# IMPORTANT: Update APP_URL to your actual domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_BUCKET=product-images

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret

# Admin Setup Key
ADMIN_SETUP_KEY=your-secret-key

# Optional: Redis, Resend, etc.
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
RESEND_API_KEY=re_your_key

# Contact Info
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
NEXT_PUBLIC_SUPPORT_EMAIL=support@dudemw.com
```

Save and exit: `CTRL+X`, then `Y`, then `ENTER`

### Step 5: Install Dependencies and Build

```bash
# Install Node.js dependencies
npm install --production

# Build the application
npm run build

# Verify build was successful
ls -la .next/
```

### Step 6: Set Up PM2 Process Manager

PM2 ensures your application stays running and automatically restarts if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Create logs directory
mkdir -p logs

# Start application with PM2 using ecosystem config
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
# Follow the command it provides (may require sudo)

# Check application status
pm2 status
pm2 logs dudemw
```

### Step 7: Configure Reverse Proxy (If needed)

If your Hostinger setup requires reverse proxy configuration:

Create `.htaccess` in your public_html directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Exclude static files
  RewriteCond %{REQUEST_URI} !^/public/
  RewriteCond %{REQUEST_URI} !^/_next/
  RewriteCond %{REQUEST_URI} !\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$
  
  # Proxy to Node.js application
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>

# Enable CORS if needed
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
```

### Step 8: Configure SSL Certificate

1. In Hpanel, go to **Advanced → SSL**
2. Select your domain
3. Click **"Install SSL"** (Hostinger provides free SSL)
4. Wait for activation (5-15 minutes)
5. Verify HTTPS works: `https://yourdomain.com`

### Step 9: Verify Deployment

```bash
# Check if application is running
pm2 status

# View logs
pm2 logs dudemw --lines 100

# Test API endpoint
curl https://yourdomain.com/api/test-connection

# Should return: {"success":true}
```

### Step 10: Set Up Automatic Updates (Optional)

Create a deployment script: `deploy.sh`

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Restart PM2
pm2 restart dudemw

echo "✅ Deployment completed!"
pm2 status
```

Make it executable:

```bash
chmod +x deploy.sh
```

To deploy updates in the future:

```bash
./deploy.sh
```

---

## ⚙️ Post-Deployment Configuration

After successful deployment (Vercel or Hostinger), complete these steps:

### 1. Update Supabase Settings

In your Supabase project dashboard:

1. Go to **Authentication → URL Configuration**
2. Add your production URL to **Site URL**: `https://yourdomain.com`
3. Add redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/admin/callback
   ```

### 2. Configure Razorpay Webhooks

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings → Webhooks**
3. Click **"Add New Webhook"**
4. Configure:
   ```
   Webhook URL: https://yourdomain.com/api/webhook/razorpay
   Secret: (Generate and save this)
   Events: 
     ✅ payment.authorized
     ✅ payment.captured
     ✅ payment.failed
     ✅ order.paid
   ```
5. Save webhook secret to environment variables:
   ```
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

### 3. Create Admin Account

1. Visit: `https://yourdomain.com/admin/setup`
2. Use your `ADMIN_SETUP_KEY` from environment variables
3. Create super admin account
4. Login at: `https://yourdomain.com/admin/login`

### 4. Configure Store Settings

In Admin Dashboard:

1. **Store Settings** (`/admin/settings/store`)
   - Store name, description
   - Contact information
   - Social media links

2. **Payment Settings** (`/admin/settings/payments`)
   - Verify Razorpay keys
   - Enable/disable COD

3. **Shipping Settings** (`/admin/settings/shipping`)
   - Configure shipping zones
   - Set shipping rates

4. **Tax Settings** (`/admin/settings/tax`)
   - Configure tax rates by location

### 5. Add Products & Collections

1. Create categories
2. Create collections
3. Add products with images
4. Create banners for homepage

---

## 🧪 Testing & Verification

### Critical Tests After Deployment

#### 1. Homepage & Navigation

- [ ] Homepage loads correctly
- [ ] All images display properly
- [ ] Navigation menu works
- [ ] Search functionality works

#### 2. Authentication

- [ ] User signup works
- [ ] Email verification works (if enabled)
- [ ] Login works
- [ ] Password reset works
- [ ] Admin login works

#### 3. Product Browsing

- [ ] Products page loads
- [ ] Product filtering works
- [ ] Product detail pages load
- [ ] Product images display correctly

#### 4. Shopping Cart

- [ ] Add to cart works
- [ ] Update quantities works
- [ ] Remove items works
- [ ] Cart persists across pages

#### 5. Checkout Process

- [ ] Checkout page loads
- [ ] Address form validation works
- [ ] Razorpay payment modal opens
- [ ] Test payment completes successfully
- [ ] Order confirmation page shows

#### 6. Admin Dashboard

- [ ] Admin login works
- [ ] Dashboard loads with correct data
- [ ] Product management works (add/edit/delete)
- [ ] Order management works
- [ ] Image upload works

#### 7. API Endpoints

Test critical endpoints:

```bash
# Test database connection
curl https://yourdomain.com/api/test-connection

# Expected: {"success":true}

# Test product API
curl https://yourdomain.com/api/products

# Should return product list
```

#### 8. Performance

- [ ] Lighthouse score > 90 for performance
- [ ] Page load time < 3 seconds
- [ ] Images load fast (WebP format)
- [ ] Redis caching working (check logs)

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue: "Missing Environment Variable" Error

**Solution:**
1. Verify all required env vars are added
2. Check for typos in variable names
3. Restart application after adding new variables

**Vercel:**
```
Settings → Environment Variables → Add missing variable → Redeploy
```

**Hostinger:**
```bash
nano .env.production  # Add missing variable
pm2 restart dudemw
```

#### Issue: Database Connection Failed

**Symptoms:** API returns 500 errors, products don't load

**Solution:**
1. Verify Supabase credentials:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
2. Check Supabase project is active
3. Verify your IP isn't blocked in Supabase

#### Issue: Images Not Displaying

**Symptoms:** Broken image icons, 404 errors

**Solution:**
1. Check Supabase Storage bucket exists: `product-images`
2. Verify bucket is public:
   - Supabase Dashboard → Storage → product-images → Settings
   - Enable "Public bucket"
3. Check image URLs in `next.config.ts`:
   ```typescript
   remotePatterns: [
     {
       protocol: 'https',
       hostname: '**.supabase.co',
     },
   ]
   ```

#### Issue: Razorpay Payment Not Working

**Symptoms:** Payment modal doesn't open, or payment fails

**Solution:**
1. Verify Razorpay keys are correct (test vs live)
2. Check key format:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx (starts with rzp_)
   RAZORPAY_KEY_SECRET=xxxxx (secret key)
   ```
3. Ensure domain is added to Razorpay allowed domains
4. Check browser console for errors

#### Issue: Build Fails on Vercel

**Symptoms:** Build error, TypeScript errors

**Solution:**
1. Check build logs for specific error
2. Run `npm run build` locally to reproduce
3. Common fixes:
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```
4. If TypeScript errors, temporarily set in `next.config.ts`:
   ```typescript
   typescript: {
     ignoreBuildErrors: true, // Only if absolutely necessary
   }
   ```

#### Issue: Hostinger Application Won't Start

**Symptoms:** Site shows error, PM2 shows "errored" status

**Solution:**
```bash
# Check PM2 logs for errors
pm2 logs dudemw --lines 50

# Common fixes:

# 1. Rebuild application
npm run build

# 2. Restart PM2
pm2 restart dudemw

# 3. Check Node.js version
node -v  # Should be 18.x or higher

# 4. Verify port is available
netstat -tuln | grep 3000

# 5. Check environment variables
pm2 env dudemw
```

#### Issue: Redis Connection Errors

**Symptoms:** Warnings in logs about Redis connection

**Solution:**
Redis is optional - the app will work without it, just slower.

To fix:
1. Verify Upstash credentials
2. Remove quotes from URLs in env vars
3. Check Upstash dashboard for connection limits
4. If not using Redis, can ignore warnings

#### Issue: Email Notifications Not Sending

**Symptoms:** No order confirmation emails

**Solution:**
1. Verify `RESEND_API_KEY` is set
2. Check Resend dashboard for errors
3. Verify sender email is verified in Resend
4. Email is optional - app works without it

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks

#### Weekly

- [ ] Check application logs for errors
- [ ] Monitor Supabase database size
- [ ] Review order processing

#### Monthly

- [ ] Update dependencies:
  ```bash
  npm outdated
  npm update
  ```
- [ ] Clear old logs
- [ ] Backup database (Supabase auto-backups)
- [ ] Review Redis cache usage (if using Upstash)

#### Quarterly

- [ ] Review and optimize slow queries
- [ ] Update Node.js version if needed
- [ ] Security audit: `npm audit`
- [ ] Performance testing

### Deploying Updates

#### For Vercel

Automatic deployment when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel automatically builds and deploys.

#### For Hostinger

Using the deployment script:

```bash
ssh username@yourdomain.com -p 65002
cd ~/domains/yourdomain.com/public_html
./deploy.sh
```

Or manually:

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install --production

# Rebuild
npm run build

# Restart
pm2 restart dudemw

# Verify
pm2 status
```

### Database Migrations

When updating database schema:

1. Create migration SQL in Supabase:
   - Dashboard → SQL Editor
   - Run migration script
   - Test in staging first

2. Update TypeScript types:
   ```bash
   npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
   ```

3. Deploy code updates

### Rollback Procedure

#### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click **"Promote to Production"**

#### Hostinger Rollback

```bash
# Using Git
git log --oneline  # Find commit hash of working version
git reset --hard <commit-hash>
npm install --production
npm run build
pm2 restart dudemw
```

---

## 📊 Monitoring & Analytics

### Application Monitoring

#### Vercel Analytics

- Built-in analytics available in Vercel dashboard
- Real-time performance metrics
- Error tracking

#### Custom Monitoring

Add to your application:

1. **Google Analytics** (if configured)
   - Traffic monitoring
   - User behavior
   - Conversion tracking

2. **Application Logs**

**Vercel:**
```
Dashboard → Project → Logs (realtime)
```

**Hostinger:**
```bash
# View PM2 logs
pm2 logs dudemw

# View specific log files
tail -f ~/logs/pm2-error.log
tail -f ~/logs/pm2-out.log
```

### Performance Monitoring

Use Lighthouse for regular audits:

```bash
# Install lighthouse globally
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## 🆘 Support & Resources

### Official Documentation

- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **Razorpay:** https://razorpay.com/docs
- **Hostinger:** https://support.hostinger.com

### Common Commands Reference

#### Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from local
vercel --prod

# View logs
vercel logs

# View environment variables
vercel env ls
```

#### PM2 Commands (Hostinger)

```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop dudemw

# Restart application
pm2 restart dudemw

# Delete application
pm2 delete dudemw

# View logs
pm2 logs dudemw

# View real-time logs
pm2 logs dudemw --lines 100 --raw

# Monitor resources
pm2 monit

# Save configuration
pm2 save

# Startup script
pm2 startup
```

---

## ✅ Final Checklist

Before going fully live with real payments:

- [ ] All test cases pass
- [ ] SSL certificate active and valid
- [ ] All environment variables set correctly
- [ ] Database backed up
- [ ] Admin account secured with strong password
- [ ] Payment gateway switched to LIVE keys
- [ ] Webhook configured and tested
- [ ] Email notifications working
- [ ] Customer support channels set up (WhatsApp, Email)
- [ ] Terms of Service and Privacy Policy added
- [ ] Shipping and Return policies configured
- [ ] Google Analytics tracking (if used)
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Mobile responsive verified
- [ ] All pages tested on multiple browsers

---

## 🎉 Congratulations!

Your Dude Men's Wears e-commerce platform is now live in production!

### What's Next?

1. **Marketing:** Start driving traffic to your store
2. **SEO:** Optimize product descriptions and meta tags
3. **Social Media:** Share products on Instagram (@dude_mensclothing)
4. **Customer Feedback:** Collect and act on customer feedback
5. **Analytics:** Monitor what's working and optimize

### Need Help?

- Check logs for errors
- Review this guide's troubleshooting section
- Contact your development team
- Reach out to service providers (Vercel, Hostinger, Supabase)

**Happy Selling! 🛍️**
