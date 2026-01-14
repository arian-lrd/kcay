# Setting Up Environment Variables on Your Server

This guide will help you create the `.env` files on your production server.

---

## Step 1: Backend Environment Variables

**On your server, navigate to the backend directory:**

```bash
cd /var/www/kcay/backend
```

**Create the `.env` file:**

```bash
nano .env
# or
vi .env
```

**Add these variables (replace with your actual values):**

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

# Server Configuration
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

**Important:** Replace:
- `your_db_user` - Your MySQL username (might be `root` or a custom user)
- `your_db_password` - Your MySQL password
- `your_database_name` - Your database name (the one you imported)
- Cloudinary and Brevo values if you're using those services

**Save and exit:**
- In `nano`: Press `Ctrl+X`, then `Y`, then `Enter`
- In `vi`: Press `Esc`, type `:wq`, then `Enter`

**Secure the file:**

```bash
chmod 600 .env
```

This makes the file readable/writable only by you (important for security).

---

## Step 2: Frontend Environment Variables

**On your server, navigate to the frontend directory:**

```bash
cd /var/www/kcay/frontend
```

**Create the `.env.local` file:**

```bash
nano .env.local
# or
vi .env.local
```

**Add this variable:**

```env
NEXT_PUBLIC_API_URL=https://kcay.ca/api/v1
```

**OR if your backend is on a different domain/port:**

```env
# If backend is on same domain but different port
NEXT_PUBLIC_API_URL=https://kcay.ca:3000/api/v1

# OR if backend is on a subdomain
NEXT_PUBLIC_API_URL=https://api.kcay.ca/api/v1
```

**Important Notes:**
- Use `https://` if you have SSL certificates set up
- Use `http://` if you don't have SSL yet (you can add SSL later)
- The URL should point to where your backend API will be accessible
- If using nginx reverse proxy, the URL should be `https://kcay.ca/api/v1` (nginx will proxy to port 3000)

**Save and exit** (same as above).

**Secure the file:**

```bash
chmod 600 .env.local
```

---

## Step 3: Verify Your Environment Variables

**Check backend .env:**

```bash
cd /var/www/kcay/backend
cat .env
```

**Check frontend .env.local:**

```bash
cd /var/www/kcay/frontend
cat .env.local
```

Make sure all values are correct!

---

## Step 4: Test Database Connection

**Test if your backend can connect to the database:**

```bash
cd /var/www/kcay/backend
node -e "require('dotenv').config(); const db = require('./config/database'); setTimeout(() => { console.log('Database connection test complete'); process.exit(0); }, 2000);"
```

You should see either:
- ✅ "Connected to MySQL database" (success)
- ❌ An error message (check your DB credentials)

---

## Common Issues

### Issue: "Cannot find module 'dotenv'"

**Solution:** Install dependencies:
```bash
cd /var/www/kcay/backend
npm install
```

### Issue: Database connection fails

**Check:**
1. MySQL is running: `sudo systemctl status mysql`
2. Database exists: `mysql -u your_db_user -p -e "SHOW DATABASES;"`
3. Credentials in `.env` are correct
4. Database user has permissions

### Issue: Wrong API URL

**For nginx reverse proxy setup:**
- If nginx proxies `/api` to `localhost:3000`, use: `https://kcay.ca/api/v1`
- If backend is directly accessible, use: `https://kcay.ca:3000/api/v1`

---

## Quick Checklist

- [ ] Backend `.env` file created with database credentials
- [ ] Frontend `.env.local` file created with API URL
- [ ] Both files have correct permissions (`chmod 600`)
- [ ] Database connection test passes
- [ ] API URL points to correct backend location

---

## Next Steps

After environment variables are set up:

1. ✅ **Environment variables configured**
2. ⏭️ **Configure nginx** (reverse proxy)
3. ⏭️ **Create PM2 config** (ecosystem.config.js)
4. ⏭️ **Start applications** with PM2
5. ⏭️ **Test everything**

---

## Need Help?

If you're not sure about any values:
- **Database credentials:** Check what you used when you imported the database
- **API URL:** Will depend on your nginx configuration (we'll set that up next)
- **Cloudinary/Brevo:** Only needed if you're using those services

