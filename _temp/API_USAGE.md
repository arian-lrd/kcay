# API Usage Guide

This guide explains how to use the API functions to communicate with your backend.

## CORS (Cross-Origin Resource Sharing)

**Good News!** Your backend already has CORS enabled, so you can make API calls from your frontend without any issues. The backend has `app.use(cors())` configured, which allows requests from your frontend domain.

## Setup

The API functions are in `api.js`. To use them, import the functions you need:

```javascript
// Import specific functions
import { getAbout, getEvents, getNotableFigures } from './api';

// Or import all functions
import * as api from './api';
```

## Configuration

The API base URL is set to `http://localhost:3000/api/v1` by default. 

**For production**, create a `.env` file in your frontend directory:
```
REACT_APP_API_URL=https://your-backend-domain.com/api/v1
```

## Usage Examples

### Basic Usage (Async/Await)

```javascript
import { getAbout, getEvents } from './api';

async function loadData() {
  try {
    // Get about page data
    const aboutData = await getAbout();
    console.log('About data:', aboutData);
    
    // Get events
    const events = await getEvents();
    console.log('Events:', events);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

loadData();
```

### React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { getAbout } from './api';

function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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
    </div>
  );
}
```

### React Hook Pattern (Recommended)

You can create custom React hooks for cleaner code:

```javascript
// hooks/useAbout.js
import { useState, useEffect } from 'react';
import { getAbout } from '../api';

export function useAbout() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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

  return { data, loading, error };
}

// Usage in component
import { useAbout } from './hooks/useAbout';

function AboutPage() {
  const { data, loading, error } = useAbout();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
}
```

## All Available API Functions

### About
- `getAbout()` - Get about page data

### Events
- `getEvents()` - Get all events
- `getEventById(id)` - Get single event
- `getCalendarEvents(params)` - Get events for calendar

### Resources
- `getGallery()` - Get gallery items
- `getConstitution()` - Get constitution PDF URL

### Merch
- `getMerch()` - Get merch data

### Notable Figures
- `getNotableFigures()` - Get all notable figures
- `getNotableFigureById(id)` - Get single notable figure

### Get Involved
- `getGetInvolved()` - Get get-involved data

### Footnotes
- `getFootnotes()` - Get footnotes/social links

### Podcast
- `getLatestPodcast()` - Get latest episode
- `getRecentPodcasts(limit)` - Get recent episodes
- `getAllPodcasts()` - Get all episodes
- `getPodcastById(id)` - Get single episode
- `getPodcastTranscript(id, language)` - Get transcript

### Newsletter
- `subscribeToNewsletter(data)` - Subscribe to newsletter

### Learn
- `getLearnMain()` - Get main learn page
- `getLearnKurdishLanguage()` - Get language section
- `getLearnKurdishDance()` - Get dance section
- `getLearnKurdishHeritage()` - Get heritage section

## Error Handling

All API functions throw errors that you should catch:

```javascript
try {
  const data = await getEvents();
  // Use data
} catch (error) {
  // Handle error
  console.error('Failed to fetch events:', error.message);
  // Show error message to user
}
```

## Common Patterns

### Loading Multiple Endpoints

```javascript
async function loadAllData() {
  try {
    const [about, events, footnotes] = await Promise.all([
      getAbout(),
      getEvents(),
      getFootnotes()
    ]);
    
    // Use all data
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Conditional Loading

```javascript
async function loadEvent(id) {
  if (!id) return null;
  
  try {
    return await getEventById(id);
  } catch (error) {
    console.error('Error loading event:', error);
    return null;
  }
}
```

### POST Request (Newsletter)

```javascript
import { subscribeToNewsletter } from './api';

async function handleSubscribe(formData) {
  try {
    const result = await subscribeToNewsletter({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber || null,
      job: formData.job || null,
      country: formData.country || null,
      city: formData.city || null
    });
    
    console.log('Subscribed!', result);
    return result;
  } catch (error) {
    console.error('Subscription failed:', error);
    throw error;
  }
}
```

## Testing the API

You can test the API functions in the browser console or in a simple script:

```javascript
// Test in browser console (make sure backend is running)
import { getAbout, getEvents } from './api';

getAbout().then(data => console.log('About:', data));
getEvents().then(data => console.log('Events:', data));
```

## Troubleshooting

### CORS Errors
- Make sure your backend server is running
- Check that CORS is enabled in backend (`app.use(cors())`)
- Verify the API base URL is correct

### Network Errors
- Check that the backend is running on the expected port (default: 3000)
- Verify the endpoint URLs are correct
- Check browser console for detailed error messages

### Data Format Issues
- Check the API documentation for expected response formats
- Use browser DevTools Network tab to inspect responses
- Verify data structure matches your expectations

