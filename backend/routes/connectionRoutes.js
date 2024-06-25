const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");

router.post("/addConnections", connectionController.createConnection);
router.get("/:id", connectionController.getConnectionById);
router.put("/:id", connectionController.updateConnection);
router.put("/:id", connectionController.updateConnectionVersion);

// router.get("/", connectionController.getConnections);

module.exports = router;
