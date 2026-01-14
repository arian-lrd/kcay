# Fix: Backend Missing Dependencies

## Problem
Backend is crashing with: `Error: Cannot find module 'methods'`

This happens because dependencies weren't installed correctly or in the wrong location.

## Solution

**On your server, run these commands:**

```bash
# 1. Stop PM2 to prevent crash loop
pm2 stop all
pm2 delete all

# 2. Go to root directory
cd /var/www/kcay

# 3. Remove any incorrect node_modules
rm -rf node_modules package-lock.json

# 4. Install ALL dependencies (including dev dependencies for now)
npm install

# 5. Verify methods module exists
ls node_modules/methods

# 6. Test backend manually first
cd /var/www/kcay
node backend/server.js
# Press Ctrl+C after you see "Server running on port 3000"

# 7. If that works, restart with PM2
cd /var/www/kcay
pm2 start ecosystem.config.js

# 8. Check status
pm2 status
pm2 logs kcay-backend --lines 20
```

## Why This Happened

When you ran `npm install --production` in the `backend/` directory, it tried to install dependencies there, but your `package.json` is in the root (`/var/www/kcay/`). The backend needs dependencies from the root `node_modules` folder.

## Alternative: If You Want Separate node_modules

If you prefer to keep dependencies separate, you'd need to:
1. Move `package.json` to `backend/` directory
2. Install dependencies there
3. Update PM2 config to use correct working directory

But the current setup (root package.json) is simpler and works fine once dependencies are installed correctly.

