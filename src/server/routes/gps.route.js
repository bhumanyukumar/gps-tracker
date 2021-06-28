const router = require("express").Router();
const { GPSController } = require("../controllers")
router.post("/", GPSController.gps);
module.exports = router;