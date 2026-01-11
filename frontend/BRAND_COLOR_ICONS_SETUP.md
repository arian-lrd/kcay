# Setting Up Brand-Colored Icons with White Centers

## ✅ What's Set Up

I've configured the Footer to handle two types of icons:

1. **Brand-colored icons** (YouTube, LinkedIn, Instagram): Use original colored SVG files directly
   - These icons have brand colors with white centers built into the SVG files
   - No CSS manipulation needed - they display exactly as the brands designed them

2. **CSS variable icons** (Linktree, etc.): Use CSS variables with mask-image
   - Single color controlled by CSS variables
   - Can be changed via CSS variables in `globals.css`

## 🎨 For Brand-Colored Icons (YouTube, LinkedIn, Instagram)

These icons need their **original brand-colored SVG files** with white centers already built in.

### What You Need to Do:

1. **Get the original brand-colored SVG files:**
   - Download from official brand asset sites or Simple Icons
   - These should have:
     - **YouTube**: Red background with white play triangle
     - **LinkedIn**: Blue background with white "in" text
     - **Instagram**: Gradient border with white camera icon

2. **Replace your current SVG files:**
   - `frontend/public/icons/youtube.svg` - Use original YouTube brand SVG
   - `frontend/public/icons/linkedin.svg` - Use original LinkedIn brand SVG (convert PNG to SVG if needed)
   - `frontend/public/icons/instagram.svg` - Use original Instagram brand SVG

3. **The icons will automatically use brand colors:**
   - No CSS changes needed
   - White centers are built into the SVG files
   - They'll display with their official brand colors

### Where to Get Brand-Colored SVGs:

- **Simple Icons**: https://simpleicons.org/
  - Search for "YouTube", "LinkedIn", "Instagram"
  - Download the SVG files (they have brand colors built in!)
  
- **Official Brand Assets**:
  - YouTube: https://www.youtube.com/howyoutubeworks/resources/brand-resources/
  - LinkedIn: https://brand.linkedin.com/
  - Instagram: https://en.instagram-brand.com/assets/icons

## 🔧 Current Configuration

In `Footer.js`, these icons are set to use brand colors:
- `useBrandColors: true` - YouTube, LinkedIn, Instagram
- `useBrandColors: false` - Linktree (uses CSS variable)

## 📝 CSS Variables

The CSS variables in `globals.css` (`--icon-youtube`, `--icon-linkedin`, `--icon-instagram`) are currently **not used** for brand-colored icons, but they're kept for future flexibility.

## 🎯 Summary

**For YouTube, LinkedIn, Instagram:**
- ✅ Use original brand-colored SVG files
- ✅ They have white centers built in
- ✅ No CSS manipulation needed
- ✅ Display with official brand colors

**For Linktree (or other single-color icons):**
- ✅ Use CSS variables
- ✅ Change color via `--icon-linktree` in `globals.css`
- ✅ Uses mask-image technique

---

**Next Step:** Download the original brand-colored SVG files and replace your current ones! 🎨

