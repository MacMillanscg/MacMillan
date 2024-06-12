const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");

router.post("/addconnection", connectionController.createConnection);

module.exports = router;
