# Learn API Documentation

## Overview

The Learn API provides endpoints for the Learn section, which includes the main learn page and three sub-sections: Kurdish Language, Kurdish Dance, and Kurdish Heritage. Currently, these endpoints return "coming soon" placeholder content, but the structure is designed to be easily extended with resources, local places, discounts, and other educational content in the future.

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/LEARN_SCHEMA.sql
```

## API Endpoints

### 1. Get Main Learn Page

**Endpoint:** `GET /learn`

**Description:** Returns the main learn page content with an overview of the learn section.

**Response:**
```json
{
  "title": "Learn",
  "description": "Learn about Kurdish culture, language, dance, and heritage. Explore our educational resources and connect with local learning opportunities.",
  "content": null
}
```

---

### 2. Get Kurdish Language Section

**Endpoint:** `GET /learn/kurdish-language`

**Description:** Returns content for the Kurdish Language learning section.

**Response:**
```json
{
  "title": "Learn Kurdish Language",
  "description": "Learning Kurdish language is coming soon. We are working on bringing you resources, courses, and connections to local language learning opportunities.",
  "content": null
}
```

---

### 3. Get Kurdish Dance Section

**Endpoint:** `GET /learn/kurdish-dance`

**Description:** Returns content for the Kurdish Dance learning section.

**Response:**
```json
{
  "title": "Learn Kurdish Dance",
  "description": "Learning Kurdish dance is coming soon. We are working on bringing you resources, classes, and connections to local dance instructors and studios.",
  "content": null
}
```

---

### 4. Get Kurdish Heritage Section

**Endpoint:** `GET /learn/kurdish-heritage`

**Description:** Returns content for the Kurdish Heritage learning section (history, heritage, folklore).

**Response:**
```json
{
  "title": "Learn Kurdish Heritage",
  "description": "Learning about Kurdish heritage, history, and folklore is coming soon. We are working on bringing you educational resources and connections to cultural programs.",
  "content": null
}
```

---

## Frontend Implementation

### React Router Example

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function LearnPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/learn')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching learn content:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      
      <div className="learn-sections">
        <Link to="/learn/kurdish-language">
          <div className="learn-card">
            <h2>Learn Kurdish Language</h2>
            <p>Explore language learning resources</p>
          </div>
        </Link>
        
        <Link to="/learn/kurdish-dance">
          <div className="learn-card">
            <h2>Learn Kurdish Dance</h2>
            <p>Discover dance classes and instructors</p>
          </div>
        </Link>
        
        <Link to="/learn/kurdish-heritage">
          <div className="learn-card">
            <h2>Learn Kurdish Heritage</h2>
            <p>Learn about history, heritage, and folklore</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function KurdishLanguagePage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/learn/kurdish-language')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching content:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
    </div>
  );
}

// Similar components for KurdishDancePage and KurdishHeritagePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/kurdish-language" element={<KurdishLanguagePage />} />
        <Route path="/learn/kurdish-dance" element={<KurdishDancePage />} />
        <Route path="/learn/kurdish-heritage" element={<KurdishHeritagePage />} />
      </Routes>
    </Router>
  );
}
```

### Vanilla JavaScript Example

```javascript
// Main Learn Page
fetch('/learn')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('learn-content');
    container.innerHTML = `
      <h1>${data.title}</h1>
      <p>${data.description}</p>
      
      <div class="learn-sections">
        <a href="/learn/kurdish-language">
          <div class="learn-card">
            <h2>Learn Kurdish Language</h2>
            <p>Explore language learning resources</p>
          </div>
        </a>
        
        <a href="/learn/kurdish-dance">
          <div class="learn-card">
            <h2>Learn Kurdish Dance</h2>
            <p>Discover dance classes and instructors</p>
          </div>
        </a>
        
        <a href="/learn/kurdish-heritage">
          <div class="learn-card">
            <h2>Learn Kurdish Heritage</h2>
            <p>Learn about history, heritage, and folklore</p>
          </div>
        </a>
      </div>
    `;
  });

// Sub-section pages
function loadLearnSection(section) {
  fetch(`/learn/${section}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('learn-content');
      container.innerHTML = `
        <h1>${data.title}</h1>
        <p>${data.description}</p>
      `;
    });
}
```

---

## Future Development

The current implementation provides placeholder "coming soon" content. The database structure is designed to be extended with:

### Potential Future Features

1. **Resources Table**
   - Links to learning materials (videos, articles, courses)
   - Categorization and tagging
   - User ratings/reviews

2. **Local Places Table**
   - Schools, instructors, studios
   - Contact information
   - Location data
   - Availability/schedules

3. **Discounts/Promotions Table**
   - Special offers for members
   - Discount codes
   - Partner promotions

4. **Content Enhancement**
   - Rich text content (HTML/Markdown)
   - Images and media
   - Embedded videos
   - Interactive elements

5. **User Features**
   - Progress tracking
   - Bookmarks/favorites
   - Learning paths
   - Certificates

---

## Updating Content

### Update Main Learn Page

```sql
UPDATE learn_sections 
SET description = 'Your updated description here'
WHERE section_key = 'main';
```

### Update Kurdish Language Section

```sql
UPDATE learn_sections 
SET description = 'Your updated description here'
WHERE section_key = 'kurdish_language';
```

### Update Kurdish Dance Section

```sql
UPDATE learn_sections 
SET description = 'Your updated description here'
WHERE section_key = 'kurdish_dance';
```

### Update Kurdish Heritage Section

```sql
UPDATE learn_sections 
SET description = 'Your updated description here'
WHERE section_key = 'kurdish_heritage';
```

---

## Data Fields

### Learn Sections Table

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | INT | Primary key | Auto |
| `section_key` | VARCHAR(50) | Unique identifier (main, kurdish_language, etc.) | Yes |
| `title` | VARCHAR(255) | Section title | Yes |
| `description` | TEXT | Description/coming soon message | No |
| `content` | TEXT | Future: Rich content | No |
| `is_active` | BOOLEAN | Whether section is active | No (default TRUE) |
| `sort_order` | INT | Display order | No (default 0) |
| `created_at` | TIMESTAMP | Creation timestamp | Auto |
| `updated_at` | TIMESTAMP | Last update timestamp | Auto |

---

## Error Handling

- **404**: Section not found (when accessing a section that doesn't exist or is inactive)
- **500**: Server error (database connection issues, etc.)

Error response format:
```json
{
  "error": "Learn section not found"
}
```

---

## Notes

- All sections currently return "coming soon" placeholder content
- The structure is designed to be easily extended with additional tables and features
- Section keys are: `main`, `kurdish_language`, `kurdish_dance`, `kurdish_heritage`
- All endpoints return consistent JSON structure for easy frontend integration
- The `content` field is reserved for future rich content (currently null)

