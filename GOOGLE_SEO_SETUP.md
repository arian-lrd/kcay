# Google SEO Setup Guide

This guide will help you get your website indexed by Google and appearing in search results.

## ✅ Files Created

I've already created:
- `frontend/src/app/robots.ts` - Tells search engines which pages to crawl
- `frontend/src/app/sitemap.ts` - Lists all your pages for Google
- Enhanced metadata in `layout.tsx` - Better SEO tags

## Step 1: Deploy the Changes

**On your server:**

```bash
cd /var/www/kcay/frontend

# Pull/upload the new files (robots.ts, sitemap.ts, updated layout.tsx)
# If using git:
# git pull

# Rebuild frontend
npm run build

# Restart
cd /var/www/kcay
pm2 restart kcay-frontend
```

**Verify the files are accessible:**
```bash
# Test robots.txt
curl https://kcay.ca/robots.txt

# Test sitemap
curl https://kcay.ca/sitemap.xml
```

Both should return content (not 404 errors).

---

## Step 2: Submit to Google Search Console

### 2.1 Go to Google Search Console

1. Visit: https://search.google.com/search-console
2. Sign in with your Google account
3. Click "Add Property" → "URL prefix"
4. Enter: `https://kcay.ca`
5. Click "Continue"

### 2.2 Verify Ownership

Google will ask you to verify ownership. Choose **HTML tag method**:

1. Google will give you an HTML tag that looks like:
   ```html
   <meta name="google-site-verification" content="ABC123XYZ..." />
   ```

2. Add this to your `frontend/src/app/layout.tsx`:
   
   Open `frontend/src/app/layout.tsx` and add to the metadata:
   
   ```typescript
   export const metadata: Metadata = {
     // ... existing metadata ...
     verification: {
       google: 'ABC123XYZ...', // Replace with your verification code
     },
   };
   ```

3. Rebuild and deploy:
   ```bash
   npm run build
   pm2 restart kcay-frontend
   ```

4. Click "Verify" in Google Search Console

### Alternative: DNS Verification

If HTML tag doesn't work, use DNS verification:
- Add a TXT record in Cloudflare DNS
- Copy the verification code Google provides
- Add it as a TXT record in Cloudflare

---

## Step 3: Submit Your Sitemap

After verification:

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **Submit**

Google will start crawling your site!

---

## Step 4: Request Indexing (Optional but Recommended)

1. In Google Search Console, use **URL Inspection** tool (top search bar)
2. Enter: `https://kcay.ca`
3. Click "Request Indexing"
4. Repeat for a few key pages:
   - `https://kcay.ca/about`
   - `https://kcay.ca/events`
   - `https://kcay.ca/podcast`

---

## Step 5: Check Your Pages Are Crawlable

**Test if Google can access your site:**

```bash
# Test on your server
curl -A "Googlebot" https://kcay.ca

# Should return HTML (not an error)
```

**Check robots.txt:**
```
https://kcay.ca/robots.txt
```

Should show:
```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://kcay.ca/sitemap.xml
```

---

## Step 6: Wait and Monitor

### How Long Until Indexing?

- **Initial crawl:** 1-7 days
- **First appearance in search:** 1-2 weeks
- **Full indexing:** 2-4 weeks

### Monitor Progress:

1. Google Search Console → **Coverage** - See which pages are indexed
2. Google Search Console → **Performance** - See search impressions (once indexed)
3. Search Google: `site:kcay.ca` - See what's indexed

---

## Step 7: Additional SEO Tips

### Improve Content

1. **Add more descriptive page titles** (edit each page's metadata)
2. **Use descriptive headings** (H1, H2, etc.)
3. **Add alt text to images**
4. **Create quality content** regularly

### Check Page Speed

Google prefers fast sites:
- Test: https://pagespeed.web.dev/
- Enter: `https://kcay.ca`
- Aim for 90+ score

### Mobile-Friendly

Your site should already be responsive (using Tailwind), but verify:
- Google Search Console → **Mobile Usability**

---

## Troubleshooting

### "Site Not Found" in Search Console

- Check DNS is pointing to your server
- Make sure HTTPS is working
- Verify robots.txt is accessible

### Pages Not Getting Indexed

- Check robots.txt isn't blocking them
- Verify sitemap.xml is accessible
- Make sure pages load correctly (no errors)
- Request indexing manually in Search Console

### Takes Too Long

- This is normal! Google can take weeks
- Make sure you submitted the sitemap
- Keep creating/updating content
- Share your site on social media (Google notices this)

---

## Quick Checklist

- [ ] Deployed robots.ts and sitemap.ts to server
- [ ] Verified robots.txt accessible at `/robots.txt`
- [ ] Verified sitemap.xml accessible at `/sitemap.xml`
- [ ] Added Google verification code to layout.tsx
- [ ] Verified site in Google Search Console
- [ ] Submitted sitemap in Google Search Console
- [ ] Requested indexing for homepage
- [ ] Waiting for Google to crawl (patience!)

---

## Expected Timeline

- **Day 1:** Submit to Search Console
- **Day 2-7:** Google starts crawling
- **Week 2:** Some pages appear in `site:kcay.ca` search
- **Week 3-4:** Site starts appearing in regular Google searches

**Remember:** SEO takes time. Keep adding quality content and be patient! 🚀


