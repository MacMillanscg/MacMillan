const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");

router.post("/addConnections", connectionController.createConnection);

module.exports = router;
