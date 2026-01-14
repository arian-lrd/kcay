# Server Setup Guide: Where to Run Commands & Nginx Configuration

## Where to Run Installation Commands

**All installation commands run on your production server**, not on your local Mac. You need to SSH into your server first.

### Step 1: Connect to Your Server

```bash
ssh user@your-server-ip
```

Replace:
- `user` with your server username (e.g., `root`, `ubuntu`, `debian`)
- `your-server-ip` with your server's IP address or domain

Example:
```bash
ssh root@192.168.1.100
# or
ssh ubuntu@your-domain.com
```

### Step 2: Once Connected, Run the Installation Commands

After you SSH into your server, you're in a terminal session ON the server. Now run all the installation commands:

```bash
# Check current Node.js version
node --version  # If you see v12.x or lower, you NEED to upgrade!

# ⚠️ IMPORTANT: If you have Node.js v12 or older, you MUST upgrade!
# Your Next.js 16 app requires Node.js 18.17.0 or higher

# Upgrade Node.js to version 20 (Current LTS - Recommended) - On Ubuntu/Debian:
# First, remove old Node.js if it's installed from apt
sudo apt remove nodejs npm -y 2>/dev/null || true
sudo apt autoremove -y

# Install Node.js 20.x using NodeSource repository (RECOMMENDED)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# OR install Node.js 18.x if you prefer (also works, but 20 is newer):
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs

# Note: You may see a deprecation warning for Node.js 18 - it's just a warning,
# both 18 and 20 work fine. Node.js 20 is the current LTS version.

# Verify installation
node --version  # Should show v20.x.x (or v18.x.x)
npm --version   # Should show 9.x or 10.x

# If you still see old version, try:
# 1. Restart your terminal session
# 2. Or use nvm (Node Version Manager) - see below

# Install MySQL (if not installed)
sudo apt update
sudo apt install mysql-server

# Start and enable MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

---

## Important: Nginx vs Apache Architecture

You mentioned you want to use **nginx as a reverse proxy to Apache**. However, for a Node.js application, the typical architecture is:

### Recommended Architecture:

```
Internet → Nginx (Port 80/443) → Node.js Backend (Port 3000)
                                  Node.js Frontend (Port 3001)
```

**NOT:**
```
Internet → Nginx → Apache → Node.js  ❌ (Unnecessary)
```

### Why Not Apache?

- Your backend is **Node.js/Express** (runs on its own, doesn't need Apache)
- Your frontend is **Next.js** (also runs on its own, doesn't need Apache)
- Apache is typically for PHP applications or static file serving
- Adding Apache in between adds unnecessary complexity and overhead

### If You Still Need Apache

If you have other websites/apps on Apache that you need to keep running, you can:

**Option 1: Use Apache for other sites, Nginx for Node.js apps** (Recommended)
- Configure nginx for your Node.js apps (ports 3000, 3001)
- Keep Apache for other PHP/static sites
- Use different ports or subdomains

**Option 2: Use Nginx as reverse proxy for everything**
- Nginx handles all incoming traffic (port 80/443)
- Nginx proxies to Apache for PHP apps
- Nginx proxies to Node.js for your app

---

## Nginx Configuration for Node.js Apps

Here's how to configure nginx as a reverse proxy for your Node.js applications:

### 1. Create Nginx Configuration File

On your server (via SSH), create a configuration file:

```bash
sudo nano /etc/nginx/sites-available/kcay
```

Or use `vi`:
```bash
sudo vi /etc/nginx/sites-available/kcay
```

### 2. Add This Configuration

```nginx
# HTTP server (redirects to HTTPS)
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server (main configuration)
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificate paths (if you have SSL)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;

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
        
        # CORS headers (if needed, though better handled in Express)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    }

    # Static files from backend (images, PDFs, etc.)
    location /assets {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_cache_valid 200 1d;
    }
}
```

### 3. Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/kcay /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

---

## If You Want to Keep Apache for Other Sites

### Option A: Use Different Ports

- **Nginx**: Port 80/443 (main site - your Node.js app)
- **Apache**: Port 8080 (other PHP sites)

Configure Apache to listen on port 8080:
```bash
sudo nano /etc/apache2/ports.conf
# Change Listen 80 to Listen 8080
sudo systemctl restart apache2
```

### Option B: Use Nginx to Proxy to Apache

If you want nginx to handle everything and proxy to Apache for PHP sites:

```nginx
# Your Node.js app
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        # ... (same config as above)
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        # ... (same config as above)
    }
}

# Apache/PHP sites on subdomain
server {
    listen 80;
    server_name php.your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;  # Apache on port 8080
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Option C: Stop Apache (If You Don't Need It)

If you don't need Apache at all:

```bash
# Stop Apache
sudo systemctl stop apache2

# Disable Apache from starting on boot
sudo systemctl disable apache2

# Free up port 80 for nginx
```

---

## ⚠️ Upgrading from Node.js v12 or Older

If your server has Node.js v12 or older (like v12.22.9), you **MUST upgrade** before deployment:

### Method 1: Using NodeSource (Recommended)

```bash
# On Ubuntu/Debian:
# Remove old Node.js
sudo apt remove nodejs npm -y 2>/dev/null || true
sudo apt autoremove -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v18.x.x
npm --version
```

### Method 2: Using NVM (Node Version Manager) - Alternative

If Method 1 doesn't work, use NVM:

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.bashrc  # or source ~/.zshrc

# Install Node.js 18 (LTS)
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
npm --version
```

### Troubleshooting Old Node.js Version

If `node --version` still shows old version after installation:

1. **Check which node is being used:**
   ```bash
   which node
   /usr/bin/node -v  # Check system node
   ```

2. **Restart your SSH session** (logout and login again)

3. **Check PATH:**
   ```bash
   echo $PATH
   # Should include /usr/bin or where new nodejs is installed
   ```

4. **If using NVM, make sure it's loaded:**
   ```bash
   # Add to ~/.bashrc or ~/.zshrc:
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```

---

## Complete Setup Checklist

Run these commands **on your server** (after SSH):

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Upgrade/Install Node.js 18+ (if you have v12 or older)
# Remove old Node.js
sudo apt remove nodejs npm -y 2>/dev/null || true
sudo apt autoremove -y

# Install Node.js 20.x (Current LTS - Recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# OR Node.js 18.x (also works):
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs

# Verify installation (CRITICAL - must be 18+)
node --version  # Should show v20.x.x or v18.x.x (NOT v12.x!)
npm --version   # Should show 9.x or 10.x

# 3. Install MySQL
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# 4. Install PM2
sudo npm install -g pm2

# 5. Install/Configure Nginx (if not already installed)
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 6. Test nginx
sudo nginx -t

# 7. Configure firewall (allow HTTP, HTTPS, SSH)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## Summary

1. **Where to run commands**: On your production server (SSH into it first)
2. **Architecture**: Nginx → Node.js apps directly (not through Apache)
3. **Apache**: Only needed if you have PHP sites. Otherwise, you can stop it.
4. **Configuration**: Create nginx config file at `/etc/nginx/sites-available/kcay`

---

## Need Help?

- **Check if services are running**: `sudo systemctl status nginx`, `sudo systemctl status mysql`
- **View nginx logs**: `sudo tail -f /var/log/nginx/error.log`
- **Check ports in use**: `sudo netstat -tulpn | grep LISTEN`
- **Test nginx config**: `sudo nginx -t`

