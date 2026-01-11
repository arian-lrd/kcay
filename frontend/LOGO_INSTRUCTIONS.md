# How to Add Your Club Logo

## 📍 Where to Upload Your Logo

Place your club logo file in the following location:

```
frontend/public/logo.png
```

**Full path:**
```
/Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/frontend/public/logo.png
```

## 📋 Supported File Formats

Your logo should be one of these formats:
- **PNG** (recommended - supports transparency)
- **JPG/JPEG**
- **SVG** (scalable vector graphics - best for logos)

## 📝 File Naming

The logo file should be named exactly: **`logo.png`**

If you're using a different format, update the Header component:
- For JPG: Change `/logo.png` to `/logo.jpg` in `src/components/Header.js`
- For SVG: Change `/logo.png` to `/logo.svg` in `src/components/Header.js`

## 🎨 Logo Specifications (Recommended)

For best results, your logo should be:
- **Square aspect ratio** (e.g., 200x200px, 400x400px)
- **Transparent background** (PNG with transparency works best)
- **High resolution** (at least 200x200px, but 400x400px or higher is better)
- **File size**: Under 500KB (optimized for web)

## 🔧 How to Update

1. **Get your logo file** (PNG, JPG, or SVG format)

2. **Place it in the public folder:**
   ```
   frontend/public/logo.png
   ```

3. **The logo will automatically appear** in the navigation header!
   - If the file doesn't exist yet, the logo space will be hidden
   - Once you add the file, refresh your browser to see it

## 📐 Current Logo Display

The logo will appear:
- **Size**: 40px × 40px (height: 2.5rem, width: 2.5rem)
- **Position**: Left side of navigation bar
- **Format**: "logo | KCAY"
- **Responsive**: Works on both desktop and mobile

## 🖼️ Example Structure

Your `frontend/public/` folder should look like this:

```
frontend/public/
  ├── logo.png          ← Your club logo goes here
  ├── next.svg          (existing Next.js file)
  ├── vercel.svg        (existing Next.js file)
  └── ...               (other files)
```

## ⚠️ Notes

- The logo image uses Next.js's `Image` component for optimization
- If the logo file doesn't exist, it will automatically hide (no errors)
- The logo is clickable and links to the home page
- The logo scales nicely on different screen sizes

## 🎨 Styling Options

If you want to adjust the logo size, edit `src/components/Header.js`:

```javascript
// Change from h-10 w-10 (40px) to a different size:
<div className="relative h-12 w-12 flex-shrink-0">  // 48px
<div className="relative h-8 w-8 flex-shrink-0">    // 32px
```

---

**That's it!** Just add your logo file and it will appear in the navigation bar! 🎉

