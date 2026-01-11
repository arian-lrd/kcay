# Next.js Setup Guide

Step-by-step guide to set up Next.js for your student club website.

## Prerequisites

- Node.js installed (version 18 or higher recommended)
- Your backend API running (on `http://localhost:3000`)
- Terminal/command line access

## Step-by-Step Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Set Up Next.js

We'll use the latest Next.js with TypeScript support (optional but recommended):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Wait, let me explain the options:**
- `--typescript` - Adds TypeScript (recommended, but you can skip if you prefer JavaScript)
- `--tailwind` - Adds Tailwind CSS (great for styling, recommended)
- `--eslint` - Adds code linting (recommended)
- `--app` - Uses the new App Router (recommended for Next.js 13+)
- `--src-dir` - Creates a `src/` folder (cleaner structure)
- `--import-alias "@/*"` - Allows imports like `@/components` (convenient)

**If you want to skip TypeScript (simpler for beginners):**

```bash
npx create-next-app@latest . --js --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Or use the interactive setup (recommended for first time):**

```bash
npx create-next-app@latest .
```

Then answer the prompts:
- Would you like to use TypeScript? → `No` (or `Yes` if you want it)
- Would you like to use ESLint? → `Yes`
- Would you like to use Tailwind CSS? → `Yes`
- Would you like to use `src/` directory? → `Yes`
- Would you like to use App Router? → `Yes`
- Would you like to customize the default import alias? → `No` (or `Yes` and use `@/*`)

### Step 3: Install Dependencies

This should happen automatically, but if not:

```bash
npm install
```

### Step 4: Move Your API File

Your `api.js` file needs to be in the `src/` directory (or `lib/` folder):

**Option A: Move to `src/lib/` (recommended):**
```bash
mkdir -p src/lib
mv api.js src/lib/api.js
```

**Option B: Keep in root and import from `src/`:**
- Keep `api.js` in `frontend/` root
- Update imports to use relative paths

### Step 5: Update API Base URL (Optional but Recommended)

Create a `.env.local` file in the `frontend/` directory:

```bash
# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Then update `src/lib/api.js` (or wherever you put it) to use:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
```

### Step 6: Test the Setup

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:3000` (or the port shown in terminal).

You should see the Next.js welcome page!

### Step 7: Create Your First Page

Create `src/app/about/page.js` (or `page.jsx` if not using TypeScript):

```javascript
'use client'; // This is needed for client-side API calls

import { useState, useEffect } from 'react';
import { getAbout } from '@/lib/api';

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const aboutData = await getAbout();
        setData(aboutData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h1>About</h1>
      {/* Render your data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

Then visit `http://localhost:3000/about` to see your page!

## Project Structure

After setup, your structure will look like:

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.js          # Home page (/)
│   │   ├── layout.js        # Root layout
│   │   ├── about/
│   │   │   └── page.js      # About page (/about)
│   │   ├── events/
│   │   │   └── page.js      # Events page (/events)
│   │   └── ...
│   └── lib/
│       └── api.js           # Your API functions
├── public/                  # Static files (images, etc.)
├── .env.local              # Environment variables
├── next.config.js          # Next.js config
├── package.json
└── ...
```

## Next Steps After Setup

1. **Update API File Location**
   - Move `api.js` to `src/lib/api.js`
   - Update imports if needed

2. **Create Your Pages**
   - `/about` - About page
   - `/events` - Events page
   - `/resources` - Resources page
   - `/learn` - Learn page
   - `/podcast` - Podcast page
   - `/get-involved` - Get Involved page
   - `/notable-figures` - Notable Figures page

3. **Set Up Navigation**
   - Create a navigation component
   - Add it to your layout

4. **Style Your Pages**
   - Use Tailwind CSS (if you included it)
   - Or add your own CSS

5. **Connect to Your API**
   - Use the functions from `api.js`
   - Test each endpoint

## Troubleshooting

### Port Already in Use
If port 3000 is taken (by your backend):
- Next.js will automatically use 3001
- Or change it: `npm run dev -- -p 3001`

### API Connection Errors
- Make sure your backend is running
- Check the API URL in `.env.local`
- Check browser console for CORS errors

### Module Not Found
- Make sure `api.js` is in the right location
- Check import paths (use `@/lib/api` if using alias)

## Need Help?

I can help you:
- Set up the project
- Create your first page
- Connect to your API
- Add styling
- Set up navigation

Just ask!

