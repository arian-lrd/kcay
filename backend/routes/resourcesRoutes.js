const router = require('express').Router();
const resourcesController = require('../controllers/resourcesController');

router.get('/gallery', resourcesController.getGallery);
router.get('/gallery/event/:eventFolder', resourcesController.getEventImages); // NEW: Get all images from a specific event
router.get('/constitution', resourcesController.getConstitution);

module.exports = router;

