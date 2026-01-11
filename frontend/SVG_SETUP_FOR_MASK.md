# How to Set Up SVG Files for CSS Mask-Image

Since we're using CSS `mask-image` to control icon colors, your SVG files need to be set up correctly.

## 🎯 What to Set in SVG Files

For CSS mask-image to work properly, your SVG files should have:

### Option 1: Black Fill (Recommended)
Set all `fill` attributes to **black** (`#000000` or `black`):

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#000000" d="..."/>
  <!-- or -->
  <path fill="black" d="..."/>
</svg>
```

**Why black?** The mask uses the **shape/alpha channel** of the SVG, not the color. Black provides the best contrast for the mask to work. The actual color comes from the CSS `backgroundColor` variable.

### Option 2: Any Solid Color
You can use any solid color (black, white, red, etc.) - the mask will use the shape:

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path fill="#FFFFFF" d="..."/>
  <!-- or any color -->
</svg>
```

**Note:** The color in the SVG doesn't matter - it's just used to define the shape. The CSS variable controls the actual displayed color.

---

## 📝 Step-by-Step: Setting Up Your SVGs

### For Instagram (`instagram.svg`):

1. Open `frontend/public/icons/instagram.svg` in a text editor
2. Find all `fill` attributes
3. Set them to `fill="#000000"` or `fill="black"`
4. Save the file

**Example:**
```svg
<!-- Before -->
<svg viewBox="0 0 24 24">
  <path fill="#E4405F" d="..."/>
</svg>

<!-- After -->
<svg viewBox="0 0 24 24">
  <path fill="#000000" d="..."/>
</svg>
```

### For YouTube (`youtube.svg`):

Same process:
1. Open `frontend/public/icons/youtube.svg`
2. Set all `fill` to `#000000` or `black`
3. Save

### For Linktree (`linktree.svg`):

Same process:
1. Open `frontend/public/icons/linktree.svg`
2. Set all `fill` to `#000000` or `black`
3. Save

### For LinkedIn (`linkedin.png`):

**Note:** PNG files work differently. The mask will use the alpha channel (transparency). If your PNG has a transparent background, it should work fine. If not, you might want to convert it to SVG.

---

## 🔍 What to Look For in SVG Files

Open your SVG file and look for:

1. **Fill attributes:**
   ```svg
   <path fill="#E4405F" d="..."/>  <!-- Change this -->
   <path fill="currentColor" d="..."/>  <!-- Change this -->
   <path fill="none" d="..."/>  <!-- Keep as is (transparent) -->
   ```

2. **Stroke attributes (if any):**
   ```svg
   <path stroke="#000000" d="..."/>  <!-- Usually fine as is -->
   ```

3. **Multiple paths:**
   - Make sure ALL paths that should be visible have a solid fill
   - Transparent paths (`fill="none"`) won't show in the mask

---

## ✅ Quick Checklist

For each SVG file:
- [ ] Open the file in a text editor
- [ ] Find all `fill` attributes
- [ ] Change them to `fill="#000000"` or `fill="black"`
- [ ] Save the file
- [ ] Refresh your browser

---

## 🎨 Why This Works

1. **CSS mask-image** uses the SVG as a "stencil" or "template"
2. The **shape** of the SVG (the paths) creates the mask
3. The **backgroundColor** CSS variable fills the mask with your chosen color
4. The original SVG color doesn't matter - only the shape is used

**Think of it like:**
- SVG = Cookie cutter (defines the shape)
- CSS variable = Cookie dough (provides the color)

---

## 💡 Pro Tips

1. **Use black** (`#000000`) - it's the standard for masks
2. **Remove any gradients** - masks work best with solid colors
3. **Keep it simple** - single-color fills work best
4. **Test after changes** - refresh your browser to see the result

---

## 🔧 If Icons Don't Show

If icons don't appear after setting up:

1. **Check the SVG has a fill:**
   - Make sure paths have `fill="#000000"` (not `fill="none"`)

2. **Check file paths:**
   - Make sure files are in `frontend/public/icons/`
   - Check file names match exactly

3. **Check browser console:**
   - Look for any 404 errors
   - Check if mask-image is supported

4. **Fallback:**
   - The code has a fallback that uses filter if mask doesn't work

---

## 📋 Summary

**What to set in SVG files:**
- ✅ `fill="#000000"` or `fill="black"` (recommended)
- ✅ Any solid color works (color doesn't matter, only shape)
- ❌ Don't use `fill="currentColor"` (won't work with mask)
- ❌ Don't use `fill="none"` (won't show in mask)

**The CSS variable controls the color, not the SVG!** 🎨

