# Debug Cloudinary Integration - Step by Step

## Check These Things:

### 1. Check Backend Terminal Logs

When you refresh `/resources` page, you should see logs like:

```
📥 GET /api/v1/resources/gallery - Request received
📸 Gallery fetch - USE_CLOUDINARY: true
☁️ Attempting to fetch from Cloudinary...
📦 Loading Cloudinary service...
✅ Cloudinary service loaded successfully
✅ Cloudinary credentials found
📁 Fetching from Cloudinary Folder: gallery
🔍 Cloudinary: Searching for images in folder: gallery/*
🔍 Cloudinary: Cloud Name: dlccjlczm
🔍 Cloudinary: API Key: Set
🔍 Cloudinary: Search expression: folder:gallery/*
🔍 Cloudinary search completed. Found X resources in folder: gallery/*
✅ Successfully fetched X images from Cloudinary
✅ Gallery items fetched: X items
```

**What to look for:**
- ❌ If you see `USE_CLOUDINARY: false` → `.env` file missing `USE_CLOUDINARY=true`
- ❌ If you see `Cloudinary module not found` → Run `npm install cloudinary` in `backend/` folder
- ❌ If you see `Cloudinary credentials missing` → Check `.env` has all 3 credentials
- ❌ If you see `Found 0 resources` → Folder name might be wrong or no images uploaded
- ❌ If you see error messages → Check the error details

### 2. Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh `/resources` page
4. Look for request to `/api/v1/resources/gallery`
5. Click on it and check:
   - **Status**: Should be 200
   - **Response**: Should show array of images with Cloudinary URLs (starting with `https://res.cloudinary.com/`)

### 3. Verify Folder Name in Cloudinary

**Important**: The folder name must be exactly `gallery` (lowercase, no spaces)

1. Go to: https://console.cloudinary.com/console/media_library
2. Check the folder structure - what is the exact folder name?
   - ✅ Should be: `gallery`
   - ❌ NOT: `Gallery`, `Gallery Images`, `gallery-images`, etc.

### 4. Check Images Are Actually in Cloudinary

1. Go to Cloudinary Media Library
2. Navigate to your `gallery` folder
3. Do you see subfolders like:
   - `gallery/first-meeting/`
   - `gallery/panel:kurdistan-at-a-crossroads/`
4. Click into a subfolder - do you see images there?

### 5. Common Issues & Fixes

#### Issue: `USE_CLOUDINARY: false`
**Fix:** Add to `backend/.env`:
```env
USE_CLOUDINARY=true
```
Then restart backend server.

#### Issue: `Found 0 resources`
**Possible causes:**
1. Folder name is different (e.g., `Gallery` instead of `gallery`)
2. No images uploaded yet
3. Images in wrong location (not in `gallery/` folder)

**Fix:** 
- Verify folder name is exactly `gallery` (lowercase)
- Upload test images to `gallery/test-event/` folder
- Check folder structure matches

#### Issue: Authentication Error
**Error might be:** `Invalid API Key` or `Unauthorized`
**Fix:**
- Check credentials in `.env` match Cloudinary Dashboard
- Make sure API Secret is correct (no extra spaces)
- Regenerate API Secret in Cloudinary if needed

#### Issue: Search Expression Error
**Error might be:** Invalid search expression
**Fix:**
- Make sure folder name doesn't have special characters (except `/` and `:`)
- Try searching for just `folder:gallery` without `/*` to test

---

## Quick Test

1. **Add test image to Cloudinary:**
   - Go to Media Library
   - Create folder: `gallery` (if not exists)
   - Create subfolder: `gallery/test-event`
   - Upload one test image
   - Add description: "Test image"

2. **Check backend logs:**
   - Refresh `/resources` page
   - Look for: `Found X resources` (should be at least 1)

3. **Check browser Network tab:**
   - Response should include your test image with Cloudinary URL

---

## Still Not Working?

**Please share:**
1. Backend terminal logs when refreshing `/resources`
2. Browser Network tab response for `/api/v1/resources/gallery`
3. Exact folder name in Cloudinary (take a screenshot if needed)
4. Any error messages you see

The logs will tell us exactly what's wrong!

