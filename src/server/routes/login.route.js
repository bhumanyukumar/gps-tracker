const router = require("express").Router();
const { LoginController } = require("../controllers")
router.post("/", LoginController.login);
module.exports = router;