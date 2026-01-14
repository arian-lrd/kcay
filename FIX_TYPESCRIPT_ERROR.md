# Fix TypeScript Build Error

The error "Cannot find name 'setLoading'" suggests the file structure got corrupted on the server.

## Quick Fix on Server

Edit the file on your server:

```bash
cd /var/www/kcay/frontend
nano src/app/page.tsx
```

**Find the `useEffect` block** (around lines 27-46) and make sure it looks exactly like this:

```typescript
  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [about, events, podcast] = await Promise.all([
          getAbout().catch(() => null),
          getEvents().catch(() => null),
          getLatestPodcast().catch(() => null),
        ]);
        setAboutData(about);
        setEventsData(events);
        setPodcastData(podcast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
```

**Important:**
- Make sure all indentation is consistent (use spaces, not tabs)
- The `setLoading(false)` should be inside the `finally` block
- The `finally` block should be inside the `fetchData` function
- The `fetchData` function should be inside the `useEffect`

## Alternative: Check the Full Function Structure

Make sure your component function starts like this:

```typescript
export default function Home() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [eventsData, setEventsData] = useState<any>(null);
  const [podcastData, setPodcastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // ... newsletter state ...

  useEffect(() => {
    // ... the fetchData code ...
  }, []);

  // ... rest of component ...
}
```

If the structure looks wrong, you might need to check if there are any stray characters or broken brackets/braces.

## If Editing Doesn't Work

If you keep having issues, you might want to:

1. **Redeploy from your local machine** (where the code is correct)
2. **Or copy the entire file** from your local machine to the server using SCP:

```bash
# From your local Mac
scp /Users/ARIAN/Documents/Personal/Kurdish/coding/kcay/frontend/src/app/page.tsx user@your-server:/var/www/kcay/frontend/src/app/page.tsx
```

