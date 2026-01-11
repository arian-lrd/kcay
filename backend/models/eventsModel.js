const db = require("../config/database");

async function getUpcomingEvents(limit = 10) {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, title, description, event_date, location, sort_order,
            CONCAT('/assets/images/events/', cover_slug, '.jpg') AS cover_url
            FROM events 
            WHERE event_date >= NOW()
            ORDER BY event_date ASC, sort_order ASC
            LIMIT ?
        `,
        [Number(limit)]
    );
    return rows;
}

async function getPastEvents(limit = 10) {
    const [rows] = await db.promise.query(
        `
        SELECT 
            id, title, description, event_date, location, sort_order,
            CONCAT('/assets/images/events/', cover_slug, '.jpg') AS cover_url
            FROM events
            WHERE event_date < NOW()
            ORDER BY event_date DESC, sort_order ASC
            LIMIT ?
        `,
        [Number(limit)]
    );
    return rows;
}

async function getEventById(id) {
    const [rows] = await db.promise.query(
        `
        SELECT
            id, title, description, event_date, location, sort_order,
            CONCAT('/assets/images/events/', cover_slug, '.jpg') AS cover_slug
            FROM events 
            WHERE id = ?
            LIMIT 1
        `, 
        [id]
    );
    return rows[0] || null;
}

async function getCalendarEvents(startDate = null, endDate = null) {
    // Get all events (past and future) by default, or within date range if provided
    let query = `
        SELECT 
            id, title, description, event_date, location, sort_order,
            CONCAT('/assets/images/events/', cover_slug, '.jpg') AS cover_url
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
    
    // Format events for calendar libraries (FullCalendar format)
    return rows.map(event => ({
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