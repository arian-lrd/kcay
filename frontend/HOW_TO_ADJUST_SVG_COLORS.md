# How to Adjust SVG Colors

There are several ways to change SVG colors. Here are the best methods for your social media icons in the footer.

## 🎨 Method 1: Edit SVG Files Directly (Recommended)

The easiest way is to edit the SVG files directly and change the `fill` or `stroke` attributes.

### Step 1: Open the SVG file
Open your SVG file in a text editor (VS Code, Sublime, etc.)

### Step 2: Find and Replace Colors

Look for `fill` or `stroke` attributes:

```svg
<!-- Before (example) -->
<svg>
  <path fill="#000000" d="..."/>
</svg>

<!-- After - Change to white for colored background -->
<svg>
  <path fill="#FFFFFF" d="..."/>
</svg>
```

### Common Color Values:
- **White**: `fill="#FFFFFF"` or `fill="white"`
- **Black**: `fill="#000000"` or `fill="black"`
- **Your Kurdish colors**: 
  - Teal: `fill="#1E6B5E"`
  - Turquoise: `fill="#40E0D0"`
  - Red: `fill="#C8102E"`

### Step 3: Use `currentColor` for CSS Control

Replace hardcoded colors with `currentColor` to control via CSS:

```svg
<!-- SVG file -->
<svg>
  <path fill="currentColor" d="..."/>
</svg>
```

Then in CSS, you can control the color:
```css
.social-icon {
  color: white; /* Icon will be white */
}
```

---

## 🎨 Method 2: Use CSS Filters (Quick Fix)

If you don't want to edit SVG files, use CSS filters to change colors:

### Add to your Footer component or CSS:

```css
/* Make icons white */
.social-icon img {
  filter: brightness(0) invert(1);
}

/* Make icons a specific color */
.social-icon img {
  filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}
```

**Filter Generator Tool**: Use https://codepen.io/sosuke/pen/Pjoqqp to generate filters for specific colors.

---

## 🎨 Method 3: Inline SVG with CSS Control (Most Flexible)

Convert your `<img>` tags to inline SVGs for full CSS control.

### Update Footer.js:

```jsx
// Instead of:
<img src={social.icon} alt={social.name} className="w-5 h-5" />

// Use inline SVG:
<svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
  <path d="..."/>
</svg>
```

Then control color with CSS:
```css
.social-icon svg {
  color: white; /* Changes icon color */
}
```

---

## 🎯 Recommended Approach for Your Footer

Since your footer has a **colored background** (Kurdish teal/green), I recommend:

### Option A: White Icons (Easiest)
1. Edit each SVG file
2. Change all `fill` attributes to `fill="#FFFFFF"` or `fill="white"`
3. Save the files

### Option B: Use `currentColor` (Most Flexible)
1. Edit each SVG file
2. Change all `fill` attributes to `fill="currentColor"`
3. Add CSS to Footer component:

```jsx
<img
  src={social.icon}
  alt={social.name}
  className="w-5 h-5 object-contain"
  style={{ filter: 'brightness(0) invert(1)' }} // Makes icons white
/>
```

---

## 📝 Step-by-Step: Making Icons White

### For Instagram SVG:
1. Open `frontend/public/icons/instagram.svg`
2. Find all `fill="#..."` or `fill="black"` attributes
3. Replace with `fill="#FFFFFF"` or `fill="white"`
4. Save file

### Example Instagram SVG:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <!-- Before -->
  <path fill="#000000" d="M12 2.163c3.204 0 3.584.012 4.85.07..."/>
  
  <!-- After -->
  <path fill="#FFFFFF" d="M12 2.163c3.204 0 3.584.012 4.85.07..."/>
</svg>
```

---

## 🛠️ Quick CSS Solution (No File Editing)

If you want to change colors without editing SVG files, add this to your Footer component:

```jsx
<img
  src={social.icon}
  alt={social.name}
  className="w-5 h-5 object-contain"
  style={{ 
    filter: 'brightness(0) invert(1)', // Makes white
    // OR for a specific color, use a filter generator
  }}
/>
```

**Filter Generator**: https://codepen.io/sosuke/pen/Pjoqqp
- Enter your desired color (e.g., `#FFFFFF` for white)
- Copy the generated filter
- Paste it in the `style` attribute

---

## 🎨 Color Options for Your Footer

Since your footer background is **teal/green** (`#1E6B5E`), here are good icon color options:

1. **White** (`#FFFFFF`) - Best contrast, most visible
2. **Light Turquoise** (`#40E0D0`) - Matches your accent color
3. **Light Gray** (`#E0E0E0`) - Subtle but visible

---

## 💡 Pro Tip: Use SVG Optimizer

Before editing, optimize your SVGs:
- **SVGOMG**: https://jakearchibald.github.io/svgomg/
- Removes unnecessary code
- Makes files smaller
- Easier to edit

---

## 🔍 How to Check Current SVG Colors

1. Open SVG file in text editor
2. Look for:
   - `fill="#..."` - Fill color
   - `stroke="#..."` - Stroke/outline color
   - `fill="currentColor"` - Uses CSS color
   - `fill="none"` - No fill (transparent)

---

## 📋 Summary

**Easiest Method**: Edit SVG files directly, change `fill` to `#FFFFFF` (white)

**Most Flexible**: Use `currentColor` in SVG + CSS filters

**Quick Fix**: Add CSS filter to `<img>` tag in Footer component

Choose the method that works best for you! 🎨

