const router = require("express").Router();
const notableFiguresController = require("../controllers/notableFiguresController");

router.get("/", notableFiguresController.getAllNotableFigures);  // /notable-figures
router.get("/:id", notableFiguresController.getNotableFigure);    // /notable-figures/123

module.exports = router;

