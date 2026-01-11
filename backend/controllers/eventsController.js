const eventsModel = require("../models/eventsModel");

const getEventsPage = async (req, res, next) => {
    try {
        const upcomingLmit = req.query.upcomingLimit ?? 10;
        const pastLimit = req.query.pastLimit ?? 20;

        console.log('Fetching events...');
        const [upcoming, past] = await Promise.all([
            eventsModel.getUpcomingEvents(upcomingLmit),
            eventsModel.getPastEvents(pastLimit),
        ]);

        console.log('Events fetched - Upcoming:', upcoming.length, 'Past:', past.length);
        res.json({ upcoming, past });
    } catch (error) {
        console.error('Error in getEventsPage:', error);
        next(error);
    }    
};

const getEvent = async (req, res, next) => {
    try {
        const event = await eventsModel.getEventById(req.params.id);
        if (!event) return res.status(404).json({error: "Event not found"});
        res.json(event);
    } catch (error) {
        next(error);
    }
};

const getCalendarEvents = async (req, res, next) => {
    try {
        // Optional query parameters for date range filtering
        const startDate = req.query.start || null;
        const endDate = req.query.end || null;
        
        const events = await eventsModel.getCalendarEvents(startDate, endDate);
        res.json(events);
    } catch (error) {
        next(error);
    }
};

module.exports = {getEventsPage, getEvent, getCalendarEvents};

