# Brand Color Icons with White Centers

## The Challenge

You want icons like YouTube and LinkedIn to have:
- **Brand color borders/outlines** (YouTube red, LinkedIn blue)
- **White centers** (YouTube white triangle, LinkedIn white "in" text)

CSS `mask-image` can't do this because it only applies ONE color to the entire shape.

## Solutions

### Option 1: Use Original Brand-Colored SVGs (Simplest)

Keep the SVG files with their original brand colors (including white centers) and display them directly:

**Pros:**
- ✅ Looks exactly like the brand icons
- ✅ No CSS manipulation needed
- ✅ Works perfectly with white centers

**Cons:**
- ❌ Can't control colors with CSS variables
- ❌ Each icon needs its original colored SVG file

### Option 2: Two-Tier System

- **Brand-colored icons** (YouTube, LinkedIn, Instagram): Use original colored SVGs directly
- **Simple icons** (Linktree, etc.): Use CSS variables with mask-image

### Option 3: Inline SVG with Multiple Paths

Convert to inline SVG and style different paths separately:
- Outer path: Brand color (CSS variable)
- Inner path: White (hardcoded)

**Pros:**
- ✅ Full CSS control
- ✅ Can mix brand colors with white centers

**Cons:**
- ❌ More complex code
- ❌ Need to modify SVG structure

---

## Recommendation

**Use Option 1 or 2: Original brand-colored SVGs**

For icons that need brand colors with white centers (YouTube, LinkedIn, Instagram), use the original colored SVG files directly - they already have the right colors built in!

For simpler icons or when you want all icons the same color, use CSS variables with mask-image.

---

## Implementation

We can set up a system where:
1. Icons with brand colors: Display original SVG directly (no CSS manipulation)
2. Icons with CSS variables: Use mask-image approach

This gives you the best of both worlds! 🎨

