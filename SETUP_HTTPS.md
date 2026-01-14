# Setup HTTPS with Let's Encrypt

## Step 1: Install Certbot

**On your server:**

```bash
# Update package list
sudo apt update

# Install certbot and nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

## Step 2: Get SSL Certificate

**On your server:**

```bash
# Request SSL certificate (certbot will modify nginx config automatically)
sudo certbot --nginx -d kcay.ca -d www.kcay.ca

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: option 2)
```

**What certbot does:**
- Automatically gets SSL certificate from Let's Encrypt
- Modifies your nginx config to use HTTPS
- Sets up automatic renewal

## Step 3: Verify Configuration

**After certbot completes, verify:**

```bash
# Test nginx config
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Step 4: Test HTTPS

**On your server:**

```bash
# Test HTTPS endpoint
curl https://kcay.ca/api/v1/about
```

**Or visit in your browser:**
- `https://kcay.ca`

## Step 5: Verify Auto-Renewal

**SSL certificates expire every 90 days. Certbot should auto-renew. Test it:**

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check certbot timer (should be enabled)
sudo systemctl status certbot.timer
```

## Manual Nginx Configuration (Alternative)

If you prefer to configure nginx manually, here's the HTTPS config:

```nginx
# HTTP server - redirect to HTTPS
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

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/kcay.ca/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kcay.ca/privkey.pem;
    
    # SSL Configuration (recommended settings)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;

    # Logging
    access_log /var/log/nginx/kcay-access.log;
    error_log /var/log/nginx/kcay-error.log;

    # Client body size limit (for file uploads)
    client_max_body_size 20M;

    # Frontend (Next.js)
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

    # Static files
    location /assets {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_cache_valid 200 1d;
    }
}
```

## Important Notes

1. **DNS must point to your server** - Make sure `kcay.ca` DNS A record points to your server's IP address before running certbot
2. **Port 80 and 443 must be open** - Let's Encrypt needs to verify domain ownership via HTTP on port 80
3. **Automatic renewal** - Certbot sets up a systemd timer that renews certificates automatically. You usually don't need to do anything.

## Troubleshooting

### Certificate request fails

**Check DNS:**
```bash
# Verify DNS points to your server
dig kcay.ca
nslookup kcay.ca
```

**Check firewall:**
```bash
# Make sure ports 80 and 443 are open
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Check certificate expiry

```bash
# Check when certificate expires
sudo certbot certificates
```

### Renew manually

```bash
# Renew certificates manually
sudo certbot renew
sudo systemctl reload nginx
```

