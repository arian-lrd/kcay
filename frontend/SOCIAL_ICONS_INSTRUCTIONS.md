# Social Media Icon Instructions

## 📍 Where to Upload Social Media Logos

Place your social media logo files in the following location:

```
frontend/public/icons/
```

**Full path:**
```
/Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/frontend/public/icons/
```

## 📁 File Structure

Your `frontend/public/` folder should look like this:

```
frontend/public/
  ├── logo.png                    (your club logo)
  ├── icons/                      ← Create this folder
  │   ├── instagram.svg          (or .png)
  │   ├── youtube.svg            (or .png)
  │   ├── linkedin.svg           (or .png)
  │   └── linktree.svg           (or .png)
  ├── next.svg                   (existing Next.js file)
  └── ...                        (other files)
```

## 📝 File Names

The files **must** be named exactly:
- `instagram.svg` (or `instagram.png`)
- `youtube.svg` (or `youtube.png`)
- `linkedin.svg` (or `linkedin.png`)
- `linktree.svg` (or `linktree.png`)

## 🎨 Logo Specifications

### Recommended Format: SVG (Best Option)
- **Scalable** - looks perfect at any size
- **Small file size** - fast loading
- **Crisp on all screens**

### Alternative Format: PNG
- **Works great** if you don't have SVG
- **Recommended size**: 512x512px or 1024x1024px
- **Transparent background** (PNG with transparency)

### Icon Size
- Icons will be displayed at **20px × 20px** (5×5 in Tailwind)
- If using PNG, make them square (1:1 aspect ratio)

## 🔍 Where to Get Official Logos

### Option 1: Official Brand Assets (Recommended)
Download official brand assets from:
- **Instagram**: https://en.instagram-brand.com/assets/icons
- **YouTube**: https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-emotes
- **LinkedIn**: https://brand.linkedin.com/
- **Linktree**: https://linktr.ee/brand

Look for:
- **SVG format** (preferred)
- **Single color/white versions** (works best on colored backgrounds)
- **Icon/logo mark** (not the full wordmark)

### Option 2: Simple Icons
Use free icon libraries:
- **Simple Icons**: https://simpleicons.org/ (download SVG)
- **Heroicons**: https://heroicons.com/
- **Font Awesome**: https://fontawesome.com/icons (download SVG)

### Option 3: Create Your Own
- Use design software (Figma, Illustrator, etc.)
- Export as SVG or PNG with transparent background
- Ensure it's a square format

## 🎯 Icon Color

Since your footer has a **colored background** (Kurdish teal/green), you'll want:

**Option 1: White/Monochrome Icons** (Recommended)
- Use white or light-colored versions of the logos
- Works best on dark/colored backgrounds

**Option 2: Original Brand Colors**
- Use the original colored logos
- May need to adjust for visibility

## 📐 Current Display

Icons are displayed:
- **Size**: 20px × 20px (width: 1.25rem, height: 1.25rem)
- **Position**: Left of the social media name
- **Spacing**: Gap between icon and text
- **Hover effect**: Both icon and text fade slightly on hover

## ⚠️ Error Handling

If an icon file doesn't exist:
- The icon image will be hidden automatically
- Only the text (e.g., "Instagram") will be shown
- No errors will break the footer

## 🔧 Testing

After uploading icons:

1. **Create the `icons` folder:**
   ```bash
   mkdir -p frontend/public/icons
   ```

2. **Add your icon files** to that folder

3. **Refresh your browser** - icons should appear!

4. **Test each icon:**
   - Make sure all 4 icons appear correctly
   - Check hover effects work
   - Verify links still work

## 💡 Quick Start

1. Create the folder:
   ```bash
   cd frontend/public
   mkdir icons
   ```

2. Download or create SVG/PNG logos for:
   - Instagram
   - YouTube
   - LinkedIn
   - Linktree

3. Save them as:
   - `icons/instagram.svg`
   - `icons/youtube.svg`
   - `icons/linkedin.svg`
   - `icons/linktree.svg`

4. Refresh your website - icons will appear automatically!

---

**That's it!** Once you add the icon files, they'll automatically appear in your footer! 🎉

