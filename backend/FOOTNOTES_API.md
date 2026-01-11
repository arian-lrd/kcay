# Footnotes API Documentation

## Overview

The Footnotes API provides all the data needed for the footer section of the website, including social media links (Instagram, YouTube, LinkedIn, Linktree) and contact information.

## Database Setup

First, run the SQL schema file to create the tables:
```bash
mysql -u your_user -p your_database < backend/FOOTNOTES_SCHEMA.sql
```

Then update the settings with your actual social media links and contact info:
```sql
UPDATE footnotes_settings SET setting_value = 'contact@kcay.org' WHERE setting_key = 'contact_us';
UPDATE footnotes_settings SET setting_value = 'https://instagram.com/kcay' WHERE setting_key = 'instagram';
UPDATE footnotes_settings SET setting_value = 'https://youtube.com/@kcay' WHERE setting_key = 'youtube';
UPDATE footnotes_settings SET setting_value = 'https://linkedin.com/company/kcay' WHERE setting_key = 'linkedin';
UPDATE footnotes_settings SET setting_value = 'https://linktr.ee/kcay' WHERE setting_key = 'linktree';
```

## API Endpoint

### Get Footnotes Data

**Endpoint:** `GET /footnotes`

**Description:** Returns all footnotes data including social media links and contact information.

**Response:**
```json
{
  "contactUs": "contact@kcay.org",
  "instagram": "https://instagram.com/kcay",
  "youtube": "https://youtube.com/@kcay",
  "linkedin": "https://linkedin.com/company/kcay",
  "linktree": "https://linktr.ee/kcay"
}
```

## Frontend Implementation

### Footer/Footnotes Section

The footer should display all the social media links and contact information. The Linktree link is particularly useful as it can be updated with weekly content without needing to update the footer every week.

**Example HTML Structure:**
```html
<footer>
  <div class="contact-section">
    <h3>Contact Us</h3>
    <a href="mailto:{contactUs}">{contactUs}</a>
  </div>
  <div class="social-links">
    <a href="{instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
    <a href="{youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>
    <a href="{linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="{linktree}" target="_blank" rel="noopener noreferrer">Linktree</a>
  </div>
</footer>
```

**React Example Implementation:**
```jsx
import React, { useState, useEffect } from 'react';

function Footer() {
  const [footnotes, setFootnotes] = useState(null);

  useEffect(() => {
    fetch('/footnotes')
      .then(res => res.json())
      .then(data => setFootnotes(data))
      .catch(err => console.error('Error fetching footnotes:', err));
  }, []);

  if (!footnotes) return <footer>Loading...</footer>;

  return (
    <footer>
      <div className="contact-section">
        <h3>Contact Us</h3>
        <a href={`mailto:${footnotes.contactUs}`}>{footnotes.contactUs}</a>
      </div>
      <div className="social-links">
        <a href={footnotes.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <a href={footnotes.youtube} target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        <a href={footnotes.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={footnotes.linktree} target="_blank" rel="noopener noreferrer">
          Linktree
        </a>
      </div>
    </footer>
  );
}

export default Footer;
```

**Vanilla JavaScript Example:**
```javascript
fetch('/footnotes')
  .then(res => res.json())
  .then(data => {
    const footer = document.querySelector('footer');
    footer.innerHTML = `
      <div class="contact-section">
        <h3>Contact Us</h3>
        <a href="mailto:${data.contactUs}">${data.contactUs}</a>
      </div>
      <div class="social-links">
        <a href="${data.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="${data.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href="${data.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="${data.linktree}" target="_blank" rel="noopener noreferrer">Linktree</a>
      </div>
    `;
  })
  .catch(err => console.error('Error fetching footnotes:', err));
```

## Updating Social Media Links

### Update Contact Information
```sql
UPDATE footnotes_settings 
SET setting_value = 'new-email@kcay.org' 
WHERE setting_key = 'contact_us';
```

### Update Instagram Link
```sql
UPDATE footnotes_settings 
SET setting_value = 'https://instagram.com/new_handle' 
WHERE setting_key = 'instagram';
```

### Update YouTube Link
```sql
UPDATE footnotes_settings 
SET setting_value = 'https://youtube.com/@new_channel' 
WHERE setting_key = 'youtube';
```

### Update LinkedIn Link
```sql
UPDATE footnotes_settings 
SET setting_value = 'https://linkedin.com/company/new_handle' 
WHERE setting_key = 'linkedin';
```

### Update Linktree Link
```sql
UPDATE footnotes_settings 
SET setting_value = 'https://linktr.ee/new_handle' 
WHERE setting_key = 'linktree';
```

**Note:** The Linktree link can be updated with weekly content links without needing to modify the footer code every week. This makes it easy to share current events, announcements, or featured content.

## Notes

- All social media links should open in a new tab (`target="_blank"`)
- Use `rel="noopener noreferrer"` for security when opening external links
- The `contactUs` field can be either an email address (for mailto: links) or a contact form URL
- All links should be full URLs (starting with `https://`)

## Error Handling

- **500**: Server error (database connection issues, etc.)

Error response format:
```json
{
  "error": "Something went wrong!"
}
```

