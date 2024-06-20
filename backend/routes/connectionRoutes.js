const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");

router.post("/addConnections", connectionController.createConnection);
router.get("/:id", connectionController.getConnectionById);
// router.get("/", connectionController.getConnections);

module.exports = router;
