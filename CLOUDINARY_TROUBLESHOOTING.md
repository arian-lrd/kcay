# Cloudinary Troubleshooting - Still Seeing Old Database Images?

## Quick Checklist

If you're still seeing old database images on `/resources` page, check these:

### 1. Check Your `.env` File

Open `backend/.env` and make sure you have:

```env
USE_CLOUDINARY=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important:**
- `USE_CLOUDINARY` must be exactly `true` (not `'true'` or `True`)
- No quotes around the values
- No spaces around the `=` sign

### 2. Check Backend Terminal Output

When you refresh `/resources` page, look at your backend terminal. You should see logs like:

```
📸 Gallery fetch - USE_CLOUDINARY: true
☁️ Attempting to fetch from Cloudinary...
📦 Loading Cloudinary service...
✅ Cloudinary service loaded successfully
✅ Cloudinary credentials found
📁 Fetching from Cloudinary Folder: gallery
✅ Successfully fetched X images from Cloudinary
```

**If you see:**
- `USE_CLOUDINARY: false` → Your `.env` file doesn't have `USE_CLOUDINARY=true`
- `💾 Using database for gallery images` → Cloudinary is disabled
- `Cloudinary module not found` → Run `npm install cloudinary` in `backend/` folder
- `Cloudinary credentials missing` → Check your `.env` file has all 3 credentials

### 3. Restart Backend Server

After changing `.env` file, **always restart your backend server**:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Verify Cloudinary Package is Installed

```bash
cd backend
npm list cloudinary
```

If it shows `empty` or error, install it:
```bash
npm install cloudinary
```

### 5. Verify Cloudinary Credentials

Make sure your credentials in `.env` match your Cloudinary Dashboard:
- Go to: https://console.cloudinary.com/console/dashboard
- Check:
  - Cloud Name (top of dashboard)
  - API Key (Account Details section)
  - API Secret (click "Reveal" button)

### 6. Check Cloudinary Folder Structure

Make sure images are in a folder named `gallery`:
- Go to: https://console.cloudinary.com/console/media_library
- Check if you have a folder named `gallery` (or whatever folder you're using)
- Images should be in: `gallery/` or `gallery/subfolder/`

### 7. Test Cloudinary Connection

Check your backend terminal when refreshing `/resources` page. The logs will tell you exactly what's happening.

---

## Common Issues

### Issue: `USE_CLOUDINARY: false`

**Solution:** Add to `backend/.env`:
```env
USE_CLOUDINARY=true
```
Then restart backend server.

---

### Issue: `Cloudinary module not found`

**Solution:**
```bash
cd backend
npm install cloudinary
```
Then restart backend server.

---

### Issue: `Cloudinary credentials missing`

**Solution:** Add all 3 to `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```
Then restart backend server.

---

### Issue: `Successfully fetched 0 images from Cloudinary`

**Possible causes:**
1. Images not in `gallery/` folder → Check folder name matches
2. No images uploaded yet → Upload some test images
3. Folder name is different → Update code or rename folder in Cloudinary

**Check:** Look at the logs to see which folder it's searching for.

---

### Issue: Images found but still seeing old database images

**Possible causes:**
1. Browser cache → Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Frontend not refreshing → Clear browser cache
3. API response cached → Check Network tab in browser DevTools

---

## Step-by-Step Debug Process

1. **Check backend terminal logs** when refreshing `/resources` page
2. **Look for these log messages:**
   - `📸 Gallery fetch - USE_CLOUDINARY: true` ← Should be `true`
   - `☁️ Attempting to fetch from Cloudinary...` ← Should appear
   - `✅ Successfully fetched X images` ← Should show number > 0
3. **If you see `💾 Using database`** → Check `.env` file has `USE_CLOUDINARY=true`
4. **If you see `Cloudinary module not found`** → Run `npm install cloudinary`
5. **If you see `0 images`** → Check folder name and upload status in Cloudinary

---

## Still Not Working?

1. Check all the logs in backend terminal
2. Verify `.env` file is in `backend/` folder (not root)
3. Make sure you restarted backend after changing `.env`
4. Check that `cloudinary` package is in `backend/node_modules`
5. Verify images are actually uploaded to Cloudinary Media Library

The logs will tell you exactly what's wrong! Check your backend terminal output.

