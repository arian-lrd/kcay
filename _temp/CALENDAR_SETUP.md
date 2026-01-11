# Calendar Setup Guide

## Overview

Your backend is now ready for calendar integration! The API endpoint `/events/calendar` returns events in a format compatible with popular calendar libraries.

**By default, the calendar shows ALL events (both past and future)** so visitors can see your organization's history and upcoming events.

## Backend API

**Endpoint:** `GET /events/calendar`

**Query Parameters (optional):**
- `start` - Start date for filtering (ISO format: `2024-01-01`)
- `end` - End date for filtering (ISO format: `2024-12-31`)

**Response Format:**
```json
[
  {
    "id": 1,
    "title": "Event Title",
    "start": "2024-03-15T18:00:00.000Z",
    "description": "Event description",
    "location": "Event location",
    "url": "/events/1",
    "extendedProps": {
      "description": "Event description",
      "location": "Event location",
      "coverUrl": "/assets/images/events/event-cover.jpg"
    }
  }
]
```

## Recommended Library: FullCalendar

**FullCalendar** is the easiest and most popular calendar library. It's well-documented and works great with React, Vue, Angular, or vanilla JavaScript.

### Why FullCalendar?
- ✅ Easiest to implement
- ✅ Works with React, Vue, Angular, or plain JavaScript
- ✅ Great documentation
- ✅ Beautiful default styling
- ✅ Mobile responsive
- ✅ Supports event clicking, tooltips, and more

## Setup Instructions

### Option 1: React + FullCalendar (Recommended)

#### 1. Install Dependencies

If using React:
```bash
cd frontend
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
```

#### 2. Create Calendar Component

Create `frontend/src/components/Calendar.jsx`:

```jsx
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events/calendar');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleDateClick = (arg) => {
    // Handle date click if needed
    console.log('Date clicked:', arg.dateStr);
  };

  const handleEventClick = (arg) => {
    // Navigate to event detail page
    if (arg.event.url) {
      window.location.href = arg.event.url;
      arg.jsEvent.preventDefault(); // prevent browser navigation
    }
  };

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
        eventDisplay="block"
      />
    </div>
  );
}

export default Calendar;
```

#### 3. Use the Component

In your main page or route:
```jsx
import Calendar from './components/Calendar';

function App() {
  return (
    <div>
      <h1>Events Calendar</h1>
      <Calendar />
    </div>
  );
}
```

### Option 2: Vue + FullCalendar

#### 1. Install Dependencies
```bash
cd frontend
npm install @fullcalendar/vue3 @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
```

#### 2. Create Calendar Component

Create `frontend/src/components/Calendar.vue`:

```vue
<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        },
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick
      }
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await fetch('http://localhost:3000/events/calendar');
        const data = await response.json();
        this.calendarOptions.events = data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    handleDateClick(arg) {
      console.log('Date clicked:', arg.dateStr);
    },
    handleEventClick(arg) {
      if (arg.event.url) {
        window.location.href = arg.event.url;
        arg.jsEvent.preventDefault();
      }
    }
  }
};
</script>
```

### Option 3: Vanilla JavaScript (No Framework)

#### 1. Install Dependencies
```bash
npm install @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction
```

#### 2. HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link href='https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.10/main.min.css' rel='stylesheet' />
  <link href='https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.10/main.min.css' rel='stylesheet' />
</head>
<body>
  <div id='calendar'></div>

  <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.10/main.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid@6.1.10/main.min.js'></script>
  <script src='https://cdn.jsdelivr.net/npm/@fullcalendar/interaction@6.1.10/main.min.js'></script>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const calendarEl = document.getElementById('calendar');
      
      fetch('http://localhost:3000/events/calendar')
        .then(response => response.json())
        .then(events => {
          const calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [FullCalendar.dayGridPlugin, FullCalendar.interactionPlugin],
            initialView: 'dayGridMonth',
            events: events,
            eventClick: function(arg) {
              if (arg.event.url) {
                window.location.href = arg.event.url;
              }
            }
          });
          calendar.render();
        })
        .catch(error => console.error('Error:', error));
    });
  </script>
</body>
</html>
```

## Adding New Events

To add new events to the calendar, simply insert them into your `events` table in MySQL:

```sql
INSERT INTO events (title, description, event_date, location, cover_slug, sort_order)
VALUES 
  ('New Year Celebration', 'Join us for New Year!', '2025-01-01 18:00:00', 'Main Hall', 'newyear', 1),
  ('Spring Festival', 'Annual spring celebration', '2025-03-20 14:00:00', 'Park', 'spring', 2);
```

The calendar will automatically show **all events** (both past and future) from your database. This way visitors can see your organization's history as well as upcoming events. If you want to filter to only future events, you can use the `start` query parameter: `/events/calendar?start=2024-01-01` (using today's date).

## Styling & Customization

FullCalendar can be customized with CSS. You can also use different views:
- `dayGridMonth` - Monthly view (default)
- `dayGridWeek` - Weekly view
- `timeGridWeek` - Week view with time slots
- `timeGridDay` - Single day view with time slots
- `listWeek` - List view

For more customization options, visit: https://fullcalendar.io/docs

## Alternative Libraries (If you prefer)

1. **react-big-calendar** - Good for React, but requires more setup
2. **react-calendar** - Very simple, but less features
3. **calendar.js** - Lightweight vanilla JS option

FullCalendar is recommended because it's the easiest to use and has the best documentation.

