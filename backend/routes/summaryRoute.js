const router = require("express").Router();
const summaryController = require("../Controllers/summaryControllers");

router.post("/verify-eshipper", summaryController.verifyEShipperCredential);

module.exports = router;
