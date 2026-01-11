# Cloudinary API - What We're Using

## Current Implementation

The code uses **Cloudinary's Admin API** to fetch resources. Specifically:

### 1. **Search API** (for Folders - Default)
```javascript
cloudinary.search
  .expression('folder:gallery/*')
  .with_field('context')
  .with_field('metadata')
  .sort_by([{ created_at: 'desc' }])
  .max_results(500)
  .execute()
```

**What this does:**
- Searches for all resources in the `gallery/` folder and all subfolders
- Uses expression: `folder:gallery/*` 
- Gets images from: `gallery/`, `gallery/fall-2024/`, `gallery/event-name/`, etc.
- Includes context (for descriptions/captions)
- Includes metadata (file info)

### 2. **Collections API** (if enabled)
```javascript
cloudinary.api.collection('gallery')
```

**What this does:**
- Fetches a specific collection named "gallery"
- Returns assets in that collection
- Then fetches full details for each asset using `cloudinary.api.resource()`

---

## Current Search Expression

**Currently searching for:** `folder:gallery/*`

This means it's looking for images in:
- ✅ `gallery/image.jpg`
- ✅ `gallery/fall-2024/image.jpg`
- ✅ `gallery/event-name/image.jpg`
- ❌ NOT `images/gallery/...` (wrong path)
- ❌ NOT root level images (no folder)

---

## Important: Folder Path Must Match!

Based on your Cloudinary URL:
```
https://console.cloudinary.com/.../folders/cdd46ab35b0959f088ca993fcebf3e8639
```

**Question:** What is the actual folder name in your Cloudinary Media Library?

The code is currently searching for a folder named `gallery`. But if your folder has a different name, we need to update the search expression.

---

## Check Your Folder Name

1. Go to Cloudinary Media Library: https://console.cloudinary.com/console/media_library
2. Look at the folder structure
3. What is the exact folder name? Is it:
   - `gallery` ✅ (matches current code)
   - `Gallery` ❌ (case-sensitive!)
   - `gallery-images` ❌ (different name)
   - Something else?

---

## Possible Issues

### Issue 1: Folder Name Doesn't Match
If your folder is named something other than `gallery`, the search won't find it.

**Solution:** We can update the folder path in the code, or rename your Cloudinary folder.

### Issue 2: Images in Root, Not in Folder
If images are uploaded to root level (no folder), the search won't find them.

**Solution:** Move images into a `gallery` folder, or update search expression.

### Issue 3: Folder Structure Different
If your folder structure is different than expected.

**Solution:** Update the search expression to match your actual structure.

---

## What Folder Path Should We Use?

Can you check your Cloudinary Media Library and tell me:
1. What is the exact folder name where your images are?
2. Are images directly in that folder, or in subfolders?
3. What is the folder structure?

Example structure:
```
gallery/
  ├── image1.jpg
  ├── image2.jpg
  └── fall-2024/
      ├── image3.jpg
      └── image4.jpg
```

Once I know your actual folder structure, I can update the search expression accordingly!

