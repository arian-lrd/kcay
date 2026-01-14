const db = require("../config/database");

// Toggle between Cloudinary and database (set USE_CLOUDINARY=true in .env to use Cloudinary)
const USE_CLOUDINARY_ENV = process.env.USE_CLOUDINARY;
const USE_CLOUDINARY = USE_CLOUDINARY_ENV === 'true' || USE_CLOUDINARY_ENV === true;

// Lazy load Cloudinary service only when needed
let cloudinaryService = null;
function getCloudinaryService() {
  if (!cloudinaryService && USE_CLOUDINARY) {
    try {
      cloudinaryService = require('../services/cloudinaryService');
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return null;
      }
    } catch (error) {
      console.warn('⚠️ Cloudinary service not available for events');
      return null;
    }
  }
  return cloudinaryService;
}

// Helper function to convert event title to Cloudinary folder name
// "First Executive Meeting" -> "First-Executive-Meeting"
function titleToFolderName(title) {
  return title.replace(/\s+/g, '-');
}

// Helper function to get thumbnail URL from Cloudinary for an event
async function getEventThumbnailFromCloudinary(eventTitle) {
  try {
    const service = getCloudinaryService();
    if (!service) {
      return null;
    }
    
    const folderName = titleToFolderName(eventTitle);
    const eventImages = await service.getEventImages(folderName, 'gallery');
    
    // Find thumbnail image (should be first after sorting, or filter by filename)
    const thumbnail = eventImages.find(img => 
      img.filename === 'thumbnail' || img.public_id?.includes('thumbnail')
    ) || eventImages[0]; // Fallback to first image if no thumbnail found
    
    return thumbnail?.url || null;
  } catch (error) {
    console.warn(`⚠️ Error fetching thumbnail for event "${eventTitle}":`, error.message);
    return null;
  }
}

async function getUpcomingEvents(limit = 10) {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, title, description, event_date, location, sort_order
            FROM events 
            WHERE event_date >= NOW()
            ORDER BY event_date ASC, sort_order ASC
            LIMIT ?
        `,
        [Number(limit)]
    );
    
    // Fetch thumbnails from Cloudinary if enabled
    if (USE_CLOUDINARY) {
        const eventsWithThumbnails = await Promise.all(
            rows.map(async (event) => {
                const thumbnailUrl = await getEventThumbnailFromCloudinary(event.title);
                return {
                    ...event,
                    cover_url: thumbnailUrl || null
                };
            })
        );
        return eventsWithThumbnails;
    }
    
    // Fallback: return events without cover_url (or use old cover_slug if needed)
    return rows.map(event => ({ ...event, cover_url: null }));
}

async function getPastEvents(limit = 10) {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, title, description, event_date, location, sort_order
            FROM events
            WHERE event_date < NOW()
            ORDER BY event_date DESC, sort_order ASC
            LIMIT ?
        `,
        [Number(limit)]
    );
    
    // Fetch thumbnails from Cloudinary if enabled
    if (USE_CLOUDINARY) {
        const eventsWithThumbnails = await Promise.all(
            rows.map(async (event) => {
                const thumbnailUrl = await getEventThumbnailFromCloudinary(event.title);
                return {
                    ...event,
                    cover_url: thumbnailUrl || null
                };
            })
        );
        return eventsWithThumbnails;
    }
    
    // Fallback: return events without cover_url
    return rows.map(event => ({ ...event, cover_url: null }));
}

async function getEventById(id) {
    const [rows] = await db.promise.query(
        `
        SELECT
            id, title, description, event_date, location, sort_order
            FROM events 
            WHERE id = ?
            LIMIT 1
        `, 
        [id]
    );
    
    if (!rows[0]) {
        return null;
    }
    
    const event = rows[0];
    
    // Fetch thumbnail from Cloudinary if enabled
    if (USE_CLOUDINARY) {
        const thumbnailUrl = await getEventThumbnailFromCloudinary(event.title);
        return {
            ...event,
            cover_slug: thumbnailUrl || null
        };
    }
    
    // Fallback: return event without cover_slug
    return { ...event, cover_slug: null };
}

async function getCalendarEvents(startDate = null, endDate = null) {
    // Get all events (past and future) by default, or within date range if provided
    let query = `
        SELECT 
            id, title, description, event_date, location, sort_order
        FROM events 
        WHERE 1=1
    `;
    const params = [];

    if (startDate) {
        query += ` AND event_date >= ?`;
        params.push(startDate);
    }
    // No default date filter - show all events (past and future)

    if (endDate) {
        query += ` AND event_date <= ?`;
        params.push(endDate);
    }

    query += ` ORDER BY event_date ASC, sort_order ASC`;

    const [rows] = await db.promise.query(query, params);
    
    // Fetch thumbnails from Cloudinary if enabled
    let eventsWithThumbnails = rows;
    if (USE_CLOUDINARY) {
        eventsWithThumbnails = await Promise.all(
            rows.map(async (event) => {
                const thumbnailUrl = await getEventThumbnailFromCloudinary(event.title);
                return {
                    ...event,
                    cover_url: thumbnailUrl || null
                };
            })
        );
    } else {
        eventsWithThumbnails = rows.map(event => ({ ...event, cover_url: null }));
    }
    
    // Format events for calendar libraries (FullCalendar format)
    return eventsWithThumbnails.map(event => ({
        id: event.id,
        title: event.title,
        start: event.event_date, // ISO format date string
        description: event.description,
        location: event.location,
        url: `/events/${event.id}`, // Link to event detail page
        extendedProps: {
            description: event.description,
            location: event.location,
            coverUrl: event.cover_url
        }
    }));
}

module.exports = {
    getUpcomingEvents, 
    getPastEvents,
    getEventById,
    getCalendarEvents
};