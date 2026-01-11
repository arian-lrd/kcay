# Cloudinary Setup - What You Need to Do

## ✅ Code is Ready!

I've already integrated Cloudinary into your codebase. Now you just need to:

---

## Step 1: Create Cloudinary Account (5 minutes)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up with your email (free tier: 25GB storage + 25GB bandwidth/month)
3. Verify your email
4. You'll be taken to the Dashboard

---

## Step 2: Get Your API Credentials (2 minutes)

From your Cloudinary Dashboard, copy these 3 values:

1. **Cloud Name** - At the top of the dashboard (e.g., `your-cloud-name`)
2. **API Key** - Under "Account Details" (e.g., `123456789012345`)
3. **API Secret** - Click "Reveal" next to API Secret (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **Important**: Keep your API Secret private! Never share it publicly.

---

## Step 3: Install Cloudinary Package (1 minute)

Open your terminal and run:

```bash
cd backend
npm install cloudinary
```

Wait for installation to complete.

---

## Step 4: Add Environment Variables (2 minutes)

Open `backend/.env` and add these lines:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here

# Enable Cloudinary (set to 'true' to use Cloudinary, 'false' to use database)
USE_CLOUDINARY=true
```

Replace the placeholder values with your actual credentials from Step 2.

**Example:**
```env
CLOUDINARY_CLOUD_NAME=kcay-gallery
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
USE_CLOUDINARY=true
```

---

## Step 5: Restart Backend Server (30 seconds)

Stop your backend server (Ctrl+C) and restart it:

```bash
npm run dev
```

Or if you're running from root:
```bash
npm run dev
```

---

## Step 6: Test It Works!

1. **Upload a test image to Cloudinary:**
   - Go to: https://console.cloudinary.com/console/media_library
   - Click "Create Folder"
   - Name it: `gallery`
   - Click into the `gallery` folder
   - Click "Upload" and upload any test image
   - Click on the uploaded image
   - In the **Description** field, type: "Test image for gallery"
   - Click "Save"

2. **Check your website:**
   - Visit `/resources` page
   - You should see your test image with the caption!

---

## 🎉 That's It! You're Done!

Now your media team can:
- Log into Cloudinary Media Library
- Create folders for events (e.g., `gallery/fall-2024-event`)
- Upload images
- Add captions in the Description field
- Images automatically appear on your website!

---

## For Your Media Team

Share this guide with them: **CLOUDINARY_QUICK_START.md**

It has simple instructions on how to:
- Create event folders
- Upload images
- Add captions
- Organize images

---

## Troubleshooting

### "Module not found: cloudinary"
- Make sure you ran `npm install cloudinary` in the `backend` folder
- Check that `cloudinary` appears in `package.json` dependencies

### "Cloudinary credentials missing"
- Check your `backend/.env` file has all 3 Cloudinary variables
- Make sure there are no spaces around the `=` sign
- Restart your backend server after adding environment variables

### Images not appearing on website
- Check that `USE_CLOUDINARY=true` in your `.env` file
- Verify images are uploaded to Cloudinary (check Media Library)
- Check backend logs for errors (in terminal)
- Make sure folder name starts with `gallery/` (e.g., `gallery/test`)

### Captions not showing
- Make sure you added the caption in the **Description** field in Cloudinary (not just file name)
- Click "Save" after adding the description
- Wait a few seconds for changes to sync

---

## Need Help?

1. Check the error messages in your backend terminal
2. Verify all environment variables are set correctly
3. Make sure you restarted the backend server after adding credentials
4. Check Cloudinary dashboard to see if images uploaded successfully

---

## What Changed in the Code?

✅ Created `backend/services/cloudinaryService.js` - Handles fetching images from Cloudinary
✅ Updated `backend/models/resourcesModel.js` - Now uses Cloudinary when enabled
✅ Updated `frontend/src/app/resources/page.js` - Handles Cloudinary URLs correctly
✅ Added toggle: Set `USE_CLOUDINARY=false` to use database, `true` to use Cloudinary

The code will **automatically fall back to database** if Cloudinary fails, so your site won't break!

---

## Next Steps

1. Complete Steps 1-6 above ✅
2. Test with a few images ✅
3. Train your media team using `CLOUDINARY_QUICK_START.md` ✅
4. Enjoy non-technical image management! 🎉

