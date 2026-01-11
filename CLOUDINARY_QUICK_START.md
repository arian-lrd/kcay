# Cloudinary Quick Start Guide

## For Developers: Setup Steps

### 1. Install Cloudinary Package

```bash
cd backend
npm install cloudinary
```

### 2. Add Environment Variables

Add to `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Enable Cloudinary (set to 'true' to use Cloudinary, 'false' to use database)
USE_CLOUDINARY=true
```

### 3. Get Cloudinary Credentials

1. Sign up at https://cloudinary.com/users/register/free (free tier: 25GB storage + 25GB bandwidth/month)
2. Go to Dashboard after login
3. Copy your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 4. Restart Backend Server

```bash
npm run dev
```

The gallery will now fetch images from Cloudinary instead of the database!

---

## For Media Team: How to Add Images

### Step 1: Access Cloudinary Media Library

1. Go to https://console.cloudinary.com/console/media_library
2. Log in with your Cloudinary account

### Step 2: Create Folder for Event

1. Click "Create Folder" or the folder icon
2. Name it: `gallery/fall-2024-event` (or any event name)
3. Press Enter

**Folder Structure:**
```
gallery/
  ├── fall-2024-event/
  ├── holiday-gathering/
  └── spring-2025-event/
```

**Important:** Always create folders inside the `gallery/` folder!

### Step 3: Upload Images

1. Navigate to your event folder (e.g., `gallery/fall-2024-event/`)
2. Click "Upload" button or drag & drop images
3. Wait for upload to complete (images are optimized automatically)

### Step 4: Add Captions

1. Click on an image to view its details
2. Find the **Description** field
3. Add your caption (e.g., "Kurdish community members celebrating at York University")
4. Click "Save" or press Enter

**Example Captions:**
- "Traditional dance performance during Fall event"
- "Guest speaker presentation on Kurdish history"
- "Community members at holiday gathering"

### Step 5: Images Appear on Website

- Images will appear on the `/resources` page automatically
- Captions will show below each image
- No technical team needed after initial setup!

---

## Troubleshooting

### Images not appearing on website?

1. **Check folder name**: Must start with `gallery/` (e.g., `gallery/event-name`)
2. **Check upload**: Make sure images finished uploading (green checkmark)
3. **Check backend logs**: Look for Cloudinary errors in terminal
4. **Check credentials**: Verify `.env` file has correct Cloudinary credentials
5. **Check flag**: Make sure `USE_CLOUDINARY=true` in `.env`

### Captions not showing?

1. Make sure you added the caption in the **Description** field (not just file name)
2. Click "Save" after adding the description
3. Wait a few seconds for changes to sync

### Images loading slowly?

- Cloudinary automatically optimizes images
- First load may be slower (images are being processed)
- Subsequent loads will be fast (CDN caching)

---

## Tips for Media Team

1. **Use descriptive folder names**: `fall-2024-event` is better than `event1`
2. **Always add captions**: Help viewers understand the images
3. **Upload high-quality images**: Cloudinary optimizes them automatically
4. **Organize by event**: Create a folder for each event
5. **File names don't matter**: You can name files anything, captions are what matter

---

## Testing

1. Upload a test image to `gallery/test-event/`
2. Add a caption: "Test image for gallery"
3. Visit `/resources` page on your website
4. You should see the image with caption!

---

## Support

If you need help:
1. Check this guide first
2. Contact the development team
3. Check Cloudinary documentation: https://cloudinary.com/documentation

