# Next.js Setup Instructions (Manual Steps)

Since the directory has existing files, follow these steps:

## Step 1: Move Existing Files Temporarily

Run these commands in your terminal:

```bash
cd frontend

# Create a temporary folder outside frontend
mkdir -p ../_temp_frontend_files

# Move all existing files
mv API_USAGE.md CALENDAR_SETUP.md FRONTEND_OPTIONS.md NEXTJS_RECOMMENDATION.md NEXTJS_SETUP.md README.md api.js _temp ../_temp_frontend_files/
```

## Step 2: Set Up Next.js

Now the directory should be empty (or only have hidden files). Run:

```bash
# Still in frontend directory
npx create-next-app@latest . --js --tailwind --eslint --app --src-dir --import-alias "@/*"
```

When prompted, answer:
- Would you like to use TypeScript? → **No**
- Would you like to use ESLint? → **Yes**
- Would you like to use Tailwind CSS? → **Yes**
- Would you like to use `src/` directory? → **Yes**
- Would you like to use App Router? → **Yes**
- Would you like to customize the default import alias? → **No** (or Yes with `@/*`)

**OR use the non-interactive version:**

```bash
npx create-next-app@latest . --js --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

## Step 3: Restore Your Files

After Next.js setup completes:

```bash
# Create lib directory for api.js
mkdir -p src/lib

# Move api.js to the right place
mv ../_temp_frontend_files/api.js src/lib/api.js

# Move documentation files back (optional - you can keep them in _temp or move to a docs folder)
mkdir -p docs
mv ../_temp_frontend_files/*.md docs/

# Clean up temp folder
rm -rf ../_temp_frontend_files
```

## Step 4: Update api.js for Next.js

Edit `src/lib/api.js` and update the API base URL to use environment variables:

```javascript
// Change this line:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// To this (for Next.js):
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
```

## Step 5: Create Environment File

Create `.env.local` in the `frontend/` directory:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > .env.local
```

## Step 6: Test the Setup

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:3001` (or the port shown in terminal - Next.js will use 3001 if 3000 is taken by your backend).

You should see the Next.js welcome page!

## Alternative: Use Interactive Setup

If you prefer the interactive setup (easier for first time):

```bash
cd frontend
# Make sure directory is empty first (move files as in Step 1)
npx create-next-app@latest .
```

Then answer the prompts interactively.

## Troubleshooting

### Port Conflict
If port 3000 is taken by your backend, Next.js will automatically use 3001. That's fine!

### Permission Errors
If you get permission errors, try:
```bash
sudo npm install -g create-next-app
```

Or just use npx (which we're doing) - it doesn't require global install.

### Still Having Issues?
Let me know and I can help troubleshoot!

