# How to Customize Individual Social Icon Colors

Each social media icon in the footer can have its own unique color using CSS variables!

## 🎨 CSS Variables for Icon Colors

The following CSS variables control each icon's color:

- `--icon-instagram` - Instagram icon color
- `--icon-youtube` - YouTube icon color
- `--icon-linkedin` - LinkedIn icon color
- `--icon-linktree` - Linktree icon color

## ✏️ How to Change Icon Colors

### Step 1: Open `globals.css`

Navigate to: `frontend/src/app/globals.css`

### Step 2: Find the Icon Color Variables

Look for the section:
```css
/* Social Media Icon Colors - Individual control! */
```

### Step 3: Update the Values

Change the hex color codes to your desired colors:

```css
:root {
  --icon-instagram: #E4405F;     /* Instagram brand pink */
  --icon-youtube: #FF0000;       /* YouTube brand red */
  --icon-linkedin: #0077B5;      /* LinkedIn brand blue */
  --icon-linktree: #43E55E;      /* Linktree brand green */
}
```

### Step 4: Save and Refresh

The changes will automatically apply to each icon!

## 🎨 Color Examples

### Option 1: All White (Current)
```css
--icon-instagram: #FFFFFF;
--icon-youtube: #FFFFFF;
--icon-linkedin: #FFFFFF;
--icon-linktree: #FFFFFF;
```

### Option 2: Brand Colors
```css
--icon-instagram: #E4405F;     /* Instagram pink */
--icon-youtube: #FF0000;       /* YouTube red */
--icon-linkedin: #0077B5;      /* LinkedIn blue */
--icon-linktree: #43E55E;      /* Linktree green */
```

### Option 3: Kurdish Colors
```css
--icon-instagram: #FFFFFF;     /* White */
--icon-youtube: #40E0D0;       /* Turquoise */
--icon-linkedin: #FFFFFF;      /* White */
--icon-linktree: #FEBD11;      /* Kurdish gold */
```

### Option 4: Custom Mix
```css
--icon-instagram: #E4405F;     /* Instagram pink */
--icon-youtube: #FFFFFF;       /* White */
--icon-linkedin: #0077B5;      /* LinkedIn blue */
--icon-linktree: #FFFFFF;      /* White */
```

## 💡 Tips

1. **Contrast**: Make sure colors have good contrast against your footer background
2. **Consistency**: You can use the same color for all icons, or make each unique
3. **Brand Colors**: Using brand colors (Instagram pink, YouTube red, etc.) helps with recognition
4. **Testing**: Test on both desktop and mobile to ensure colors look good

## 🔍 How It Works

The Footer component uses CSS `mask-image` technique to apply colors to the icons:
- The icon SVG/image is used as a mask
- The `backgroundColor` CSS variable fills the mask with your chosen color
- This allows full CSS control over each icon's color!

## 📝 Notes

- Colors update automatically when you change the CSS variables
- Works with both SVG and PNG icon files
- All icons can have the same color, or each can be unique
- Easy to customize - just change the hex codes!

---

**That's it!** Just update the CSS variables and each icon will get its own color! 🎨

