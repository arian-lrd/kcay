const router = require("express").Router();
const getInvolvedController = require("../controllers/getInvolvedController");

router.get("/", getInvolvedController.getInvolved);

module.exports = router;

