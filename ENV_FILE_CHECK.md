# Check Your .env File - Quick Guide

## Your .env file needs these EXACT lines:

```env
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=dlccjlczm
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

## Critical Points:

### 1. `USE_CLOUDINARY=true` MUST be present!
- Without this line, it will use the database (that's why you see old images)
- Must be exactly `true` (lowercase, no quotes)
- This is the switch that enables Cloudinary

### 2. Get Your API Credentials:
1. Go to: https://console.cloudinary.com/console/dashboard
2. Copy:
   - **Cloud Name**: `dlccjlczm` (you already have this!)
   - **API Key**: Found under "Account Details"
   - **API Secret**: Click "Reveal" button next to API Secret

### 3. Add to `backend/.env`:
```env
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=dlccjlczm
CLOUDINARY_API_KEY=paste-your-key-here
CLOUDINARY_API_SECRET=paste-your-secret-here
```

### 4. Restart Backend:
After saving `.env` file:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### 5. Check Logs:
When you refresh `/resources` page, backend terminal should show:
```
📸 Gallery fetch - USE_CLOUDINARY: true
☁️ Attempting to fetch from Cloudinary...
✅ Successfully fetched X images from Cloudinary
```

If you see `USE_CLOUDINARY: false`, the `.env` file is missing that line!

---

## Quick Test:

After adding `USE_CLOUDINARY=true` to your `.env` and restarting:

1. Refresh `/resources` page
2. Check backend terminal logs
3. Should see Cloudinary logs (not database logs)

If still seeing old images, the logs will tell you why!

