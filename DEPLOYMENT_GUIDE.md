# Complete Deployment Guide

This guide covers deploying your KCAY application to a server that already has nginx reverse proxying to Apache for other websites.

---

## Current Server Setup

- ✅ Database set up
- ✅ Node.js 20 installed
- ✅ npm installed
- ✅ PM2 installed
- ✅ Nginx configured for Apache (existing sites)
- ⏭️ Need to add Node.js apps
- ⏭️ Need to deploy code

---

## Step 1: Deploy Your Code to the Server

### Option A: Using Git (Recommended)

If your code is in a Git repository:

```bash
# On your server, navigate to where you want the app
cd /var/www  # or wherever you keep your websites
# or
cd /home/your-user/apps

# Clone your repository
git clone https://github.com/your-username/kcay.git
# or
git clone git@github.com:your-username/kcay.git

# Enter the directory
cd kcay
```

### Option B: Using SCP (Secure Copy)

If your code is only on your local Mac:

```bash
# On your local Mac, compress the project
cd /Users/ARIAN/Documents/Personal/Kurdish/coding
tar -czf kcay-deploy.tar.gz kcay/ --exclude='node_modules' --exclude='.next' --exclude='.git'

# Upload to server
scp kcay-deploy.tar.gz user@your-server-ip:/var/www/

# On your server, extract it
cd /var/www
tar -xzf kcay-deploy.tar.gz
cd kcay
rm kcay-deploy.tar.gz
```

### Option C: Using SFTP

1. Use FileZilla, Cyberduck, or Terminal SFTP
2. Upload your project folder (excluding `node_modules`, `.next`, `.git`)
3. Extract/upload on the server

---

## Step 2: Install Dependencies on Server

On your server, install npm packages:

```bash
# Navigate to your project directory
cd /path/to/kcay

# Install backend dependencies
cd backend
npm install --production  # Use --production for server (no dev dependencies)

# Install frontend dependencies
cd ../frontend
npm install --production

# Build the frontend for production
npm run build
```

---

## Step 3: Set Up Environment Variables

### Backend Environment Variables

```bash
# On your server
cd /path/to/kcay/backend

# Create/edit .env file
nano .env
# or
vi .env
```

Add your production environment variables:

```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=production

# Cloudinary (if you're using it)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
USE_CLOUDINARY=true
USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true

# Brevo/Newsletter (if you're using it)
BREVO_API_KEY=your_brevo_api_key
BREVO_LIST_ID=your_brevo_list_id
```

### Frontend Environment Variables

```bash
# On your server
cd /path/to/kcay/frontend

# Create/edit .env.local file
nano .env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://your-domain.com/api/v1
# OR if backend is on a different domain/port:
# NEXT_PUBLIC_API_URL=https://api.your-domain.com/api/v1
```

### Secure the Files

```bash
# Make sure .env files are secure
chmod 600 /path/to/kcay/backend/.env
chmod 600 /path/to/kcay/frontend/.env.local
```

---

## Step 4: Configure Nginx (Without Breaking Apache)

Since you already have nginx → Apache for other sites, we'll add a **new server block** for your Node.js app.

### Check Your Current Nginx Configuration

```bash
# List existing nginx sites
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Check your current nginx config
sudo nginx -t

# View your main nginx config (if you have one)
cat /etc/nginx/nginx.conf
```

### Option A: New Domain/Subdomain (Recommended)

If you have a new domain or subdomain for this app:

**Create a new nginx configuration file:**

```bash
sudo nano /etc/nginx/sites-available/kcay
```

**Add this configuration:**

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server - your Node.js app
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificate (if you have one - use Let's Encrypt)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # For now, comment out SSL if you don't have certificates yet
    # You can add SSL later with Let's Encrypt

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

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kcay /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### Option B: Path-Based (Same Domain as Apache)

If you want to use the same domain but different paths:

**Edit your existing nginx config** (carefully!):

```bash
# First, BACKUP your existing config
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Edit your existing nginx config
sudo nano /etc/nginx/sites-available/default
# or wherever your Apache config is
```

**Add these locations to your existing server block:**

```nginx
# Inside your existing server block (for Apache sites)

# Your existing Apache locations...
location / {
    proxy_pass http://localhost:8080;  # Apache
    # ... your existing Apache config ...
}

# ADD THESE for your Node.js app:
# Frontend (Next.js) - on a specific path
location /app {
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

# Backend API
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Static files
location /assets {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
}
```

**Test and reload:**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 5: Create PM2 Configuration

Create a PM2 ecosystem file to manage your apps:

```bash
# On your server, in your project root
cd /path/to/kcay
nano ecosystem.config.js
```

**Add this configuration:**

```javascript
module.exports = {
  apps: [
    {
      name: 'kcay-backend',
      script: './backend/server.js',
      cwd: '/path/to/kcay',
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
      cwd: '/path/to/kcay/frontend',
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

**Important:** Replace `/path/to/kcay` with your actual project path (e.g., `/var/www/kcay`).

**Create logs directory:**

```bash
mkdir -p /path/to/kcay/logs
```

---

## Step 6: Start Your Applications with PM2

```bash
# Navigate to your project
cd /path/to/kcay

# Start both apps with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration (so apps restart on server reboot)
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the instructions it gives you (usually run a command it outputs)

# Check status
pm2 status

# View logs
pm2 logs kcay-backend
pm2 logs kcay-frontend

# View all logs
pm2 logs
```

---

## Step 7: Test Everything

### Test Backend API

```bash
# On your server
curl http://localhost:3000/api/v1/about
# Should return JSON data

# Or test from your local machine
curl http://your-server-ip:3000/api/v1/about
```

### Test Frontend

```bash
# On your server
curl http://localhost:3001
# Should return HTML

# Or visit in browser
http://your-domain.com
# or
http://your-server-ip:3001
```

### Test Through Nginx

```bash
# Test API through nginx
curl http://your-domain.com/api/v1/about

# Visit frontend through nginx
http://your-domain.com
```

---

## Step 8: Set Up SSL (HTTPS) - Optional but Recommended

Use Let's Encrypt for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts
# Certbot will automatically update your nginx config

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Troubleshooting

### PM2 Apps Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check specific app
pm2 logs kcay-backend
pm2 logs kcay-frontend

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

### Database Connection Issues

```bash
# Test database connection
mysql -u your_db_user -p your_database_name

# Check backend logs
pm2 logs kcay-backend

# Verify .env file has correct credentials
cat /path/to/kcay/backend/.env
```

### Port Conflicts

```bash
# Check what's using ports 3000 and 3001
sudo lsof -i :3000
sudo lsof -i :3001

# Kill process if needed (CAREFUL!)
# sudo kill -9 <PID>
```

---

## Summary Checklist

- [ ] Code deployed to server
- [ ] Dependencies installed (`npm install`)
- [ ] Frontend built (`npm run build`)
- [ ] Environment variables set up (`.env` files)
- [ ] Nginx configured (without breaking Apache)
- [ ] PM2 configuration created
- [ ] Applications started with PM2
- [ ] PM2 set to start on boot
- [ ] Backend API tested
- [ ] Frontend tested
- [ ] Nginx reverse proxy tested
- [ ] SSL certificates installed (optional)

---

## Next Steps

1. **Monitor your applications:**
   ```bash
   pm2 monit
   ```

2. **Set up backups** (database, code)

3. **Set up monitoring** (optional)

4. **Update your code** (when needed):
   ```bash
   cd /path/to/kcay
   git pull  # if using Git
   cd backend && npm install
   cd ../frontend && npm install && npm run build
   pm2 restart all
   ```

---

## Important Notes

1. **Don't break Apache:** Make sure you test nginx config before reloading
2. **File permissions:** Make sure your user can read/write to the project directory
3. **Firewall:** Make sure ports 3000 and 3001 are accessible (or use nginx proxy only)
4. **Logs:** Check PM2 logs regularly for errors
5. **Backups:** Back up your database and code regularly

