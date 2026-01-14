# Environment Files Review

You have **3 `.env` files**. Here's what each should contain:

## File Locations

1. **`.env`** (root directory) - ⚠️ **This might not be needed** (backend uses `backend/.env`)
2. **`backend/.env`** - ✅ **REQUIRED** - Backend environment variables
3. **`frontend/.env.local`** - ✅ **REQUIRED** - Frontend environment variables

---

## 1. `backend/.env` (REQUIRED)

This file is loaded by `backend/server.js`. It should contain:

### Database Configuration (REQUIRED)
```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
```

### Server Port (OPTIONAL - defaults to 3000)
```env
PORT=3000
```

### Cloudinary Configuration (REQUIRED if using Cloudinary)
```env
USE_CLOUDINARY=true
USE_CLOUDINARY_COLLECTION=false
CLOUDINARY_COLLECTION_NAME=
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true
```

### Brevo/Newsletter (OPTIONAL - only if using newsletter)
```env
BREVO_API_KEY=your_brevo_api_key
BREVO_LIST_ID=your_brevo_list_id
```

### Node Environment (OPTIONAL - for production)
```env
NODE_ENV=production
```

---

## 2. `frontend/.env.local` (REQUIRED)

This file is used by Next.js. It should contain:

### Backend API URL (REQUIRED)
```env
# For production, use your actual domain:
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
# OR if backend is on a different port:
NEXT_PUBLIC_API_URL=http://your-domain.com:3000/api/v1

# For development, you can use:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**⚠️ Important**: 
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose this to the browser
- This should be your **production backend URL** when deployed
- Don't include trailing slash

---

## 3. `.env` (root directory) - ⚠️ MAY NOT BE NEEDED

The root `.env` file might not be used since:
- Backend loads from `backend/.env` explicitly
- Frontend uses `frontend/.env.local`

**You can delete this file if it's not being used**, OR if you want to keep it for convenience, it can be a copy of `backend/.env` values.

---

## 📋 Pre-Deployment Checklist for .env Files

### For `backend/.env`:
- [ ] `DB_HOST` - Production database host
- [ ] `DB_USER` - Production database user
- [ ] `DB_PASSWORD` - Production database password (strong password!)
- [ ] `DB_NAME` - Production database name
- [ ] `DB_PORT` - Usually 3306
- [ ] `CLOUDINARY_CLOUD_NAME` - If using Cloudinary
- [ ] `CLOUDINARY_API_KEY` - If using Cloudinary
- [ ] `CLOUDINARY_API_SECRET` - If using Cloudinary
- [ ] `USE_CLOUDINARY=true` - If using Cloudinary
- [ ] `USE_CLOUDINARY_FOR_NOTABLE_FIGURES=true` - If using Cloudinary for notable figures
- [ ] `BREVO_API_KEY` - If using newsletter
- [ ] `BREVO_LIST_ID` - If using newsletter
- [ ] `NODE_ENV=production` - For production server

### For `frontend/.env.local`:
- [ ] `NEXT_PUBLIC_API_URL` - Production backend URL (NOT localhost!)

### For root `.env`:
- [ ] Either delete it OR keep it as a backup copy of `backend/.env`

---

## 🔒 Security Notes

1. **Never commit `.env` files to Git** (they should be in `.gitignore` ✅)
2. **Use different credentials for production** vs development
3. **Use strong passwords** for database
4. **Keep `.env` files secure** on server:
   ```bash
   chmod 600 backend/.env
   chmod 600 frontend/.env.local
   ```
5. **Don't share `.env` files** - keep credentials private

---

## ✅ Quick Verification

To verify your files are set up correctly:

1. **Check if files exist:**
   ```bash
   ls -la backend/.env frontend/.env.local
   ```

2. **Check if backend can load .env** (without revealing secrets):
   ```bash
   cd backend
   node -e "require('dotenv').config(); console.log('DB_HOST:', process.env.DB_HOST ? 'SET' : 'MISSING'); console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING');"
   ```

3. **For production deployment:**
   - Make sure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` points to your production backend URL
   - Make sure all credentials in `backend/.env` are production credentials (not localhost!)

---

## 🚨 Common Issues

1. **Using localhost in production**: Make sure `NEXT_PUBLIC_API_URL` uses your actual domain, not `localhost`
2. **Missing Cloudinary credentials**: If you're using Cloudinary, all 3 credentials must be set
3. **Wrong database credentials**: Double-check production database credentials
4. **Root `.env` file confusion**: The root `.env` might not be used - backend uses `backend/.env`

---

**Would you like me to create a template `.env.example` file for each location?**

