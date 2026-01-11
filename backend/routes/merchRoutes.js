const router = require('express').Router();
const merchController = require('../controllers/merchController');

router.get('/', merchController.getMerch);

module.exports = router;

