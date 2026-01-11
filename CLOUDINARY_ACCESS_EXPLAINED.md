# Cloudinary Access Control - How It Works

## How Cloudinary Works (Unlike Google Drive)

**Important**: Cloudinary doesn't use "shared folders" like Google Drive. Here's how it actually works:

### Key Differences:

1. **Public Access by Default**: Images uploaded to Cloudinary are publicly accessible via URL if you know the `public_id` (which includes the folder path). You don't need to "share" them.

2. **API Access = Account Credentials**: The API credentials (Cloud Name, API Key, API Secret) give access to ALL resources in your Cloudinary account. These are account-level, not folder-level.

3. **Folders are Just Organization**: Folders are part of the `public_id` path (e.g., `gallery/event-name/image.jpg`). They're organizational, not permission boundaries.

---

## ✅ Recommended Setup: Two Options

### Option 1: Simple Setup (Recommended for Small Teams)

**One Cloudinary Account for Everything**

- **Main Account**: You create one Cloudinary account
- **API Credentials**: Used by your website backend (in `.env` file)
- **Media Team Access**: Media team logs into the SAME Cloudinary account using your credentials to access Media Library UI

**Pros:**
- Simple - one account, one set of credentials
- No permission management needed
- Media team can use the web UI immediately

**Cons:**
- Less secure (media team has full account access)
- All team members share one login

**Setup:**
1. Create one Cloudinary account
2. Share the login credentials with media team (separate from API credentials)
3. Media team uses Media Library UI at: https://console.cloudinary.com/console/media_library
4. Backend uses API credentials (Cloud Name, API Key, API Secret) in `.env`

---

### Option 2: Separate User Accounts (More Secure)

**Main Account + Media Team User Accounts**

Cloudinary supports multiple user accounts under one organization with different permission levels.

**Setup:**
1. **Main Account (You)**: 
   - Create your Cloudinary account (this is the "owner")
   - Get API credentials for backend
   - Full admin access

2. **Media Team User Accounts**:
   - Go to Cloudinary Dashboard → **Settings** → **Users** → **Invite User**
   - Invite media team members with email addresses
   - Set permissions: **"Media Library User"** (upload, view, edit - but no account settings)
   - They'll get their own login credentials

3. **Folder Organization**:
   - Media team users can only upload to folders they create or have access to
   - All images are still accessible via API using main account credentials
   - Media team uses their own login for the Media Library UI

**Pros:**
- More secure (separate logins)
- Audit trail (who uploaded what)
- Can revoke access individually
- Media team can't access account settings

**Cons:**
- Slightly more complex setup
- Requires Cloudinary paid plan (multi-user is a paid feature)

**Note**: Multi-user accounts require a **paid Cloudinary plan** (starting at $89/month). The free tier is single-user only.

---

## How Your Website Accesses Images

**Important**: Your website backend uses the **API credentials** (Cloud Name, API Key, API Secret) from the MAIN account. These credentials can access ALL images in the account regardless of who uploaded them.

**The website doesn't need separate "sharing" because:**
1. API credentials have read access to all resources
2. Images are publicly accessible via URL anyway
3. Folders are just organizational (part of the public_id path)

---

## Recommended Approach for You

### If you have a small team (1-3 media people):

**Use Option 1 (Simple Setup)**:
- One Cloudinary account
- Media team uses the same login for Media Library UI
- Backend uses API credentials from that account
- Everyone can upload to `gallery/` folder and subfolders
- Website automatically fetches all images via API

### If you have a larger team or need better security:

**Use Option 2 (Separate Users)** - BUT you'll need a paid Cloudinary plan ($89/month minimum).

**Free Alternative**: 
- Use Option 1 but create a "media team" Cloudinary account separate from your main account
- Share those login credentials with media team
- Update your backend `.env` to use the media team account's API credentials
- Both accounts stay on free tier

---

## What You Actually Need to Do

### For Your Backend (.env file):
```env
# These are from YOUR Cloudinary account (or the media team account)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
USE_CLOUDINARY=true
```

### For Your Media Team:
- **Option 1 (Simple)**: Share your Cloudinary account login (email + password)
- **Option 2 (Separate)**: Create separate Cloudinary accounts and share those credentials

**The API credentials in `.env` are separate from login credentials:**
- **Login credentials**: For Media Library UI (email + password) - what media team uses
- **API credentials**: For backend code (Cloud Name, API Key, API Secret) - what your website uses

---

## Security Best Practices

1. **Keep API Secret Private**: Never commit `.env` file to git or share API Secret publicly
2. **Use Different Passwords**: If sharing account login, use a different password than your main accounts
3. **Read-Only Media Library**: Consider creating read-only user accounts for viewing (requires paid plan)
4. **Audit Trail**: Cloudinary logs all API calls - check dashboard periodically

---

## Example Setup Flow

### Simple Setup (What I Recommend):

1. **You create Cloudinary account**
   - Sign up at cloudinary.com
   - Get API credentials (Cloud Name, API Key, API Secret)
   - Add to `backend/.env`

2. **Media team uses same account**
   - Share the Cloudinary login (email + password) with media team
   - They log in at: https://console.cloudinary.com/console/media_library
   - They create folders: `gallery/event-name/`
   - They upload images and add captions

3. **Your website fetches automatically**
   - Backend uses API credentials to fetch all images from `gallery/` folder
   - No "sharing" needed - API credentials have access to everything
   - Images appear on `/resources` page automatically

---

## FAQ

**Q: Do I need to create a separate user for the media team?**
A: Only if you want separate logins/audit trail (requires paid plan). Otherwise, share your account login.

**Q: Can the media team access account settings if I share login?**
A: Yes, they'll have full access. If this is a concern, use separate Cloudinary accounts or upgrade to paid plan for user management.

**Q: Do folders need to be "shared" for the API to access them?**
A: No! API credentials (from main account) can access all folders. Folders are just organizational.

**Q: Can I restrict media team to only certain folders?**
A: Not on free tier. With paid plan, you can set folder-level permissions per user.

**Q: Will the website still work if media team uses a different Cloudinary account?**
A: Yes! Just update your `backend/.env` to use the media team account's API credentials instead.

---

## My Recommendation

**Start with Option 1 (Simple Setup)**: 
- Create one Cloudinary account
- Share login with media team (separate from API credentials)
- Use API credentials in your backend `.env`
- If you grow and need better security, upgrade to paid plan later

This is the simplest approach and works perfectly for most organizations!

