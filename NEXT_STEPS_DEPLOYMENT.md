# Next Steps: Configure Nginx and Start Your Apps

✅ **Completed:**
- Database connection working
- Code deployed
- Dependencies installed
- Frontend built successfully
- Environment variables configured

⏭️ **Next Steps:**

---

## Step 1: Configure Nginx (Reverse Proxy)

Since you already have nginx configured for Apache, we'll add a **new nginx configuration** for your Node.js app without touching your existing Apache setup.

### Check Your Current Nginx Configuration

**On your server:**

```bash
# List existing nginx sites
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Check if nginx is running
sudo systemctl status nginx
```

### Create New Nginx Configuration for Your App

**On your server:**

```bash
# Create new config file
sudo nano /etc/nginx/sites-available/kcay
# or
sudo vi /etc/nginx/sites-available/kcay
```

**Add this configuration (adjust domain name as needed):**

```nginx
# HTTP server - redirect to HTTPS (optional, or remove if not using SSL yet)
server {
    listen 80;
    server_name kcay.ca www.kcay.ca;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server - your Node.js app
server {
    listen 443 ssl http2;
    server_name kcay.ca www.kcay.ca;

    # SSL Certificate (if you have one - comment out if not using SSL yet)
    # ssl_certificate /etc/letsencrypt/live/kcay.ca/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/kcay.ca/privkey.pem;
    
    # For now, if you don't have SSL, comment out the SSL lines above
    # OR use HTTP only (change listen 443 to listen 80 and remove SSL lines)

    # Logging
    access_log /var/log/nginx/kcay-access.log;
    error_log /var/log/nginx/kcay-error.log;

    # Client body size limit (for file uploads)
    client_max_body_size 20M;

    # Frontend (Next.js) - Main site
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files from backend (images, PDFs, etc.)
    location /assets {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_cache_valid 200 1d;
    }
}
```

**Important Notes:**
- Replace `kcay.ca` with your actual domain
- If you don't have SSL yet, use port 80 (HTTP) instead of 443 (HTTPS)
- This config doesn't interfere with your existing Apache setup

**Save and exit** (Ctrl+X, Y, Enter in nano)

### Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kcay /etc/nginx/sites-enabled/

# Test nginx configuration (IMPORTANT - do this first!)
sudo nginx -t
```

**If test passes**, reload nginx:

```bash
sudo systemctl reload nginx
```

**If test fails**, check the error message and fix the config file.

---

## Step 2: Create PM2 Ecosystem Configuration

**On your server:**

```bash
cd /var/www/kcay
nano ecosystem.config.js
# or
vi ecosystem.config.js
```

**Add this configuration:**

```javascript
module.exports = {
  apps: [
    {
      name: 'kcay-backend',
      script: './backend/server.js',
      cwd: '/var/www/kcay',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'kcay-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/kcay/frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

**Save and exit**

**Create logs directory:**

```bash
mkdir -p /var/www/kcay/logs
```

---

## Step 3: Start Your Applications with PM2

**On your server:**

```bash
cd /var/www/kcay

# Start both apps
pm2 start ecosystem.config.js

# Save PM2 configuration (so apps restart on reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions it outputs (usually run a command)
```

**Check status:**

```bash
# View status
pm2 status

# View logs
pm2 logs

# View specific app logs
pm2 logs kcay-backend
pm2 logs kcay-frontend
```

---

## Step 4: Test Everything

### Test Backend API

```bash
# On your server
curl http://localhost:3000/api/v1/about
# Should return JSON data
```

### Test Frontend

```bash
# On your server
curl http://localhost:3001
# Should return HTML
```

### Test Through Nginx

```bash
# On your server (if nginx is configured)
curl http://kcay.ca/api/v1/about
# Or if using HTTPS:
curl https://kcay.ca/api/v1/about
```

### Test in Browser

Visit:
- `http://kcay.ca` (or your domain)
- `http://kcay.ca/api/v1/about` (should show JSON)

---

## Quick Checklist

- [ ] Nginx configuration created
- [ ] Nginx configuration tested (`sudo nginx -t`)
- [ ] Nginx reloaded
- [ ] PM2 ecosystem.config.js created
- [ ] Logs directory created
- [ ] Applications started with PM2
- [ ] PM2 save and startup configured
- [ ] Backend API tested (localhost:3000)
- [ ] Frontend tested (localhost:3001)
- [ ] Nginx reverse proxy tested (domain)

---

## Common Issues

### PM2 Apps Not Starting

```bash
# Check logs
pm2 logs kcay-backend
pm2 logs kcay-frontend

# Restart apps
pm2 restart all

# Check if ports are in use
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001
```

### Nginx Not Working

```bash
# Check nginx config
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/kcay-error.log

# Check nginx status
sudo systemctl status nginx
```

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process if needed (be careful!)
# sudo kill -9 <PID>
```

---

## Next Steps After Everything Works

1. ✅ **Set up SSL certificates** (Let's Encrypt)
2. ✅ **Set up automated backups**
3. ✅ **Monitor your applications**
4. ✅ **Update DNS** if needed

