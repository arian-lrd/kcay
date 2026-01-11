# How to Customize Navigation Colors

The navigation header uses **CSS variables** for easy color customization. This is an industry-standard approach that makes it simple to change colors in one place.

## 🎨 Current Color Palette

The navigation currently uses a blue color scheme:
- **Header Background**: `#1e3a8a` (Deep Blue)
- **Text Color**: `#ffffff` (White)
- **Hover Color**: `#3b82f6` (Light Blue)
- **Active Link**: `#60a5fa` (Lighter Blue)
- **Border**: `#1e40af` (Medium Blue)
- **Mobile Menu**: `#1e40af` (Medium Blue)

## ✏️ How to Change Colors

### Step 1: Open `globals.css`

Navigate to: `frontend/src/app/globals.css`

### Step 2: Find the Color Variables

Look for the section that starts with:
```css
/* Navigation Header Colors - Easy to customize! */
```

### Step 3: Update the Values

Change the hex color codes to your desired colors:

```css
:root {
  --nav-bg: #YOUR_COLOR;           /* Header background color */
  --nav-text: #YOUR_COLOR;          /* Header text color */
  --nav-hover: #YOUR_COLOR;         /* Hover background color */
  --nav-active: #YOUR_COLOR;        /* Active link color */
  --nav-border: #YOUR_COLOR;        /* Border color */
  --nav-mobile-bg: #YOUR_COLOR;     /* Mobile menu background */
}
```

### Step 4: Save and Refresh

The changes will automatically apply to the entire navigation header!

## 🎨 Color Palette Examples

### Example 1: Green Theme
```css
--nav-bg: #065f46;           /* Dark Green */
--nav-text: #ffffff;         /* White */
--nav-hover: #10b981;        /* Light Green */
--nav-active: #34d399;       /* Lighter Green */
--nav-border: #047857;       /* Medium Green */
--nav-mobile-bg: #047857;    /* Medium Green */
```

### Example 2: Purple Theme
```css
--nav-bg: #581c87;           /* Dark Purple */
--nav-text: #ffffff;         /* White */
--nav-hover: #9333ea;        /* Light Purple */
--nav-active: #a78bfa;       /* Lighter Purple */
--nav-border: #6b21a8;       /* Medium Purple */
--nav-mobile-bg: #6b21a8;    /* Medium Purple */
```

### Example 3: Red/Orange Theme
```css
--nav-bg: #991b1b;           /* Dark Red */
--nav-text: #ffffff;         /* White */
--nav-hover: #f97316;        /* Orange */
--nav-active: #fb923c;       /* Light Orange */
--nav-border: #dc2626;       /* Medium Red */
--nav-mobile-bg: #dc2626;    /* Medium Red */
```

## 💡 Tips

1. **Contrast**: Make sure `--nav-text` has good contrast with `--nav-bg` for readability
2. **Accessibility**: Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to ensure your colors meet accessibility standards
3. **Consistency**: Keep hover and active states in the same color family as the main background
4. **Testing**: Test on both desktop and mobile to ensure colors look good in both views

## 🔧 Advanced: Using RGB or HSL

You can also use RGB or HSL values instead of hex:

```css
--nav-bg: rgb(30, 58, 138);        /* RGB */
--nav-bg: hsl(224, 64%, 33%);      /* HSL */
```

## 📝 Notes

- All colors update automatically when you change the CSS variables
- No need to modify the Header component code
- Changes apply to both desktop and mobile navigation
- The header is sticky (stays at top when scrolling)

---

**Need help?** Your design team can easily provide hex color codes, and you can paste them directly into the CSS variables!

