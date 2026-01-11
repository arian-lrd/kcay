const router = require("express").Router();
const podcastController = require("../controllers/podcastController");

router.get("/latest", podcastController.getLatestPodcast);  // /podcast/latest
router.get("/recent", podcastController.getRecentPodcasts); // /podcast/recent?limit=5
router.get("/", podcastController.getAllPodcasts);          // /podcast
router.get("/:id/transcript/:language", podcastController.getPodcastTranscript); // /podcast/:id/transcript/:language
router.get("/:id", podcastController.getPodcastById);       // /podcast/:id

module.exports = router;

