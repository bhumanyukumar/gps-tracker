const router = require("express").Router();
const loginRoute = require("./login.route");
const heartBeatRoute = require("./heartbeat.route");
const gpsRoute = require("./gps.route");
router.use("/login", loginRoute);
router.use("/heartbeat", heartBeatRoute);
router.use("/gps", gpsRoute);
module.exports = router;