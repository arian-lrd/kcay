const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

router.get("/calendar", eventsController.getCalendarEvents);  // /events/calendar
//?start=2025-01-01&end=2026-01-01
router.get("/", eventsController.getEventsPage);   // /events
router.get("/:id", eventsController.getEvent);      // /events/345

module.exports = router;