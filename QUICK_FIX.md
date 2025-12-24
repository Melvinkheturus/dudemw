# 🚀 QUICK FIX - Execute This Now!

## Problem
JavaScript files on dudemw.com are served with wrong MIME type (`text/plain` instead of `application/javascript`), causing the site to break.

## ⚡ FASTEST FIX (5 minutes)

### If you have SSH access:

```bash
# 1. Connect to your server
ssh your-username@dudemw.com -p 65002

# 2. Go to your project directory
cd domains/dudemw.com/public_html

# 3. Pull latest fixes
git pull origin main

# 4. Run the automated fix script
chmod +x scripts/hostinger-fix-deployment.sh
./scripts/hostinger-fix-deployment.sh

# 5. Verify
pm2 status
```

**Done! Your site should now work.**

---

## 🔧 Manual Fix (If script doesn't work)

### Step 1: Update files locally

Push these changes to your GitHub:
```bash
git add .
git commit -m "Fix: Add standalone output and MIME type configuration"
git push origin main
```

### Step 2: SSH into Hostinger

```bash
ssh your-username@dudemw.com -p 65002
cd domains/dudemw.com/public_html
```

### Step 3: Rebuild

```bash
# Pull changes
git pull origin main

# Clean and rebuild
rm -rf .next
npm install
npm run build

# Restart
pm2 restart dudemw
pm2 logs dudemw
```

### Step 4: Verify

Visit https://dudemw.com - Should work now!

---

## 🧪 Quick Test

Run this to check if MIME types are fixed:

```bash
curl -I https://dudemw.com/_next/static/chunks/webpack-c5dd44c751fe34d6.js
```

✅ **Success:** Shows `Content-Type: application/javascript`  
❌ **Problem:** Shows `Content-Type: text/plain`

---

## 📞 Emergency Checklist

If site still doesn't work:

1. ✅ Is PM2 running? `pm2 status` → should show "online"
2. ✅ Is .htaccess in place? `ls -la .htaccess` → should exist
3. ✅ Are env vars set? `pm2 env dudemw` → check NEXT_PUBLIC_*
4. ✅ Is build successful? `ls -la .next/` → should have files
5. ✅ Clear cache: Hostinger hPanel → Speed → Clear All Caches
6. ✅ Hard reload browser: Ctrl+Shift+R

---

## 📋 Key Files Changed

1. **next.config.js** - Added `output: 'standalone'`
2. **.htaccess** - Fixed MIME types for JavaScript files
3. **scripts/hostinger-fix-deployment.sh** - Automated deployment script

---

## ✅ Success = Site loads without MIME type errors!

Need help? Check: **HOSTINGER_MIME_FIX.md** for detailed troubleshooting.
