const router = require("express").Router();
const { HeartBeatController } = require("../controllers")
router.post("/check", HeartBeatController.check);
module.exports = router;