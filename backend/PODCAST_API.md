# Podcast API Documentation

## Overview

The Podcast API provides endpoints to display podcast episodes with their details, timestamps, transcripts, and media links. Podcasts are hosted on YouTube and Spotify, with audio files available for direct playback.

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/PODCAST_SCHEMA.sql
```

## Image Setup

Place podcast images in: `backend/public/images/podcasts/`
- Cover images: `{cover_image_slug}.jpg` (for latest episode display)
- Thumbnail images: `{thumbnail_image_slug}.jpg` (for episode listings)
- If only one image is provided, it will be used for both cover and thumbnail

## API Endpoints

### 1. Get Latest Podcast Episode

**Endpoint:** `GET /podcast/latest`

**Description:** Returns the latest podcast episode (highest episode number). This is used for the main podcast page to display the featured episode.

**Response:**
```json
{
  "id": 1,
  "episode_number": 155,
  "title": "Episode 155: 2025 Hacker Stats & 2026 Goals",
  "description": "Episode 155: In this episode of Critical Thinking - Bug Bounty Podcast Justin, Joseph, and Brandyn reflect on last year of Bug Bounty, and list their goals and predictions for what 2026 holds. Follow us on twitter at: https://...",
  "release_date": "2026-01-01",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "youtube_video_id": "VIDEO_ID",
  "spotify_url": "https://open.spotify.com/episode/EPISODE_ID",
  "audio_url": "https://example.com/audio/episode-155.mp3",
  "cover_image_slug": "episode-155-cover",
  "thumbnail_image_slug": "episode-155-thumb",
  "cover_image_url": "/assets/images/podcasts/episode-155-cover.jpg",
  "thumbnail_image_url": "/assets/images/podcasts/episode-155-thumb.jpg",
  "duration": "00:58:49"
}
```

---

### 2. Get Recent Podcast Episodes

**Endpoint:** `GET /podcast/recent?limit=5`

**Description:** Returns recent podcast episodes (excluding the latest one). Used for the "Recent Episodes" section.

**Query Parameters:**
- `limit` (optional): Number of episodes to return (default: 5)

**Response:**
```json
[
  {
    "id": 2,
    "episode_number": 154,
    "title": "Episode 154: Previous Episode Title",
    "description": "Episode description...",
    "release_date": "2025-12-25",
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID_2",
    "youtube_video_id": "VIDEO_ID_2",
    "spotify_url": "https://open.spotify.com/episode/EPISODE_ID_2",
    "audio_url": "https://example.com/audio/episode-154.mp3",
    "thumbnail_image_slug": "episode-154-thumb",
    "cover_image_slug": "episode-154-cover",
    "thumbnail_image_url": "/assets/images/podcasts/episode-154-thumb.jpg",
    "duration": "01:02:15"
  },
  {
    "id": 3,
    "episode_number": 153,
    "title": "Episode 153: Another Episode",
    "description": "Another episode description...",
    "release_date": "2025-12-18",
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID_3",
    "youtube_video_id": "VIDEO_ID_3",
    "spotify_url": "https://open.spotify.com/episode/EPISODE_ID_3",
    "audio_url": "https://example.com/audio/episode-153.mp3",
    "thumbnail_image_slug": "episode-153-thumb",
    "cover_image_slug": "episode-153-cover",
    "thumbnail_image_url": "/assets/images/podcasts/episode-153-thumb.jpg",
    "duration": "00:55:30"
  }
]
```

---

### 3. Get All Podcast Episodes

**Endpoint:** `GET /podcast`

**Description:** Returns all podcast episodes ordered by episode number (newest first). Used for the "All Episodes" page.

**Response:**
```json
[
  {
    "id": 1,
    "episode_number": 155,
    "title": "Episode 155: Latest Episode",
    "description": "Description...",
    "release_date": "2026-01-01",
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "youtube_video_id": "VIDEO_ID",
    "spotify_url": "https://open.spotify.com/episode/EPISODE_ID",
    "audio_url": "https://example.com/audio/episode-155.mp3",
    "thumbnail_image_slug": "episode-155-thumb",
    "cover_image_slug": "episode-155-cover",
    "thumbnail_image_url": "/assets/images/podcasts/episode-155-thumb.jpg",
    "duration": "00:58:49"
  },
  // ... more episodes
]
```

---

### 4. Get Single Podcast Episode (Detail Page)

**Endpoint:** `GET /podcast/:id`

**Description:** Returns full details of a single podcast episode, including timestamps. Used for individual episode pages.

**Response:**
```json
{
  "id": 1,
  "episode_number": 147,
  "title": "Episode 147: Stupid, Simple, Hacking Workflow Tips",
  "description": "Episode 147: In this episode of Critical Thinking - Bug Bounty Podcast we're talking tips and tricks that help us in hacking that we really should've learned sooner.",
  "release_date": "2025-11-06",
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "youtube_video_id": "VIDEO_ID",
  "spotify_url": "https://open.spotify.com/episode/EPISODE_ID",
  "audio_url": "https://example.com/audio/episode-147.mp3",
  "cover_image_slug": "episode-147-cover",
  "thumbnail_image_slug": "episode-147-thumb",
  "cover_image_url": "/assets/images/podcasts/episode-147-cover.jpg",
  "thumbnail_image_url": "/assets/images/podcasts/episode-147-thumb.jpg",
  "show_notes": "Episode 147: In this episode... [full show notes with links, shoutouts, etc.]",
  "duration": "00:58:49",
  "twitter_link": "https://x.com/ctbbpodcast",
  "feedback_email": "info@criticalthinkingpodcast.io",
  "shoutout_text": "Shoutout to YTCracker for the awesome intro music!",
  "timestamps": [
    {
      "timestamp": "00:00:00",
      "label": "Introduction"
    },
    {
      "timestamp": "00:09:23",
      "label": "Command Palette, Auto-decoding, & Evenbetter"
    },
    {
      "timestamp": "00:17:28",
      "label": "Chrome Devtools Edit as html & Raycast"
    },
    {
      "timestamp": "00:33:23",
      "label": "ffuf -request flag"
    },
    {
      "timestamp": "00:41:33",
      "label": "JXScout"
    },
    {
      "timestamp": "00:48:55",
      "label": "Conditional Breakpoints in Devtools & Lightning round tips"
    }
  ]
}
```

---

### 5. Get Podcast Transcript

**Endpoint:** `GET /podcast/:id/transcript/:language`

**Description:** Returns the transcript for a podcast episode in a specific language.

**URL Parameters:**
- `id`: Podcast episode ID
- `language`: Language code (`english`, `kurdish_sorani`, `kurdish_kurmanji`, `farsi`)

**Response:**
```json
{
  "podcastId": 1,
  "language": "english",
  "transcript": "[00:00:00.64] - Joseph Thacker\nYou don't hit a deposit, you enter deposit. Yeah, now you just hit AFS to add filter size.\n\n[00:00:06.32] - Justin Gardner\nIf you do.\n\n[00:00:06.83] - Joseph Thacker\nIf. If you do fs, it will just do like filter size, but because.\n\n[00:00:12.32] - Justin Gardner\nAnd then enter to resume.\n\n[00:00:13.83] - Joseph Thacker\nYeah, it just resumes it.\n\n[00:00:17.03] - Justin Gardner\nHow did I not know about this?\n\n[00:00:18.32] - Joseph Thacker"
}
```

**Supported Languages:**
- `english`
- `kurdish_sorani`
- `kurdish_kurmanji`
- `farsi`

---

## Frontend Implementation Guide

### Main Podcast Page Structure

1. **Latest Episode Section:**
   - Fetch: `GET /podcast/latest`
   - Display:
     - Episode title
     - Description (truncated if needed)
     - Audio player (using `audio_url`)
     - Spotify and YouTube icons/links
     - Cover image

2. **Recent Episodes Section:**
   - Fetch: `GET /podcast/recent?limit=5`
   - Display grid of episode boxes with:
     - Thumbnail image (clickable to episode page)
     - Release date (formatted as "Jan. 1, 2026")
     - Episode title (clickable to episode page)
     - Description/summary (truncated)
     - "Listen to the Episode" link (clickable to episode page)
   - "View All Episodes" button/link

### All Episodes Page

- Fetch: `GET /podcast`
- Display all episodes in the same box format as recent episodes
- "View All Episodes" button/link at the bottom

### Individual Episode Page

1. **Fetch episode details:** `GET /podcast/:id`
2. **Display:**
   - Release date (formatted as "Nov. 6, 2025")
   - Episode title/number
   - YouTube iframe embed (using `youtube_video_id`)
   - Audio player (using `audio_url`)
   - Spotify and YouTube icon/links
   - Show Notes section:
     - Episode summary
     - Twitter link
     - Feedback email
     - Shoutout text
     - Links (from show_notes text)
     - Timestamps list
   - Transcript section with language selector:
     - Fetch: `GET /podcast/:id/transcript/:language`
     - Display transcript text
     - Language options: English, Kurdish Sorani, Kurdish Kurmanji, Farsi

### YouTube Embed

To embed a YouTube video, use the `youtube_video_id`:
```html
<iframe 
  width="560" 
  height="315" 
  src="https://www.youtube.com/embed/{youtube_video_id}" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
  allowfullscreen>
</iframe>
```

---

## Adding/Updating Podcast Episodes

### Add a New Episode

```sql
INSERT INTO podcasts (
    episode_number, 
    title, 
    description, 
    release_date, 
    youtube_url, 
    youtube_video_id, 
    spotify_url, 
    audio_url, 
    cover_image_slug, 
    thumbnail_image_slug, 
    show_notes, 
    duration,
    twitter_link,
    feedback_email,
    shoutout_text
) VALUES (
    156,
    'Episode 156: New Episode Title',
    'Episode description...',
    '2026-01-08',
    'https://www.youtube.com/watch?v=NEW_VIDEO_ID',
    'NEW_VIDEO_ID',
    'https://open.spotify.com/episode/NEW_EPISODE_ID',
    'https://example.com/audio/episode-156.mp3',
    'episode-156-cover',
    'episode-156-thumb',
    'Full show notes with links, shoutouts, etc.',
    '01:05:30',
    'https://x.com/ctbbpodcast',
    'info@criticalthinkingpodcast.io',
    'Shoutout text here'
);
```

### Add Timestamps

```sql
INSERT INTO podcast_timestamps (podcast_id, timestamp, label, sort_order) VALUES
    (1, '00:00:00', 'Introduction', 1),
    (1, '00:09:23', 'Command Palette, Auto-decoding, & Evenbetter', 2),
    (1, '00:17:28', 'Chrome Devtools Edit as html & Raycast', 3);
```

### Add Transcript

```sql
INSERT INTO podcast_transcripts (podcast_id, language, transcript_text) VALUES
    (1, 'english', '[00:00:00.64] - Speaker Name\nTranscript text here...');
```

---

## Data Fields

### Podcasts Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `episode_number` | INT | Episode number | Yes |
| `title` | VARCHAR(500) | Episode title | Yes |
| `description` | TEXT | Short description for listings | Yes |
| `release_date` | DATE | Release date | Yes |
| `youtube_url` | VARCHAR(500) | Full YouTube URL | No |
| `youtube_video_id` | VARCHAR(50) | YouTube video ID for embedding | No |
| `spotify_url` | VARCHAR(500) | Spotify episode URL | No |
| `audio_url` | VARCHAR(500) | Direct audio file URL | No |
| `cover_image_slug` | VARCHAR(255) | Cover image filename (without .jpg) | No |
| `thumbnail_image_slug` | VARCHAR(255) | Thumbnail image filename (without .jpg) | No |
| `show_notes` | TEXT | Full show notes | No |
| `duration` | VARCHAR(20) | Duration (e.g., "00:58:49") | No |
| `twitter_link` | VARCHAR(500) | Twitter/X link | No |
| `feedback_email` | VARCHAR(255) | Feedback email | No |
| `shoutout_text` | TEXT | Shoutout text | No |

### Podcast Timestamps Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `podcast_id` | INT | Foreign key to podcasts | Yes |
| `timestamp` | VARCHAR(50) | Timestamp (e.g., "00:00:00") | Yes |
| `label` | VARCHAR(500) | Timestamp label | Yes |
| `sort_order` | INT | Order for display | No |

### Podcast Transcripts Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `podcast_id` | INT | Foreign key to podcasts | Yes |
| `language` | ENUM | Language code | Yes |
| `transcript_text` | MEDIUMTEXT | Full transcript text | Yes |

---

## Error Handling

- **404**: Episode not found (when accessing `/podcast/:id` with invalid ID)
- **404**: Transcript not found (when accessing transcript with invalid language or missing transcript)
- **400**: Invalid language (when using unsupported language code)
- **500**: Server error (database connection issues, etc.)

Error response format:
```json
{
  "error": "Podcast episode not found"
}
```

---

## Notes

- Episode numbers must be unique (enforced by database)
- Episodes are ordered by `episode_number` (higher = newer)
- Images are served from `/assets/images/podcasts/`
- YouTube video ID is extracted from the YouTube URL for embedding
- Transcripts are stored per language for better performance and management
- Timestamps are ordered by `sort_order` for proper display

