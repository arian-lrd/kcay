# Understanding `prefers-color-scheme` (Dark Mode)

## 🤔 What is `@media (prefers-color-scheme: dark)`?

This is a **CSS media query** that detects whether the user has enabled dark mode on their device/operating system.

## 📱 Where Does the Preference Come From?

The preference comes from the **user's operating system settings**:

### On macOS (your Mac):
1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **Appearance**
3. Select **Dark** or **Light** mode
4. Your browser reads this setting automatically!

### On Windows:
1. Open **Settings**
2. Go to **Personalization** → **Colors**
3. Choose **Dark** or **Light** mode
4. Browser reads this setting

### On iOS (iPhone/iPad):
1. Open **Settings**
2. Go to **Display & Brightness**
3. Choose **Light** or **Dark**
4. Safari/Chrome reads this setting

### On Android:
1. Open **Settings**
2. Go to **Display**
3. Enable/disable **Dark theme**
4. Browser reads this setting

## 🔍 How It Works

```css
/* Default (Light Mode) */
:root {
  --background: #ffffff;  /* White background */
  --foreground: #171717;  /* Dark text */
}

/* When user has Dark Mode enabled */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;  /* Dark background */
    --foreground: #ededed;  /* Light text */
  }
}
```

**What happens:**
1. Browser checks the user's OS dark mode setting
2. If dark mode is ON → Uses colors inside `@media (prefers-color-scheme: dark)`
3. If dark mode is OFF → Uses the default colors (light mode)
4. This happens **automatically** - no user action needed on your website!

## 🎨 Current Behavior in Your Site

Right now, your website:
- ✅ **Respects the user's OS dark mode preference**
- ✅ **Automatically switches** background/text colors
- ❌ **Does NOT affect navigation colors** (nav colors stay the same)

## ⚠️ Important Note

**Your navigation header colors are NOT affected by this!**

Only these colors change:
- `--background` (page background)
- `--foreground` (text color)

Your navigation colors (`--nav-bg`, `--nav-text`, etc.) stay the same regardless of dark/light mode.

## 🛠️ Options for Your Website

### Option 1: Keep It As-Is (Recommended)
- Respects user's OS preference automatically
- Navigation stays consistent (always Kurdish colors)
- Simple and works well

### Option 2: Disable Dark Mode
If you don't want dark mode support, you can remove the media query:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  /* Remove the @media (prefers-color-scheme: dark) block */
}
```

### Option 3: Add Dark Mode Navigation Colors
If you want the navigation to also change in dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
    
    /* Optionally add dark mode nav colors */
    --nav-bg: #1a1a1a;
    --nav-text: #ffffff;
    /* etc... */
  }
}
```

## 🧪 How to Test

1. **Test Light Mode:**
   - Set your Mac to Light mode (System Settings → Appearance → Light)
   - Refresh your website
   - Should see white background

2. **Test Dark Mode:**
   - Set your Mac to Dark mode (System Settings → Appearance → Dark)
   - Refresh your website
   - Should see dark background with light text

## 💡 Best Practice

Most modern websites respect `prefers-color-scheme` because:
- ✅ Users expect it
- ✅ Better accessibility (some users need dark mode)
- ✅ Reduces eye strain
- ✅ Better battery life on OLED screens

**Recommendation:** Keep it! It's a good practice and your navigation colors (Kurdish red/green) will still look great.

---

**Summary:** The preference comes from the user's operating system settings (macOS, Windows, iOS, Android). The browser automatically reads this setting and applies the appropriate CSS. No code changes needed - it just works! 🎉

