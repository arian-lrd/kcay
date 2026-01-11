# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account (Media Team)

1. Go to https://cloudinary.com/users/register/free
2. Sign up for a **free account** (25GB storage + 25GB bandwidth/month)
3. Verify your email address

## Step 2: Get API Credentials

Once logged into Cloudinary:

1. Go to **Dashboard** (you'll see it after login)
2. Copy these credentials from your dashboard:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **Important**: Keep your API Secret private! Never commit it to git.

## Step 3: Install Cloudinary Package

In your **backend** directory, run:

```bash
cd backend
npm install cloudinary
```

## Step 4: Add Environment Variables

Add these to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

Replace with your actual values from Step 2.

## Step 5: Media Team - Upload Images

### Using Cloudinary Media Library (Web Interface):

1. **Log into Cloudinary**: https://console.cloudinary.com/console/media_library
2. **Create folders for events**:
   - Click "Create Folder" or use the folder icon
   - Name it like: `gallery/fall-2024-event` or `gallery/holiday-gathering`
   - You can create nested folders: `gallery/2024/fall-event`
3. **Upload images**:
   - Navigate to the folder
   - Click "Upload" or drag & drop images
   - Images will be optimized automatically
4. **Add captions**:
   - Click on an image to view details
   - In the **Description** field, add your caption (e.g., "Kurdish community gathering at York University")
   - Click "Save"
5. **Organize**:
   - Drag images to reorder within a folder
   - Create subfolders for better organization: `gallery/event-name/subfolder`

### Folder Structure Example:

```
gallery/
  ├── fall-2024-event/
  │   ├── image1.jpg (caption: "Community members at event")
  │   ├── image2.jpg (caption: "Traditional dance performance")
  │   └── image3.jpg (caption: "Guest speaker presentation")
  ├── holiday-gathering/
  │   ├── group-photo.jpg (caption: "Holiday celebration group photo")
  │   └── activities.jpg (caption: "Traditional activities")
  └── spring-2025-event/
      └── ...
```

**Notes for Media Team:**
- Use descriptive folder names (they appear as event names)
- Always add captions in the Description field for each image
- Keep image file names simple (they don't affect the website)
- Images are automatically optimized, so upload high-quality originals

## Step 6: Test the Integration

Once the backend code is updated, test by visiting:
- `/resources` page on your website
- Images from Cloudinary should appear automatically
- Captions should show under each image

## Troubleshooting

### Images not appearing:
1. Check that folder path matches what's in the code (default: `gallery/`)
2. Verify images are uploaded to Cloudinary (check Media Library)
3. Check backend logs for errors
4. Verify API credentials in `.env` file

### Captions not showing:
1. Make sure descriptions are added in Cloudinary Media Library (not just file names)
2. Check that the description field is populated for each image

### API Rate Limits:
- Free tier: Very generous limits for your use case
- Images are cached, so API calls are minimal
- If you hit limits, we can implement better caching

## Next Steps

After completing these steps, the development team will:
1. Update the backend to fetch images from Cloudinary
2. Update the frontend to display Cloudinary images with captions
3. Implement caching to reduce API calls
4. Test the integration

