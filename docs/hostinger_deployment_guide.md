# Admin Subdomain Deployment Guide - Hostinger

This guide walks you through deploying the admin panel on a subdomain (e.g., `admin.yourdomain.com`) on Hostinger.

## Prerequisites

- Access to Hostinger hPanel
- Your domain name configured in Hostinger
- Admin access to your domain's DNS settings

---

## Step 1: Create the Subdomain in Hostinger

1. **Log in to Hostinger hPanel**
2. **Navigate to Domains**:
   - Click on "Domains" in the left sidebar
   - Select your domain
3. **Create Subdomain**:
   - Go to "Subdomains" section
   - Click "Create Subdomain"
   - Enter: `admin`
   - Make sure it points to the **same directory** as your main domain
   - Click "Create"

> [!IMPORTANT]
> The subdomain must point to the **same directory** as your main domain, not a separate folder. The Next.js middleware will handle the routing internally.

---

## Step 2: Configure DNS Settings

### Option A: If DNS is managed by Hostinger
The subdomain should be automatically configured. Verify:
1. Go to "DNS / Name Servers"
2. Check for a CNAME or A record for `admin`
3. It should point to your main domain or hosting IP

### Option B: If DNS is managed elsewhere (e.g., Cloudflare, GoDaddy)
Add a CNAME record:

```
Type: CNAME
Name: admin
Target: yourdomain.com (or your Hostinger hosting target)
TTL: 3600 (or Auto)
```

> [!NOTE]
> DNS propagation can take 5-60 minutes. Use [https://dnschecker.org](https://dnschecker.org) to verify propagation.

---

## Step 3: Configure Environment Variables

### 3.1 Update Your Local [.env](file:///d:/my%20dude%20ecommerse%20site/dudemw/.env) File

Add these variables to your [.env](file:///d:/my%20dude%20ecommerse%20site/dudemw/.env) file:

```env
# Admin Subdomain Configuration
NEXT_PUBLIC_COOKIE_DOMAIN=.yourdomain.com
NEXT_PUBLIC_ADMIN_SUBDOMAIN=admin
NEXT_PUBLIC_MAIN_DOMAIN=yourdomain.com
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
```

**Replace `yourdomain.com` with your actual domain.**

### 3.2 Add Environment Variables in Hostinger

1. Go to your website in hPanel
2. Navigate to "Advanced" → "Environment Variables" (or similar)
3. Add each of the following variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `NEXT_PUBLIC_COOKIE_DOMAIN` | `.yourdomain.com` | `.dudemw.com` |
| `NEXT_PUBLIC_ADMIN_SUBDOMAIN` | `admin` | `admin` |
| `NEXT_PUBLIC_MAIN_DOMAIN` | `yourdomain.com` | `dudemw.com` |
| `NEXT_PUBLIC_ADMIN_URL` | `https://admin.yourdomain.com` | `https://admin.dudemw.com` |

> [!WARNING]
> The `NEXT_PUBLIC_COOKIE_DOMAIN` must start with a dot (`.`) to enable cookie sharing across subdomains.

---

## Step 4: Update Supabase Authentication Settings

1. **Go to Supabase Dashboard**:
   - Navigate to your project
   - Go to "Authentication" → "URL Configuration"

2. **Add Admin Subdomain to Redirect URLs**:
   - Add: `https://admin.yourdomain.com/**`
   - Add: `https://admin.yourdomain.com/login`
   - Add: `https://admin.yourdomain.com/setup`

3. **Update Site URL** (if needed):
   - You can keep your main domain as the Site URL
   - Or set it to the admin subdomain if that's your primary admin interface

---

## Step 5: Configure SSL Certificate

1. **In Hostinger hPanel**:
   - Go to "SSL/TLS"
   - Check if SSL is enabled for your domain
   - Hostinger usually auto-generates SSL for subdomains
   
2. **Verify SSL Coverage**:
   - The SSL certificate should cover both:
     - `yourdomain.com`
     - `admin.yourdomain.com`
   - If using Let's Encrypt, this is automatic

> [!TIP]
> If SSL isn't automatically applied, you may need to force regenerate the certificate or contact Hostinger support.

---

## Step 6: Deploy the Updated Code

### Option A: Using Git (Recommended)

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Configure admin subdomain routing"
   git push
   ```

2. **In Hostinger**:
   - If you have auto-deployment enabled, it will deploy automatically
   - Otherwise, manually pull the latest code

### Option B: Manual Upload

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Upload the following to your Hostinger directory via FTP/File Manager:
   - `.next/` folder
   - [package.json](file:///d:/my%20dude%20ecommerse%20site/dudemw/package.json)
   - [next.config.js](file:///d:/my%20dude%20ecommerse%20site/dudemw/next.config.js)
   - [middleware.ts](file:///d:/my%20dude%20ecommerse%20site/dudemw/middleware.ts)
   - [.hostingerrc](file:///d:/my%20dude%20ecommerse%20site/dudemw/.hostingerrc)

3. Restart your Node.js application in hPanel

---

## Step 7: Verification & Testing

### 7.1 Test Admin Subdomain Access

1. **Navigate to** `https://admin.yourdomain.com`
   - Should redirect to `https://admin.yourdomain.com/login`
   
2. **Log in with admin credentials**
   - Should successfully authenticate
   - Should redirect to `https://admin.yourdomain.com` (dashboard)

3. **Test navigation**:
   - Click through different admin sections
   - URLs should show as `admin.yourdomain.com/products`, `admin.yourdomain.com/orders`, etc.

### 7.2 Test Main Domain Blocking

1. **Try accessing** `https://yourdomain.com/admin`
   - Should redirect to `https://yourdomain.com/` (home page)
   
2. **Try accessing** `https://yourdomain.com/admin/products`
   - Should also redirect to home

### 7.3 Test Cross-Subdomain Authentication

1. Log in at `admin.yourdomain.com`
2. Open a new tab and go to `yourdomain.com`
3. Click on your profile (if store auth is separate, this tests cookie sharing)

---

## Step 8: Monitor and Debug

### Check Browser Console

Open Developer Tools (F12) and check for:
- Any CORS errors
- Cookie warnings
- Network errors (401, 403, 500)

### Check Server Logs

In Hostinger hPanel:
1. Go to your application
2. Check "Error Logs" and "Access Logs"
3. Look for middleware logging:
   - `[Middleware] Admin subdomain detected`
   - `[Middleware] Rewriting admin subdomain path`

### Common Issues

| Issue | Solution |
|-------|----------|
| "Too many redirects" | Clear cookies and cache. Check middleware logic. |
| 404 on admin subdomain | Verify DNS propagation. Check subdomain points to correct directory. |
| Authentication not working | Verify `NEXT_PUBLIC_COOKIE_DOMAIN` starts with dot. Check Supabase redirect URLs. |
| SSL warning | Wait for SSL to propagate. Force regenerate certificate in hPanel. |

---

## Rollback Plan

If you need to rollback to path-based routing (`/admin`):

1. **Comment out the subdomain detection** in [middleware.ts](file:///d:/my%20dude%20ecommerse%20site/dudemw/middleware.ts):
   ```typescript
   // const isAdminSubdomain = hostname.startsWith('admin.')
   const isAdminSubdomain = false // Force disable subdomain routing
   ```

2. **Redeploy**

3. **Remove the subdomain** from Hostinger (optional)

---

## Next Steps After Deployment

- [ ] Update any external links pointing to admin panel
- [ ] Inform admin users of the new URL
- [ ] Update documentation and bookmarks
- [ ] Consider adding redirect from old `/admin` path to new subdomain (optional)
- [ ] Set up monitoring/alerts for admin subdomain uptime

---

## Additional Resources

- [Hostinger DNS Management](https://www.hostinger.com/tutorials/dns)
- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Hostinger server logs
3. Check browser console for errors
4. Verify all environment variables are set correctly
5. Contact Hostinger support for subdomain/SSL issues
