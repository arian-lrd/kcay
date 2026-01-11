const router = require("express").Router();
const learnController = require("../controllers/learnController");

router.get("/", learnController.getMainLearn);                              // /learn
router.get("/kurdish-language", learnController.getKurdishLanguage);        // /learn/kurdish-language
router.get("/kurdish-dance", learnController.getKurdishDance);              // /learn/kurdish-dance
router.get("/kurdish-heritage", learnController.getKurdishHeritage);        // /learn/kurdish-heritage

module.exports = router;

