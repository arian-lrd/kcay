const router = require("express").Router();
const footnotesController = require("../controllers/footnotesController");

router.get("/", footnotesController.getFootnotes);

module.exports = router;

